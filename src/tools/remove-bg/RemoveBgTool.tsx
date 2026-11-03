import React, { useState, useRef, useEffect } from 'react';
import { Wand2, Download, Sparkles, Pipette, Check } from 'lucide-react';
import { Dropzone } from '../../components/common/Dropzone';
import { loadImage, downloadBlob, formatBytes } from '../../utils/imageProcessors';

export const RemoveBgTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [tolerance, setTolerance] = useState<number>(35);
  const [keyColor, setKeyColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [result, setResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);

    // Auto-detect corner color as likely background
    const img = await loadImage(f);
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const cornerPixel = ctx.getImageData(0, 0, 1, 1).data;
    setKeyColor({ r: cornerPixel[0], g: cornerPixel[1], b: cornerPixel[2] });
  };

  const processRemoval = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const tolSq = (tolerance * 2.55) ** 2;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distSq = (r - keyColor.r) ** 2 + (g - keyColor.g) ** 2 + (b - keyColor.b) ** 2;

        if (distSq < tolSq) {
          // Erase / make transparent
          const alphaFactor = Math.sqrt(distSq / tolSq);
          data[i + 3] = Math.round(alphaFactor * 40);
        }
      }

      ctx.putImageData(imgData, 0, 0);

      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
      setResult({
        blob,
        url: URL.createObjectURL(blob),
        size: blob.size,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (file) {
      processRemoval();
    }
  }, [file, tolerance, keyColor]);

  const handleDownload = () => {
    if (!result || !file) return;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
    downloadBlob(result.blob, `${name}-nobg.png`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Wand2 className="w-4 h-4" />
          <span>Smart Subject Extraction</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Remove Background
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Remove solid, studio, or color backgrounds in your browser with color-keying tolerance and edge feathering. Export crisp transparent PNGs.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={false}
          title="Drop image to remove background"
          subtitle="Works best on photos with white, solid, or studio backgrounds"
          sampleType="portrait"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Source Photo
              </span>
              <div className="text-sm font-semibold text-slate-800 truncate">{file.name}</div>
            </div>

            {/* Background Color Key Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Color to Key Out
              </label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'White', r: 255, g: 255, b: 255, hex: '#FFFFFF' },
                  { name: 'Off-White', r: 240, g: 240, b: 240, hex: '#F0F0F0' },
                  { name: 'Black', r: 0, g: 0, b: 0, hex: '#000000' },
                  { name: 'Green Screen', r: 0, g: 255, b: 0, hex: '#00FF00' },
                  { name: 'Blue', r: 0, g: 120, b: 255, hex: '#0078FF' },
                ].map((preset) => {
                  const isSelected =
                    Math.abs(keyColor.r - preset.r) < 10 &&
                    Math.abs(keyColor.g - preset.g) < 10 &&
                    Math.abs(keyColor.b - preset.b) < 10;

                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setKeyColor({ r: preset.r, g: preset.g, b: preset.b })}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isSelected ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span className="hidden sm:inline">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tolerance Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Tolerance Sensitivity:</span>
                <span className="font-bold text-blue-600 font-mono">{tolerance}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={tolerance}
                onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600"
              />
              <p className="text-[11px] text-slate-400">
                Increase tolerance if edges still have background residue; decrease if subject parts are erased.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Upload Different Image
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Transparent Output</h3>

              {/* Checkerboard transparent backdrop */}
              <div
                className="relative w-full h-[360px] rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-200"
                style={{
                  backgroundImage: `linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)`,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                }}
              >
                {result ? (
                  <img
                    src={result.url}
                    alt="No background"
                    className="max-w-full max-h-full object-contain drop-shadow-md"
                  />
                ) : (
                  <div className="text-xs text-slate-500">Processing background...</div>
                )}
              </div>

              {result && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span>Transparent PNG generated</span>
                  <span className="font-mono">{formatBytes(result.size)}</span>
                </div>
              )}
            </div>

            {result && (
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Transparent PNG</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
