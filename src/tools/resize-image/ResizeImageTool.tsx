import React, { useState, useEffect } from 'react';
import { Maximize2, Download, Lock, Unlock, Sparkles, RefreshCw } from 'lucide-react';
import { Dropzone } from '../../components/common/Dropzone';
import {
  loadImage,
  resizeImage,
  formatBytes,
  downloadBlob,
} from '../../utils/imageProcessors';

export const ResizeImageTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [origW, setOrigW] = useState<number>(0);
  const [origH, setOrigH] = useState<number>(0);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [keepAspect, setKeepAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<string>('image/jpeg');

  const [result, setResult] = useState<{
    blob: Blob;
    url: string;
    width: number;
    height: number;
    size: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, []);

  const handleFile = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    const img = await loadImage(f);
    setOrigW(img.naturalWidth);
    setOrigH(img.naturalHeight);
    setWidth(img.naturalWidth);
    setHeight(img.naturalHeight);
    setResult(null);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (keepAspect && origW > 0) {
      setHeight(Math.round(val * (origH / origW)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (keepAspect && origH > 0) {
      setWidth(Math.round(val * (origW / origH)));
    }
  };

  const handlePercentageScale = (pct: number) => {
    if (origW <= 0) return;
    const newW = Math.round(origW * (pct / 100));
    const newH = Math.round(origH * (pct / 100));
    setWidth(newW);
    setHeight(newH);
  };

  const handleExecuteResize = async () => {
    if (!file || width <= 0 || height <= 0) return;
    setIsProcessing(true);
    try {
      const res = await resizeImage(file, width, height, format, 0.92);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const ext = format === 'image/png' ? 'png' : 'jpg';
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
    downloadBlob(result.blob, `${name}-${result.width}x${result.height}.${ext}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Maximize2 className="w-4 h-4" />
          <span>Dimension Transformation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Resize Image
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Change image resolution by exact pixel dimensions or scale percentages with aspect ratio lock.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFile}
          multiple={false}
          title="Drop image to resize"
          subtitle="Quickly adjust pixels, upscale or downscale with anti-aliasing"
          sampleType="landscape"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <span>Original Dimensions</span>
                <span className="font-mono text-slate-700">{origW} × {origH} px</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Original file size: {formatBytes(file.size)}
              </div>
            </div>

            {/* Percentage shortcuts */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Quick Scale Presets
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[25, 50, 75, 100, 150].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentageScale(pct)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-all"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Pixel inputs */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Target Resolution</span>
                <button
                  type="button"
                  onClick={() => setKeepAspect(!keepAspect)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    keepAspect
                      ? 'bg-blue-50 text-blue-600 border-blue-200 font-medium'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {keepAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{keepAspect ? 'Aspect Locked' : 'Freeform'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Width (px)</label>
                  <input
                    type="number"
                    min="1"
                    value={width || ''}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Height (px)</label>
                  <input
                    type="number"
                    min="1"
                    value={height || ''}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Target Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/png">PNG (.png)</option>
                  <option value="image/webp">WebP (.webp)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleExecuteResize}
                disabled={isProcessing || width <= 0 || height <= 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Apply Resize</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Preview / Results */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                {result ? 'Resized Result' : 'Original Preview'}
              </h3>

              <div className="relative w-full h-[360px] sm:h-[420px] bg-slate-900/90 rounded-xl overflow-hidden flex items-center justify-center p-4">
                <img
                  src={result ? result.url : previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono">
                  {result ? `${result.width} × ${result.height} px` : `${origW} × ${origH} px`}
                </div>
              </div>

              {result && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div>
                    <span className="font-semibold">Resized successfully:</span>{' '}
                    <span className="font-mono">{result.width} × {result.height} px</span>
                  </div>
                  <div className="font-mono font-semibold">
                    Output size: {formatBytes(result.size)}
                  </div>
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
                  <span>Download Resized Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
