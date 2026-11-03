import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Star,
  Download,
  Image as ImageIcon,
  Type,
  FileArchive,
  Search,
  Globe,
  Sliders,
  Copy,
  Check,
  Code2,
  Move,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileCode,
  Info,
} from 'lucide-react';
import JSZip from 'jszip';
import { Dropzone } from '../../components/common/Dropzone';
import { loadImage, downloadBlob } from '../../utils/imageProcessors';
import { useI18n } from '../../i18n/I18nContext';
import {
  FAVICON_FONTS,
  LANGUAGE_OPTIONS,
  LANGUAGE_FONT_COUNTS,
  FaviconFontItem,
  LanguageId,
  FontCategory,
  loadGoogleFontsBatch,
  ensureFontLoaded,
  createIcoFromPngBlobs,
} from './faviconFonts';

export type FaviconShape = 'square' | 'rounded' | 'circle' | 'squircle' | 'custom';

interface FaviconSpec {
  size: number;
  filename: string;
  label: string;
  rel: 'icon' | 'apple-touch-icon';
  includeInHtmlDefault: boolean;
}

const FAVICON_SPECS: FaviconSpec[] = [
  {
    size: 16,
    filename: 'favicon-16x16.png',
    label: 'Browser Tab',
    rel: 'icon',
    includeInHtmlDefault: true,
  },
  {
    size: 32,
    filename: 'favicon-32x32.png',
    label: 'Standard Retinas',
    rel: 'icon',
    includeInHtmlDefault: true,
  },
  {
    size: 48,
    filename: 'favicon-48x48.png',
    label: 'Desktop Shortcut',
    rel: 'icon',
    includeInHtmlDefault: true,
  },
  {
    size: 180,
    filename: 'apple-touch-icon.png',
    label: 'Apple Touch Icon',
    rel: 'apple-touch-icon',
    includeInHtmlDefault: true,
  },
  {
    size: 192,
    filename: 'android-chrome-192x192.png',
    label: 'Android / Chrome',
    rel: 'icon',
    includeInHtmlDefault: true,
  },
  {
    size: 512,
    filename: 'android-chrome-512x512.png',
    label: 'PWA Splash',
    rel: 'icon',
    includeInHtmlDefault: false,
  },
];

export interface GeneratedFaviconAsset {
  size: number;
  filename: string;
  label: string;
  rel: 'icon' | 'apple-touch-icon';
  url: string;
  blob: Blob;
}

const FONT_CATEGORIES: FontCategory[] = [
  'All',
  'Sans-Serif',
  'Serif',
  'Display',
  'Handwriting',
  'Monospace',
];

const COLOR_PRESETS = [
  { name: 'Royal Blue', bg: '#2563EB', fg: '#FFFFFF' },
  { name: 'Midnight Slate', bg: '#0F172A', fg: '#F8FAFC' },
  { name: 'Emerald', bg: '#059669', fg: '#FFFFFF' },
  { name: 'Crimson', bg: '#DC2626', fg: '#FFFFFF' },
  { name: 'Amber Gold', bg: '#D97706', fg: '#FFFFFF' },
  { name: 'Deep Indigo', bg: '#4338CA', fg: '#FFFFFF' },
  { name: 'Soft Ivory', bg: '#F8FAFC', fg: '#0F172A' },
  { name: 'Warm Saffron', bg: '#EA580C', fg: '#FFFFFF' },
];

/**
 * Grapheme-safe slicer so Telugu/Hindi/Indic aksharams (e.g. శ్రీ, श्री, తె) and emojis never split mid-cluster.
 */
function sliceGraphemes(input: string, maxClusters: number = 4): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new (Intl as unknown as {
      Segmenter: new (
        locales?: string,
        options?: { granularity: string }
      ) => { segment: (str: string) => Iterable<{ segment: string }> };
    }).Segmenter(undefined, { granularity: 'grapheme' });
    const segments = Array.from(segmenter.segment(trimmed), (s) => s.segment);
    return segments.slice(0, maxClusters).join('');
  }
  return Array.from(trimmed).slice(0, maxClusters).join('');
}

/**
 * Applies the selected FaviconShape clip path onto a square [0..size, 0..size] 2D canvas context.
 */
function applyFaviconShapeClip(
  ctx: CanvasRenderingContext2D,
  size: number,
  shape: FaviconShape,
  cornerRadiusPct: number,
  customCornersPct: { tl: number; tr: number; br: number; bl: number }
) {
  ctx.beginPath();
  if (shape === 'square') {
    ctx.rect(0, 0, size, size);
  } else if (shape === 'circle') {
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  } else if (shape === 'rounded') {
    const r = (size * Math.max(0, Math.min(50, cornerRadiusPct))) / 100;
    ctx.roundRect(0, 0, size, size, r);
  } else if (shape === 'custom') {
    const tl = (size * Math.max(0, Math.min(50, customCornersPct.tl))) / 100;
    const tr = (size * Math.max(0, Math.min(50, customCornersPct.tr))) / 100;
    const br = (size * Math.max(0, Math.min(50, customCornersPct.br))) / 100;
    const bl = (size * Math.max(0, Math.min(50, customCornersPct.bl))) / 100;
    ctx.roundRect(0, 0, size, size, [tl, tr, br, bl]);
  } else if (shape === 'squircle') {
    // True continuous-curvature superellipse: |x - c|^n + |y - c|^n = r^n (n = 4.4)
    const exp = 4.4;
    const half = size / 2;
    const steps = 144;
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const x = half + half * Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / exp);
      const y = half + half * Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / exp);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  ctx.clip();
}

/**
 * Normalizes a user-entered website path prefix (e.g. "/", "/favicons", "assets/icons/")
 * so generated href attributes always form valid clean paths like "/favicon-32x32.png" or "/favicons/favicon-32x32.png".
 */
function formatHrefPath(prefix: string, filename: string): string {
  const trimmed = prefix.trim();
  if (!trimmed || trimmed === '/') {
    return `/${filename}`;
  }
  // Keep full http(s) URLs intact if user enters CDN URL
  if (/^https?:\/\//i.test(trimmed)) {
    return `${trimmed.replace(/\/+$/, '')}/${filename}`;
  }
  const clean = trimmed.replace(/^\/+/, '').replace(/\/+$/, '');
  return `/${clean}/${filename}`;
}

interface FaviconGeneratorToolProps {
  initialTab?: 'image' | 'text';
}

export const FaviconGeneratorTool: React.FC<FaviconGeneratorToolProps> = ({
  initialTab = 'image',
}) => {
  const { t } = useI18n();
  const [tab, setTab] = useState<'image' | 'text'>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  // Image mode state
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Image crop, scale & pan controls
  const [imageScale, setImageScale] = useState<number>(100); // 25% to 250%
  const [imagePanX, setImagePanX] = useState<number>(0); // -100% to +100%
  const [imagePanY, setImagePanY] = useState<number>(0); // -100% to +100%
  const isDraggingPreviewRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
  });

  // Text mode state
  const [text, setText] = useState<string>('D');
  const [hasCustomTypedText, setHasCustomTypedText] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('all');
  const [selectedCategory, setSelectedCategory] = useState<FontCategory>('All');
  const [fontSearch, setFontSearch] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<FaviconFontItem>(FAVICON_FONTS[0]);
  const [visibleCount, setVisibleCount] = useState<number>(36);

  // Typography & Alignment controls
  const [fontScale, setFontScale] = useState<number>(56); // % of icon size
  const [weightOverride, setWeightOverride] = useState<number | 'default'>('default');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textOffsetX, setTextOffsetX] = useState<number>(0); // -40% to +40%
  const [textOffsetY, setTextOffsetY] = useState<number>(0); // -40% to +40%

  // Shared Shape, Corner Radius & Background controls
  const [shape, setShape] = useState<FaviconShape>('rounded');
  const [cornerRadiusPct, setCornerRadiusPct] = useState<number>(22); // 0% to 50%
  const [customCornersPct, setCustomCornersPct] = useState<{
    tl: number;
    tr: number;
    br: number;
    bl: number;
  }>({ tl: 26, tr: 8, br: 26, bl: 8 });
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('#2563EB');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');

  // Generated Favicon Assets + ICO + Manifest
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedFaviconAsset[]>([]);
  const [icoBlob, setIcoBlob] = useState<Blob | null>(null);
  const [manifestBlob, setManifestBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const previousUrlsRef = useRef<string[]>([]);

  // Interactive high-DPI live preview canvas ref
  const liveCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // HTML Snippet customization & Copy state
  const [hrefPrefix, setHrefPrefix] = useState<string>('/');
  const [includeManifestTag, setIncludeManifestTag] = useState<boolean>(true);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  // Cleanup generated blob URLs safely on unmount
  useEffect(() => {
    return () => {
      previousUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  // Filtered fonts across 1,500+ catalog
  const filteredFonts = useMemo(() => {
    const q = fontSearch.trim().toLowerCase();
    return FAVICON_FONTS.filter((font) => {
      if (selectedLanguage !== 'all' && font.language !== selectedLanguage) {
        return false;
      }
      if (selectedCategory !== 'All' && font.category !== selectedCategory) {
        return false;
      }
      if (q) {
        return (
          font.name.toLowerCase().includes(q) ||
          font.googleFamily.toLowerCase().includes(q) ||
          font.language.toLowerCase().includes(q) ||
          font.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedLanguage, selectedCategory, fontSearch]);

  // Reset pagination slice when filters change
  useEffect(() => {
    setVisibleCount(36);
  }, [selectedLanguage, selectedCategory, fontSearch]);

  const visibleFonts = useMemo(
    () => filteredFonts.slice(0, visibleCount),
    [filteredFonts, visibleCount]
  );

  // Load Google Fonts stylesheets on-demand for visible font cards
  useEffect(() => {
    if (tab !== 'text') return;
    const families = visibleFonts.map((f) => f.googleFamily);
    loadGoogleFontsBatch(families);
  }, [tab, visibleFonts]);

  const activeLanguageOption = useMemo(
    () => LANGUAGE_OPTIONS.find((l) => l.id === selectedLanguage) || LANGUAGE_OPTIONS[0],
    [selectedLanguage]
  );

  const handleLanguageSelect = (langId: LanguageId) => {
    setSelectedLanguage(langId);
    const langMeta = LANGUAGE_OPTIONS.find((l) => l.id === langId);
    if (!langMeta) return;

    const firstLangFont =
      langId === 'all'
        ? FAVICON_FONTS[0]
        : FAVICON_FONTS.find((f) => f.language === langId);

    if (firstLangFont) {
      setSelectedFont(firstLangFont);
    }

    if (!hasCustomTypedText && langId !== 'all') {
      setText(langMeta.defaultSample);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    const preview = URL.createObjectURL(f);
    setFile(f);
    setFilePreviewUrl(preview);
    setImageScale(100);
    setImagePanX(0);
    setImagePanY(0);
    // Default transparentBg to true when uploading PNG/WebP/SVG logos, or preserve user choice
    if (f.type === 'image/png' || f.type === 'image/webp' || f.type === 'image/svg+xml') {
      setTransparentBg(true);
    }
    const img = await loadImage(f);
    setImgElement(img);
  };

  const handleClearImage = () => {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFile(null);
    setFilePreviewUrl('');
    setImgElement(null);
  };

  const handleResetImageTransform = () => {
    setImageScale(100);
    setImagePanX(0);
    setImagePanY(0);
  };

  const handleMasterCornerRadiusChange = (val: number) => {
    setCornerRadiusPct(val);
    if (shape === 'custom') {
      setCustomCornersPct({ tl: val, tr: val, br: val, bl: val });
    }
  };

  const handleFontListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 120) {
      setVisibleCount((prev) => Math.min(filteredFonts.length, prev + 36));
    }
  };

  /**
   * Core single-icon renderer used by both the live interactive canvas and all export sizes.
   */
  const drawFaviconToCanvas = useCallback(
    (canvas: HTMLCanvasElement, size: number) => {
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      applyFaviconShapeClip(ctx, size, shape, cornerRadiusPct, customCornersPct);

      // Optional solid background fill (skipped when transparentBg is enabled)
      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
      }

      if (tab === 'image' && imgElement) {
        const iw = imgElement.naturalWidth || imgElement.width || 1;
        const ih = imgElement.naturalHeight || imgElement.height || 1;
        // Cover-fit baseline at 100% scale
        const coverScale = Math.max(size / iw, size / ih);
        const finalScale = coverScale * (imageScale / 100);
        const drawW = iw * finalScale;
        const drawH = ih * finalScale;
        const offsetX = ((imagePanX / 100) * size) / 2;
        const offsetY = ((imagePanY / 100) * size) / 2;
        const dx = (size - drawW) / 2 + offsetX;
        const dy = (size - drawH) / 2 + offsetY;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imgElement, dx, dy, drawW, drawH);
      } else if (tab === 'text') {
        const displayGlyphs = sliceGraphemes(text || 'D', 4) || 'D';
        const activeWeight =
          weightOverride === 'default' ? selectedFont.weight : weightOverride;
        const italicToken = selectedFont.italic ? 'italic ' : '';
        let pxSize = Math.max(8, (size * fontScale) / 100);
        const scaleX = selectedFont.scaleX || 1;

        ctx.font = `${italicToken}${activeWeight} ${pxSize}px "${selectedFont.googleFamily}", sans-serif`;

        const initialMetrics = ctx.measureText(displayGlyphs);
        const effectiveWidth = initialMetrics.width * scaleX;
        const maxAllowedWidth = size * 0.84;
        if (effectiveWidth > maxAllowedWidth && effectiveWidth > 0) {
          pxSize = pxSize * (maxAllowedWidth / effectiveWidth);
          ctx.font = `${italicToken}${activeWeight} ${pxSize}px "${selectedFont.googleFamily}", sans-serif`;
        }

        const metrics = ctx.measureText(displayGlyphs);
        const ascent = metrics.actualBoundingBoxAscent ?? pxSize * 0.72;
        const descent = metrics.actualBoundingBoxDescent ?? pxSize * 0.22;
        const verticalCenterOffset = (ascent - descent) / 2;

        // Compute horizontal anchor based on textAlign + fine X/Y offset
        let anchorX = size / 2;
        if (textAlign === 'left') {
          anchorX = size * 0.14 + (metrics.width * scaleX) / 2;
        } else if (textAlign === 'right') {
          anchorX = size * 0.86 - (metrics.width * scaleX) / 2;
        }
        anchorX += (textOffsetX / 100) * size;
        const anchorY = size / 2 + (textOffsetY / 100) * size;

        ctx.translate(anchorX, anchorY);
        if (selectedFont.slant) {
          ctx.transform(1, 0, selectedFont.slant, 1, 0, 0);
        }
        if (scaleX !== 1) {
          ctx.scale(scaleX, 1);
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';

        if (selectedFont.renderStyle === 'outline') {
          ctx.strokeStyle = textColor;
          ctx.lineWidth = Math.max(1, size * 0.045);
          ctx.lineJoin = 'round';
          ctx.strokeText(displayGlyphs, 0, verticalCenterOffset);
        } else if (selectedFont.renderStyle === 'shadow') {
          const offset = Math.max(1, size * 0.055);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.36)';
          ctx.fillText(displayGlyphs, offset, verticalCenterOffset + offset);
          ctx.fillStyle = textColor;
          ctx.fillText(displayGlyphs, 0, verticalCenterOffset);
        } else {
          ctx.fillStyle = textColor;
          ctx.fillText(displayGlyphs, 0, verticalCenterOffset);
        }
      }

      ctx.restore();
    },
    [
      shape,
      cornerRadiusPct,
      customCornersPct,
      transparentBg,
      bgColor,
      tab,
      imgElement,
      imageScale,
      imagePanX,
      imagePanY,
      text,
      weightOverride,
      selectedFont,
      fontScale,
      textAlign,
      textOffsetX,
      textOffsetY,
      textColor,
    ]
  );

  // Paint high-DPI live preview canvas immediately on every slider movement
  useEffect(() => {
    const canvas = liveCanvasRef.current;
    if (!canvas) return;
    if (tab === 'image' && !imgElement) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    drawFaviconToCanvas(canvas, 440);
  }, [drawFaviconToCanvas, tab, imgElement]);

  // Generate all multi-resolution PNG blobs + .ICO + site.webmanifest
  useEffect(() => {
    let cancelled = false;

    // Clear assets when in Image mode without an uploaded image so Download & HTML sections stay hidden until generated
    if (tab === 'image' && !imgElement) {
      previousUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      previousUrlsRef.current = [];
      setGeneratedAssets([]);
      setIcoBlob(null);
      setManifestBlob(null);
      setIsGenerating(false);
      return;
    }

    const timer = window.setTimeout(async () => {
      setIsGenerating(true);

      if (tab === 'text') {
        await ensureFontLoaded(selectedFont);
        if (cancelled) return;
        // Re-paint live preview once font binary is guaranteed loaded
        if (liveCanvasRef.current) {
          drawFaviconToCanvas(liveCanvasRef.current, 440);
        }
      }

      const nextAssets: GeneratedFaviconAsset[] = [];

      for (const spec of FAVICON_SPECS) {
        const offscreen = document.createElement('canvas');
        drawFaviconToCanvas(offscreen, spec.size);

        const blob = await new Promise<Blob>((resolve) =>
          offscreen.toBlob((b) => resolve(b!), 'image/png')
        );
        if (cancelled) return;

        nextAssets.push({
          size: spec.size,
          filename: spec.filename,
          label: spec.label,
          rel: spec.rel,
          url: URL.createObjectURL(blob),
          blob,
        });
      }

      // Build multi-resolution favicon.ico (16x16, 32x32, 48x48)
      const builtIco = await createIcoFromPngBlobs(
        nextAssets.map((a) => ({ size: a.size, blob: a.blob }))
      );

      // Build site.webmanifest matching user's path prefix & colors
      const manifestObj = {
        name: 'Website',
        short_name: 'Website',
        icons: [
          {
            src: formatHrefPath(hrefPrefix, 'android-chrome-192x192.png'),
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: formatHrefPath(hrefPrefix, 'android-chrome-512x512.png'),
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: transparentBg ? '#ffffff' : bgColor,
        background_color: transparentBg ? '#ffffff' : bgColor,
        display: 'standalone',
      };
      const builtManifest = new Blob([JSON.stringify(manifestObj, null, 2)], {
        type: 'application/manifest+json',
      });

      if (cancelled) {
        nextAssets.forEach((a) => URL.revokeObjectURL(a.url));
        return;
      }

      previousUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      previousUrlsRef.current = nextAssets.map((a) => a.url);
      setGeneratedAssets(nextAssets);
      setIcoBlob(builtIco);
      setManifestBlob(builtManifest);
      setIsGenerating(false);
    }, 60);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [drawFaviconToCanvas, tab, imgElement, selectedFont, hrefPrefix, transparentBg, bgColor]);

  // Pointer drag-to-reposition on the live preview canvas in Image mode
  const handlePreviewPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tab !== 'image' || !imgElement) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingPreviewRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: imagePanX,
      panY: imagePanY,
    };
  };

  const handlePreviewPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingPreviewRef.current || tab !== 'image') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.x) / Math.max(1, rect.width)) * 200;
    const deltaY = ((e.clientY - dragStartRef.current.y) / Math.max(1, rect.height)) * 200;
    setImagePanX(Math.max(-100, Math.min(100, Math.round(dragStartRef.current.panX + deltaX))));
    setImagePanY(Math.max(-100, Math.min(100, Math.round(dragStartRef.current.panY + deltaY))));
  };

  const handlePreviewPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingPreviewRef.current) {
      isDraggingPreviewRef.current = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore pointer capture release errors
      }
    }
  };

  // Dynamically generate clean HTML <head> code based on the generated favicon files
  const generatedHtmlLines = useMemo(() => {
    if (generatedAssets.length === 0) return [];
    const lines: { tag: 'link'; attrs: { name: string; value: string }[] }[] = [];

    const asset32 = generatedAssets.find((a) => a.size === 32);
    const asset16 = generatedAssets.find((a) => a.size === 16);
    const asset48 = generatedAssets.find((a) => a.size === 48);
    const asset180 = generatedAssets.find((a) => a.size === 180);
    const asset192 = generatedAssets.find((a) => a.size === 192);

    if (asset32) {
      lines.push({
        tag: 'link',
        attrs: [
          { name: 'rel', value: 'icon' },
          { name: 'type', value: 'image/png' },
          { name: 'sizes', value: '32x32' },
          { name: 'href', value: formatHrefPath(hrefPrefix, asset32.filename) },
        ],
      });
    }
    if (asset16) {
      lines.push({
        tag: 'link',
        attrs: [
          { name: 'rel', value: 'icon' },
          { name: 'type', value: 'image/png' },
          { name: 'sizes', value: '16x16' },
          { name: 'href', value: formatHrefPath(hrefPrefix, asset16.filename) },
        ],
      });
    }
    if (asset48) {
      lines.push({
        tag: 'link',
        attrs: [
          { name: 'rel', value: 'icon' },
          { name: 'type', value: 'image/png' },
          { name: 'sizes', value: '48x48' },
          { name: 'href', value: formatHrefPath(hrefPrefix, asset48.filename) },
        ],
      });
    }
    if (icoBlob) {
      lines.push({
        tag: 'link',
        attrs: [
          { name: 'rel', value: 'shortcut icon' },
          { name: 'href', value: formatHrefPath(hrefPrefix, 'favicon.ico') },
        ],
      });
    }
    if (asset180) {
      lines.push({
        tag: 'link',
        attrs: [
          { name: 'rel', value: 'apple-touch-icon' },
          { name: 'sizes', value: '180x180' },
          { name: 'href', value: formatHrefPath(hrefPrefix, asset180.filename) },
        ],
      });
    }
    if (asset192) {
      lines.push({
        tag: 'link',
        attrs: [
          { name: 'rel', value: 'icon' },
          { name: 'type', value: 'image/png' },
          { name: 'sizes', value: '192x192' },
          { name: 'href', value: formatHrefPath(hrefPrefix, asset192.filename) },
        ],
      });
    }
    if (includeManifestTag && manifestBlob) {
      lines.push({
        tag: 'link',
        attrs: [
          { name: 'rel', value: 'manifest' },
          { name: 'href', value: formatHrefPath(hrefPrefix, 'site.webmanifest') },
        ],
      });
    }

    return lines;
  }, [generatedAssets, icoBlob, manifestBlob, hrefPrefix, includeManifestTag]);

  const rawHtmlCode = useMemo(() => {
    return generatedHtmlLines
      .map(
        (line) =>
          `<${line.tag} ${line.attrs.map((a) => `${a.name}="${a.value}"`).join(' ')}>`
      )
      .join('\n');
  }, [generatedHtmlLines]);

  const handleCopyHtmlCode = async () => {
    if (!rawHtmlCode) return;
    try {
      await navigator.clipboard.writeText(rawHtmlCode);
      setCopiedHtml(true);
      window.setTimeout(() => setCopiedHtml(false), 2400);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = rawHtmlCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedHtml(true);
      window.setTimeout(() => setCopiedHtml(false), 2400);
    }
  };

  const handleDownloadIco = () => {
    if (!icoBlob) return;
    downloadBlob(icoBlob, 'favicon.ico');
  };

  const handleDownloadAppleTouch = () => {
    const apple = generatedAssets.find((a) => a.size === 180);
    if (apple) {
      downloadBlob(apple.blob, apple.filename);
    }
  };

  const handleDownloadManifest = () => {
    if (!manifestBlob) return;
    downloadBlob(manifestBlob, 'site.webmanifest');
  };

  const handleDownloadZip = async () => {
    if (generatedAssets.length === 0) return;
    const zip = new JSZip();

    generatedAssets.forEach((asset) => {
      zip.file(asset.filename, asset.blob);
    });

    if (icoBlob) {
      zip.file('favicon.ico', icoBlob);
    }

    if (manifestBlob) {
      zip.file('site.webmanifest', manifestBlob);
    }

    if (rawHtmlCode) {
      zip.file('favicon-head-code.html', `<!-- Add inside <head> -->\n${rawHtmlCode}\n`);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'designkit-favicons.zip');
  };

  // Create a clean geometric vector brand mark sample so visitors can test Image-to-Favicon in 1 click if desired
  const handleLoadSampleLogo = async () => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#1D4ED8');
    grad.addColorStop(1, '#0EA5E9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(256, 210, 96, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.beginPath();
    ctx.roundRect(128, 336, 256, 68, 34);
    ctx.fill();

    const sampleBlob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), 'image/png'));
    const sampleFile = new File([sampleBlob], 'sample-brand-mark.png', { type: 'image/png' });
    setTransparentBg(false);
    await handleFiles([sampleFile]);
  };

  const previewSampleGlyph = sliceGraphemes(text || 'D', 4) || 'D';
  const asset32Preview = generatedAssets.find((a) => a.size === 32);
  const hasGeneratedOutput = generatedAssets.length > 0;
  const showCornerRadiusSlider = shape === 'rounded' || shape === 'custom';

  const SHAPE_OPTIONS: { id: FaviconShape; label: string }[] = [
    { id: 'square', label: t('fav.shapeSquare') },
    { id: 'rounded', label: t('fav.shapeRounded') },
    { id: 'circle', label: t('fav.shapeCircle') },
    { id: 'squircle', label: t('fav.shapeSquircle') },
    { id: 'custom', label: t('fav.shapeCustom') },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Tool Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
          <Star className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{t('fav.kicker')}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums font-medium text-slate-700">
            16×16 – 512×512 PNG &amp; .ICO
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">
            {FAVICON_FONTS.length.toLocaleString()}+ Fonts
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {t('fav.title')}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          {t('fav.subtitle')}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-slate-100 p-1 rounded-xl max-w-lg">
        <button
          type="button"
          onClick={() => setTab('image')}
          className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            tab === 'image'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 shrink-0" />
          <span>{t('fav.imageTab')}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('text')}
          className={`flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            tab === 'text'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type className="w-4 h-4 shrink-0" />
          <span>
            {t('fav.textTab')} ({FAVICON_FONTS.length.toLocaleString()}+)
          </span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Controls */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          {tab === 'image' ? (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t('fav.uploadLabel')}
                  </label>
                  {!file && (
                    <button
                      type="button"
                      onClick={handleLoadSampleLogo}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap"
                    >
                      {t('drop.tryDemo')}
                    </button>
                  )}
                </div>

                {!file ? (
                  <Dropzone
                    onFilesSelected={handleFiles}
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                    title={t('fav.uploadTitle')}
                    subtitle={t('fav.uploadSub')}
                    compact
                  />
                ) : (
                  <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                        <img
                          src={filePreviewUrl}
                          alt={file.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {file.name}
                        </p>
                        {imgElement && (
                          <p className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                            {imgElement.naturalWidth} × {imgElement.naturalHeight} px ·{' '}
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearImage}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 hover:border-blue-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {t('action.changeImage')}
                    </button>
                  </div>
                )}
              </div>

              {/* Crop, Scale & Reposition Controls (shown when an image is loaded) */}
              {imgElement && (
                <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-blue-600" />
                      {t('fav.cropPositionTitle')}
                    </span>
                    <button
                      type="button"
                      onClick={handleResetImageTransform}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600 cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t('fav.resetPosition')}
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{t('fav.imageScale')}</span>
                      <span className="font-semibold text-blue-600 tabular-nums">
                        {imageScale}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25}
                      max={250}
                      value={imageScale}
                      onChange={(e) => setImageScale(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{t('fav.panX')}</span>
                        <span className="font-semibold text-slate-700 tabular-nums">
                          {imagePanX > 0 ? `+${imagePanX}%` : `${imagePanX}%`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={imagePanX}
                        onChange={(e) => setImagePanX(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{t('fav.panY')}</span>
                        <span className="font-semibold text-slate-700 tabular-nums">
                          {imagePanY > 0 ? `+${imagePanY}%` : `${imagePanY}%`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-100}
                        max={100}
                        value={imagePanY}
                        onChange={(e) => setImagePanY(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {/* Text / Aksharam Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {t('fav.textInputLabel')}
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Supports English, తెలుగు, हिन्दी &amp; global scripts
                  </span>
                </div>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setHasCustomTypedText(e.target.value.trim().length > 0);
                  }}
                  placeholder={activeLanguageOption.defaultSample}
                  className="w-full px-3.5 py-2.5 text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none text-slate-900"
                />

                {/* Quick Native Character / Aksharam Picker */}
                <div className="mt-2.5">
                  <div className="text-[11px] text-slate-500 mb-1.5">
                    Quick sample characters ({activeLanguageOption.label}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeLanguageOption.sampleChars.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => {
                          setText(ch);
                          setHasCustomTypedText(true);
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                          text === ch
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-white'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Language Script Selector */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Language &amp; Script Fonts</span>
                  </label>
                  <span className="text-[11px] text-slate-500 tabular-nums">
                    50+ fonts per language
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pe-1">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const isSelected = selectedLanguage === lang.id;
                    const count = LANGUAGE_FONT_COUNTS[lang.id] || 0;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => handleLanguageSelect(lang.id)}
                        className={`px-2.5 py-2 rounded-lg border text-start transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50/90 border-blue-600 text-blue-900 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold truncate">{lang.label}</span>
                          <span className="text-[10px] text-slate-500 tabular-nums shrink-0">
                            {count}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {lang.nativeLabel}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Search + Style Category Filter */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Font Library ({filteredFonts.length.toLocaleString()} matching fonts)
                  </label>
                  <span className="text-[11px] text-blue-600 font-medium truncate max-w-[190px]">
                    {selectedFont.name}
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    placeholder="Search 1,500+ fonts (e.g. Ramabhadra, Mallanna, Baloo, Inter...)"
                    className="w-full ps-9 pe-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none text-slate-900"
                  />
                  {fontSearch && (
                    <button
                      type="button"
                      onClick={() => setFontSearch('')}
                      className="absolute end-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Category Segmented Bar */}
                <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg">
                  {FONT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-white text-slate-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Virtualized / Paginated Live Font Grid */}
                <div
                  onScroll={handleFontListScroll}
                  className="max-h-64 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5"
                >
                  {visibleFonts.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-slate-500">
                      No fonts match &ldquo;{fontSearch}&rdquo;. Try clearing filters.
                    </div>
                  ) : (
                    visibleFonts.map((font) => {
                      const active = selectedFont.id === font.id;
                      const previewTransform = [
                        font.slant ? `skewX(${Math.round(-font.slant * 45)}deg)` : '',
                        font.scaleX && font.scaleX !== 1 ? `scaleX(${font.scaleX})` : '',
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => setSelectedFont(font)}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border text-start transition-all cursor-pointer ${
                            active
                              ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600/20'
                              : 'bg-white border-slate-200/90 hover:border-blue-300'
                          }`}
                        >
                          <div
                            style={{
                              fontFamily: `"${font.googleFamily}", sans-serif`,
                              fontWeight: font.weight,
                              fontStyle: font.italic ? 'italic' : 'normal',
                              backgroundColor: transparentBg ? '#0F172A' : bgColor,
                              color:
                                font.renderStyle === 'outline' ? 'transparent' : textColor,
                              WebkitTextStroke:
                                font.renderStyle === 'outline'
                                  ? `1.2px ${textColor}`
                                  : undefined,
                              textShadow:
                                font.renderStyle === 'shadow'
                                  ? '1.5px 1.5px 0px rgba(0,0,0,0.38)'
                                  : undefined,
                            }}
                            className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-base overflow-hidden shadow-2xs select-none"
                          >
                            <span
                              style={{
                                transform: previewTransform || undefined,
                                display: 'inline-block',
                              }}
                            >
                              {previewSampleGlyph}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-slate-900 truncate">
                              {font.name}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5 capitalize">
                              {font.language} · {font.category}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}

                  {visibleCount < filteredFonts.length && (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((prev) => Math.min(filteredFonts.length, prev + 60))
                      }
                      className="col-span-full py-2 mt-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white border border-slate-200 rounded-lg cursor-pointer"
                    >
                      Show more fonts ({visibleCount} of {filteredFonts.length.toLocaleString()})
                    </button>
                  )}
                </div>
              </div>

              {/* Typography Scale, Weight & Text Alignment */}
              <div className="p-4 bg-slate-50/90 rounded-xl border border-slate-200/90 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-slate-400" />
                        Glyph Size
                      </span>
                      <span className="font-semibold text-blue-600 tabular-nums">
                        {fontScale}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={25}
                      max={85}
                      value={fontScale}
                      onChange={(e) => setFontScale(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Weight Override
                    </label>
                    <select
                      value={weightOverride}
                      onChange={(e) =>
                        setWeightOverride(
                          e.target.value === 'default' ? 'default' : Number(e.target.value)
                        )
                      }
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:border-blue-500 focus:outline-none"
                    >
                      <option value="default">Preset ({selectedFont.weight})</option>
                      <option value={400}>Regular (400)</option>
                      <option value={500}>Medium (500)</option>
                      <option value={600}>SemiBold (600)</option>
                      <option value={700}>Bold (700)</option>
                      <option value={800}>ExtraBold (800)</option>
                      <option value={900}>Black (900)</option>
                    </select>
                  </div>
                </div>

                {/* Text Alignment & Fine Offset */}
                <div className="pt-2 border-t border-slate-200/70 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-700">
                      {t('fav.textAlign')}
                    </span>
                    <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                      {(
                        [
                          { id: 'left', icon: AlignLeft, label: t('fav.alignLeft') },
                          { id: 'center', icon: AlignCenter, label: t('fav.alignCenter') },
                          { id: 'right', icon: AlignRight, label: t('fav.alignRight') },
                        ] as const
                      ).map((al) => {
                        const Icon = al.icon;
                        return (
                          <button
                            key={al.id}
                            type="button"
                            onClick={() => setTextAlign(al.id)}
                            title={al.label}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                              textAlign === al.id
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{al.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-600">{t('fav.panX')}</span>
                        <span className="font-semibold text-slate-700 tabular-nums">
                          {textOffsetX > 0 ? `+${textOffsetX}%` : `${textOffsetX}%`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-40}
                        max={40}
                        value={textOffsetX}
                        onChange={(e) => setTextOffsetX(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-600">{t('fav.panY')}</span>
                        <span className="font-semibold text-slate-700 tabular-nums">
                          {textOffsetY > 0 ? `+${textOffsetY}%` : `${textOffsetY}%`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={-40}
                        max={40}
                        value={textOffsetY}
                        onChange={(e) => setTextOffsetY(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shared Favicon Shape & Corner Radius Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2.5">
                {t('fav.shapeTitle')}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SHAPE_OPTIONS.map((opt) => {
                  const isSelected = shape === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setShape(opt.id)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-start ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {/* Visual Shape Mini-Icon */}
                      <span
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 border-2 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600/20'
                            : 'border-slate-400 bg-slate-100'
                        } ${
                          opt.id === 'square'
                            ? 'rounded-none'
                            : opt.id === 'rounded'
                            ? 'rounded-[4px]'
                            : opt.id === 'circle'
                            ? 'rounded-full'
                            : opt.id === 'squircle'
                            ? 'rounded-[6px]'
                            : 'rounded-tl-[7px] rounded-br-[7px] rounded-tr-[2px] rounded-bl-[2px]'
                        }`}
                      />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Corner Radius Slider (0% to 50%) — Displayed when Rounded Square or Custom Rounded Corners is selected */}
            {showCornerRadiusSlider && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">
                      {t('fav.cornerRadius')}
                    </span>
                    <span className="font-bold text-blue-600 tabular-nums">
                      {cornerRadiusPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={cornerRadiusPct}
                    onChange={(e) => handleMasterCornerRadiusChange(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 tabular-nums mt-0.5">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Individual Corner Radius Sliders for Custom Rounded Corners */}
                {shape === 'custom' && (
                  <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
                    <div className="text-[11px] font-semibold text-slate-700">
                      {t('fav.individualCorners')}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { key: 'tl', label: 'Top-Left' },
                          { key: 'tr', label: 'Top-Right' },
                          { key: 'bl', label: 'Bottom-Left' },
                          { key: 'br', label: 'Bottom-Right' },
                        ] as const
                      ).map((corner) => (
                        <div key={corner.key}>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-600">{corner.label}</span>
                            <span className="font-semibold text-slate-800 tabular-nums">
                              {customCornersPct[corner.key]}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={50}
                            value={customCornersPct[corner.key]}
                            onChange={(e) =>
                              setCustomCornersPct((prev) => ({
                                ...prev,
                                [corner.key]: Number(e.target.value),
                              }))
                            }
                            className="w-full accent-blue-600 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Background Color, Transparent Background Toggle & Text Color */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    {t('fav.transparentBg')}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    PNG &amp; ICO preserve crisp alpha transparency
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>

              {!transparentBg && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Color Presets
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        title={preset.name}
                        onClick={() => {
                          setBgColor(preset.bg);
                          setTextColor(preset.fg);
                        }}
                        style={{ backgroundColor: preset.bg, color: preset.fg }}
                        className="w-7 h-7 rounded-lg border border-slate-300 text-[11px] font-bold flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                      >
                        Aa
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className={transparentBg ? 'opacity-50 pointer-events-none' : ''}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('fav.bgColor')}
                  </label>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-700 uppercase">
                      {bgColor}
                    </span>
                  </div>
                </div>

                {tab === 'text' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('fav.textColor')}
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate-700 uppercase">
                        {textColor}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Canvas, Browser Tab Preview, Sizes & Download Actions */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          {!hasGeneratedOutput && tab === 'image' && !imgElement ? (
            <div className="min-h-[380px] flex flex-col items-center justify-center text-center text-slate-400 px-6">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                {t('fav.uploadTitle')}
              </p>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                {t('fav.uploadSub')}. Live shape preview, multi-size downloads, and HTML
                code will appear automatically.
              </p>
            </div>
          ) : (
            <>
              {/* Live Interactive Shape & Crop Preview */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {t('fav.livePreview')}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {tab === 'image'
                      ? 'Drag icon to reposition crop'
                      : `${selectedFont.name} (${selectedFont.language})`}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Checkerboard Stage */}
                  <div
                    className="w-44 h-44 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center p-3 shrink-0 overflow-hidden"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                      backgroundSize: '16px 16px',
                      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                      backgroundColor: '#f8fafc',
                    }}
                  >
                    <canvas
                      ref={liveCanvasRef}
                      onPointerDown={handlePreviewPointerDown}
                      onPointerMove={handlePreviewPointerMove}
                      onPointerUp={handlePreviewPointerUp}
                      onPointerCancel={handlePreviewPointerUp}
                      className={`w-full h-full drop-shadow-sm touch-none ${
                        tab === 'image' ? 'cursor-grab active:cursor-grabbing' : ''
                      }`}
                    />
                  </div>

                  {/* Browser Tab Mockup + Shape Summary */}
                  <div className="flex-1 w-full space-y-3">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {t('fav.browserPreview')}
                    </div>

                    {/* Light Browser Tab */}
                    <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-xs flex items-center gap-2.5">
                      {asset32Preview && (
                        <img
                          src={asset32Preview.url}
                          alt="Tab favicon"
                          className="w-4 h-4 shrink-0"
                        />
                      )}
                      <span className="text-xs font-medium text-slate-800 truncate">
                        DesignKit — {tab === 'text' ? previewSampleGlyph : file?.name || 'Website'}
                      </span>
                      <span className="ms-auto text-slate-400 text-xs">×</span>
                    </div>

                    {/* Dark Browser Tab */}
                    <div className="bg-slate-900 rounded-xl p-2.5 border border-slate-800 shadow-xs flex items-center gap-2.5">
                      {asset32Preview && (
                        <img
                          src={asset32Preview.url}
                          alt="Dark tab favicon"
                          className="w-4 h-4 shrink-0"
                        />
                      )}
                      <span className="text-xs font-medium text-slate-100 truncate">
                        DesignKit — Dark Mode Tab
                      </span>
                      <span className="ms-auto text-slate-500 text-xs">×</span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
                      <span className="font-medium text-slate-700">
                        {SHAPE_OPTIONS.find((s) => s.id === shape)?.label}
                      </span>
                      {showCornerRadiusSlider && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{cornerRadiusPct}% radius</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{transparentBg ? 'Transparent PNG/ICO' : bgColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Resolution Individual Asset Cards */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-700">
                    {t('fav.multiResTitle')}
                  </h4>
                  {isGenerating && (
                    <span className="text-[11px] text-blue-600 font-medium">
                      {t('action.processing')}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {generatedAssets.map((asset) => (
                    <button
                      key={asset.filename}
                      type="button"
                      onClick={() => downloadBlob(asset.blob, asset.filename)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-start group cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-lg border border-slate-200/80 flex items-center justify-center shrink-0 p-1"
                        style={{
                          backgroundColor: transparentBg ? '#f1f5f9' : '#ffffff',
                        }}
                      >
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 tabular-nums">
                            {asset.size}×{asset.size}
                          </span>
                          <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {asset.filename}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Download Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadIco}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>{t('fav.downloadIco')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadAppleTouch}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>{t('fav.downloadApple')}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer"
                >
                  <FileArchive className="w-4 h-4 shrink-0" />
                  <span>{t('fav.downloadAllZip')}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ADD FAVICON TO YOUR WEBSITE — HTML CODE GENERATOR (Post-Download)     */}
      {/* Displayed strictly ONLY after favicons have been generated             */}
      {/* ===================================================================== */}
      {hasGeneratedOutput && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                <Code2 className="w-4 h-4 shrink-0" />
                <span>HTML &lt;head&gt; Integration</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {t('fav.htmlSectionTitle')}
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl">
                {t('fav.htmlSectionDesc')}
              </p>
            </div>

            {/* Customizable Website Icon Path Prefix */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {t('fav.pathPrefixLabel')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    dir="ltr"
                    value={hrefPrefix}
                    onChange={(e) => setHrefPrefix(e.target.value)}
                    placeholder="/"
                    className="w-44 px-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleDownloadManifest}
                    title="Download site.webmanifest"
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    <span>site.webmanifest</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Syntax-Highlighted Responsive Code Block */}
          <div
            dir="ltr"
            className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-sm"
          >
            {/* Code Block Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-medium text-slate-300">
                  index.html &lt;head&gt;
                </span>
                <label className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeManifestTag}
                    onChange={(e) => setIncludeManifestTag(e.target.checked)}
                    className="w-3.5 h-3.5 accent-blue-500 rounded cursor-pointer"
                  />
                  <span>Include site.webmanifest</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleCopyHtmlCode}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  copiedHtml
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {copiedHtml ? (
                  <>
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('action.copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('action.copyCode')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Syntax Highlighted Preformatted Lines */}
            <div className="p-4 sm:p-5 overflow-x-auto">
              <pre className="text-xs sm:text-[13px] font-mono leading-relaxed text-slate-200 min-w-max">
                <code>
                  {generatedHtmlLines.map((line, idx) => (
                    <div key={idx} className="flex items-baseline">
                      <span className="w-6 select-none text-slate-600 text-right pr-3 tabular-nums">
                        {idx + 1}
                      </span>
                      <span>
                        <span className="text-slate-500">&lt;</span>
                        <span className="text-sky-400">{line.tag}</span>
                        {line.attrs.map((attr) => (
                          <React.Fragment key={attr.name}>
                            {' '}
                            <span className="text-indigo-300">{attr.name}</span>
                            <span className="text-slate-400">=</span>
                            <span className="text-emerald-300">
                              &quot;{attr.value}&quot;
                            </span>
                          </React.Fragment>
                        ))}
                        <span className="text-slate-500">&gt;</span>
                      </span>
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Step-by-Step Website Installation Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            <div className="lg:col-span-8 space-y-3">
              <h3 className="text-sm font-bold text-slate-900">
                {t('fav.instructionsTitle')}
              </h3>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  t('fav.step1'),
                  t('fav.step2'),
                  t('fav.step3'),
                  t('fav.step4'),
                  t('fav.step5'),
                  t('fav.step6'),
                ].map((stepText, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed"
                  >
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 tabular-nums mt-0.5">
                      {index + 1}
                    </span>
                    <span>{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-3">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  {t('fav.pathNote')}
                </p>
              </div>
              <div className="text-[11px] font-mono text-blue-800 bg-white/90 border border-blue-200/70 rounded-lg px-3 py-2 truncate" dir="ltr">
                href=&quot;{formatHrefPath(hrefPrefix, 'favicon-32x32.png')}&quot;
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
