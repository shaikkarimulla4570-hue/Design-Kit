import JSZip from 'jszip';

export interface ImageDimensions {
  width: number;
  height: number;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  return `${val} ${sizes[i] || 'MB'}`;
}

export function getImageDimensions(file: File | Blob | string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let objectUrl: string | null = null;

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (typeof file !== 'string') {
        const reader = new FileReader();
        reader.onload = () => {
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            resolve({ width: fallbackImg.naturalWidth, height: fallbackImg.naturalHeight });
          };
          fallbackImg.onerror = () => reject(new Error('Failed to load image for dimensions check'));
          fallbackImg.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to load image for dimensions check'));
        reader.readAsDataURL(file);
      } else {
        reject(new Error('Failed to load image for dimensions check'));
      }
    };

    if (typeof file === 'string') {
      img.src = file;
    } else {
      try {
        objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to load image for dimensions check'));
        reader.readAsDataURL(file);
      }
    }
  });
}

export function loadImage(source: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    // CRITICAL: NEVER set crossOrigin on blob: or data: URIs or File/Blob objects!
    // Setting crossOrigin = 'anonymous' on a blob: URI causes instant browser CORS security failure.
    if (typeof source === 'string' && (source.startsWith('http://') || source.startsWith('https://'))) {
      img.crossOrigin = 'anonymous';
    }

    let objectUrl: string | null = null;

    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      // If source was a File/Blob and createObjectURL failed, fallback to FileReader dataURL
      if (typeof source !== 'string') {
        const reader = new FileReader();
        reader.onload = () => {
          const fallbackImg = new Image();
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = () => reject(new Error('Failed to load image from file data'));
          fallbackImg.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(source);
      } else {
        reject(new Error('Failed to load image'));
      }
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      try {
        objectUrl = URL.createObjectURL(source);
        img.src = objectUrl;
      } catch {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
        reader.readAsDataURL(source);
      }
    }
  });
}

export function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string = 'image/jpeg', quality: number = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to blob conversion failed'));
        }
      },
      mimeType,
      quality
    );
  });
}

export interface CompressOptions {
  mode: 'target' | 'quality';
  targetBytes?: number; // e.g. 100 * 1024
  qualityPercent?: number; // 10 to 100
  outputFormat?: 'image/jpeg' | 'image/webp' | 'image/png';
  maxWidth?: number;
  maxHeight?: number;
  preserveAspectRatio?: boolean;
  onProgress?: (status: string) => void;
}

export interface CompressResult {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  format: string;
  qualityUsed?: number;
  reachedTarget: boolean;
  message?: string;
}

/**
 * Intelligent client-side image compression with bounded binary search and progressive resizing
 */
export async function compressImage(file: File, options: CompressOptions): Promise<CompressResult> {
  const { onProgress } = options;
  onProgress?.('Loading image...');
  const img = await loadImage(file);

  let targetW = img.naturalWidth;
  let targetH = img.naturalHeight;

  // Apply maximum dimensions if requested
  if (options.maxWidth && options.maxWidth > 0 && targetW > options.maxWidth) {
    const ratio = options.maxWidth / targetW;
    targetW = Math.round(options.maxWidth);
    targetH = Math.round(targetH * ratio);
  }
  if (options.maxHeight && options.maxHeight > 0 && targetH > options.maxHeight) {
    const ratio = options.maxHeight / targetH;
    targetH = Math.round(options.maxHeight);
    targetW = Math.round(targetW * ratio);
  }

  const format = options.outputFormat || (file.type === 'image/png' ? 'image/png' : 'image/jpeg');

  // Helper to draw at given dimensions
  const renderCanvas = (w: number, h: number, fillBg: boolean = true) => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w));
    canvas.height = Math.max(1, Math.round(h));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    // Fill white background for JPEG
    if (fillBg && format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  };

  if (options.mode === 'quality') {
    onProgress?.('Compressing with quality setting...');
    const q = Math.max(0.05, Math.min(1, (options.qualityPercent || 80) / 100));
    const canvas = renderCanvas(targetW, targetH);
    const blob = await canvasToBlob(canvas, format, q);

    return {
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      width: canvas.width,
      height: canvas.height,
      format,
      qualityUsed: Math.round(q * 100),
      reachedTarget: true,
      message: `Compressed at ${Math.round(q * 100)}% quality`,
    };
  }

  // MODE: TARGET FILE SIZE
  const targetBytes = options.targetBytes || 100 * 1024;
  onProgress?.(`Targeting ${formatBytes(targetBytes)}...`);

  // If PNG is requested for target size, explain that PNG is lossless
  if (format === 'image/png') {
    onProgress?.('Processing PNG...');
    let currW = targetW;
    let currH = targetH;
    let canvas = renderCanvas(currW, currH, false);
    let blob = await canvasToBlob(canvas, 'image/png');

    // PNG only reduces size by reducing pixel dimensions
    let attempts = 0;
    while (blob.size > targetBytes && attempts < 5 && currW > 120 && currH > 120) {
      attempts++;
      const scale = Math.sqrt(targetBytes / blob.size) * 0.95;
      currW = Math.max(100, Math.round(currW * Math.min(0.85, scale)));
      currH = Math.max(100, Math.round(currH * Math.min(0.85, scale)));
      onProgress?.(`Resizing PNG dimensions to ${currW}x${currH}...`);
      canvas = renderCanvas(currW, currH, false);
      blob = await canvasToBlob(canvas, 'image/png');
    }

    return {
      blob,
      url: URL.createObjectURL(blob),
      size: blob.size,
      width: canvas.width,
      height: canvas.height,
      format: 'image/png',
      reachedTarget: blob.size <= targetBytes,
      message:
        blob.size <= targetBytes
          ? `Target reached by optimizing PNG dimensions`
          : `PNG is lossless; switch to WebP or JPG to compress further without resizing`,
    };
  }

  // Lossy target search (JPEG / WebP)
  let bestBlob: Blob | null = null;
  let bestQuality = 0.8;
  let currentW = targetW;
  let currentH = targetH;
  let reachedTarget = false;

  let currentCanvas = renderCanvas(currentW, currentH);

  // Binary search on quality (0.05 to 0.98)
  let low = 0.05;
  let high = 0.98;
  const iterations = 7;

  for (let i = 0; i < iterations; i++) {
    const mid = (low + high) / 2;
    onProgress?.(`Optimizing quality (${Math.round(mid * 100)}%)...`);
    const testBlob = await canvasToBlob(currentCanvas, format, mid);

    if (testBlob.size <= targetBytes) {
      bestBlob = testBlob;
      bestQuality = mid;
      reachedTarget = true;
      // We are below target, try higher quality to improve fidelity
      low = mid;
    } else {
      // Too large, decrease quality
      high = mid;
      if (!bestBlob || testBlob.size < bestBlob.size) {
        bestBlob = testBlob;
        bestQuality = mid;
      }
    }
  }

  // If even at minimum quality it exceeds the target, progressively scale down dimensions
  if (bestBlob && bestBlob.size > targetBytes) {
    onProgress?.('Adjusting dimensions to reach target size...');
    let dimScaleAttempts = 0;
    while (bestBlob.size > targetBytes && dimScaleAttempts < 5 && currentW > 160 && currentH > 160) {
      dimScaleAttempts++;
      const scale = Math.min(0.85, Math.sqrt(targetBytes / bestBlob.size) * 0.95);
      currentW = Math.max(120, Math.round(currentW * scale));
      currentH = Math.max(120, Math.round(currentH * scale));
      currentCanvas = renderCanvas(currentW, currentH);
      bestQuality = 0.75;
      bestBlob = await canvasToBlob(currentCanvas, format, bestQuality);

      if (bestBlob.size <= targetBytes) {
        reachedTarget = true;
        break;
      }
    }
  }

  if (!bestBlob) {
    bestBlob = await canvasToBlob(currentCanvas, format, 0.7);
  }

  return {
    blob: bestBlob,
    url: URL.createObjectURL(bestBlob),
    size: bestBlob.size,
    width: currentCanvas.width,
    height: currentCanvas.height,
    format,
    qualityUsed: Math.round(bestQuality * 100),
    reachedTarget: bestBlob.size <= targetBytes,
    message: reachedTarget
      ? `Successfully compressed under target (${formatBytes(bestBlob.size)})`
      : `Best achieved size is ${formatBytes(bestBlob.size)} (Target: ${formatBytes(targetBytes)})`,
  };
}

/**
 * Resize Image function
 */
export async function resizeImage(
  file: File,
  width: number,
  height: number,
  format: string = 'image/jpeg',
  quality: number = 0.92
): Promise<{ blob: Blob; url: string; width: number; height: number; size: number }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await canvasToBlob(canvas, format, quality);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
  };
}

/**
 * Crop image function
 */
export async function cropImage(
  file: File,
  cropArea: { x: number; y: number; width: number; height: number },
  format: string = 'image/png'
): Promise<{ blob: Blob; url: string; width: number; height: number; size: number }> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(cropArea.width));
  canvas.height = Math.max(1, Math.round(cropArea.height));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const blob = await canvasToBlob(canvas, format, 0.95);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
  };
}

/**
 * Rotate & Flip image function
 */
export async function rotateAndFlipImage(
  file: File,
  angleDeg: number,
  flipH: boolean,
  flipV: boolean,
  format: string = 'image/png'
): Promise<{ blob: Blob; url: string; width: number; height: number; size: number }> {
  const img = await loadImage(file);
  const rad = (angleDeg * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));

  const newW = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
  const newH = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);

  const canvas = document.createElement('canvas');
  canvas.width = newW;
  canvas.height = newH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  const blob = await canvasToBlob(canvas, format, 0.95);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
  };
}

/**
 * Watermark image function
 */
export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  opacity?: number;
  rotation?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'center' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';
  logoFile?: File;
  logoScale?: number;
}

export async function applyWatermark(
  baseFile: File,
  options: WatermarkOptions
): Promise<{ blob: Blob; url: string; width: number; height: number; size: number }> {
  const baseImg = await loadImage(baseFile);
  const canvas = document.createElement('canvas');
  canvas.width = baseImg.naturalWidth;
  canvas.height = baseImg.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  ctx.drawImage(baseImg, 0, 0);

  ctx.save();
  ctx.globalAlpha = options.opacity !== undefined ? options.opacity : 0.7;

  if (options.type === 'text' && options.text) {
    const fontSize = options.fontSize || Math.max(18, Math.round(canvas.width / 24));
    const fontFam = options.fontFamily || 'Arial, sans-serif';
    ctx.font = `bold ${fontSize}px ${fontFam}`;
    ctx.fillStyle = options.textColor || '#FFFFFF';
    ctx.textBaseline = 'middle';

    const metrics = ctx.measureText(options.text);
    const textW = metrics.width;
    const textH = fontSize;

    if (options.position === 'tile') {
      const stepX = textW + 80;
      const stepY = textH + 80;
      const rotRad = ((options.rotation || -25) * Math.PI) / 180;
      for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotRad);
          // subtle stroke for legibility
          ctx.strokeStyle = 'rgba(0,0,0,0.4)';
          ctx.lineWidth = Math.max(1, fontSize / 16);
          ctx.strokeText(options.text, 0, 0);
          ctx.fillText(options.text, 0, 0);
          ctx.restore();
        }
      }
    } else {
      let x = canvas.width / 2 - textW / 2;
      let y = canvas.height / 2;
      const padding = 30;

      switch (options.position) {
        case 'top-left':
          x = padding;
          y = padding + textH / 2;
          break;
        case 'top-center':
          x = (canvas.width - textW) / 2;
          y = padding + textH / 2;
          break;
        case 'top-right':
          x = canvas.width - textW - padding;
          y = padding + textH / 2;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding - textH / 2;
          break;
        case 'bottom-center':
          x = (canvas.width - textW) / 2;
          y = canvas.height - padding - textH / 2;
          break;
        case 'bottom-right':
          x = canvas.width - textW - padding;
          y = canvas.height - padding - textH / 2;
          break;
        default:
          x = (canvas.width - textW) / 2;
          y = canvas.height / 2;
      }

      ctx.save();
      ctx.translate(x + textW / 2, y);
      if (options.rotation) {
        ctx.rotate((options.rotation * Math.PI) / 180);
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.lineWidth = Math.max(1, fontSize / 14);
      ctx.strokeText(options.text, -textW / 2, 0);
      ctx.fillText(options.text, -textW / 2, 0);
      ctx.restore();
    }
  } else if (options.type === 'image' && options.logoFile) {
    const logoImg = await loadImage(options.logoFile);
    const scale = (options.logoScale || 25) / 100;
    const maxLogoW = canvas.width * scale;
    const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
    const logoW = maxLogoW;
    const logoH = maxLogoW / aspect;

    let x = (canvas.width - logoW) / 2;
    let y = (canvas.height - logoH) / 2;
    const padding = 30;

    switch (options.position) {
      case 'top-left':
        x = padding;
        y = padding;
        break;
      case 'top-center':
        x = (canvas.width - logoW) / 2;
        y = padding;
        break;
      case 'top-right':
        x = canvas.width - logoW - padding;
        y = padding;
        break;
      case 'bottom-left':
        x = padding;
        y = canvas.height - logoH - padding;
        break;
      case 'bottom-center':
        x = (canvas.width - logoW) / 2;
        y = canvas.height - logoH - padding;
        break;
      case 'bottom-right':
        x = canvas.width - logoW - padding;
        y = canvas.height - logoH - padding;
        break;
    }

    ctx.drawImage(logoImg, x, y, logoW, logoH);
  }

  ctx.restore();

  const blob = await canvasToBlob(canvas, 'image/png');
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
  };
}

/**
 * Trigger file download in browser
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Built-in high-quality sample image generator for instant testing
 */
export function createSampleImage(type: 'landscape' | 'portrait' | 'icon' | 'badge'): File {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  if (type === 'landscape') {
    canvas.width = 1200;
    canvas.height = 800;
    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, 500);
    sky.addColorStop(0, '#0284c7');
    sky.addColorStop(0.6, '#38bdf8');
    sky.addColorStop(1, '#fed7aa');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1200, 800);

    // Sun
    ctx.beginPath();
    ctx.arc(600, 320, 90, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Mountains back
    ctx.beginPath();
    ctx.moveTo(100, 600);
    ctx.lineTo(400, 260);
    ctx.lineTo(700, 600);
    ctx.fillStyle = '#64748b';
    ctx.fill();

    // Mountains front
    ctx.beginPath();
    ctx.moveTo(450, 600);
    ctx.lineTo(800, 220);
    ctx.lineTo(1150, 600);
    ctx.fillStyle = '#475569';
    ctx.fill();

    // Mountain caps (snow)
    ctx.beginPath();
    ctx.moveTo(800, 220);
    ctx.lineTo(850, 280);
    ctx.lineTo(750, 280);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();

    // Lake / foreground
    const lake = ctx.createLinearGradient(0, 560, 0, 800);
    lake.addColorStop(0, '#0369a1');
    lake.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = lake;
    ctx.fillRect(0, 560, 1200, 240);

    // Reflection ripples
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let i = 0; i < 20; i++) {
      ctx.fillRect(300 + Math.random() * 600, 580 + i * 10, 40 + Math.random() * 80, 2);
    }
  } else if (type === 'portrait') {
    canvas.width = 600;
    canvas.height = 600;
    // Studio backdrop gradient
    const bg = ctx.createRadialGradient(300, 300, 50, 300, 300, 350);
    bg.addColorStop(0, '#e0f2fe');
    bg.addColorStop(1, '#bae6fd');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 600);

    // Shoulders
    ctx.beginPath();
    ctx.ellipse(300, 540, 180, 120, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0284c7';
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(300, 280, 110, 0, Math.PI * 2);
    ctx.fillStyle = '#fcd34d';
    ctx.fill();

    // Glasses / smile
    ctx.beginPath();
    ctx.arc(260, 270, 24, 0, Math.PI * 2);
    ctx.arc(340, 270, 24, 0, Math.PI * 2);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(300, 330, 35, 0.2, Math.PI - 0.2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1e293b';
    ctx.stroke();
  } else {
    canvas.width = 512;
    canvas.height = 512;
    // App icon background rounded
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#2563eb');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Letter 'D' logo
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 240px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('D', 256, 260);
  }

  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], `sample-${type}.jpg`, { type: 'image/jpeg' });
}
