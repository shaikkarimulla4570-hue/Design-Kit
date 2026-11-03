import React, { useState } from 'react';
import { ArrowRight, Download, Image as ImageIcon } from 'lucide-react';
import { Dropzone } from '../../components/common/Dropzone';
import { loadImage, canvasToBlob, downloadBlob, formatBytes } from '../../utils/imageProcessors';

export const ConvertFromJpgTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState<number>(90);
  const [result, setResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const q = targetFormat === 'image/webp' ? quality / 100 : undefined;
      const blob = await canvasToBlob(canvas, targetFormat, q);
      setResult({
        blob,
        url: URL.createObjectURL(blob),
        size: blob.size,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'converted';
    const ext = targetFormat === 'image/webp' ? 'webp' : 'png';
    downloadBlob(result.blob, `${name}.${ext}`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <ImageIcon className="w-4 h-4" />
          <span>Format Conversion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Convert from JPG
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Convert standard JPG photos into modern WebP for higher compression or PNG for lossless editing.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={false}
          title="Drop JPG image here"
          subtitle="Convert to transparent PNG or lightweight WebP directly in your browser."
          sampleType="landscape"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Source JPG Image
              </div>
              <div className="text-sm font-semibold text-slate-800 truncate">{file.name}</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                Size: {formatBytes(file.size)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Convert To Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetFormat('image/png')}
                  className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                    targetFormat === 'image/png'
                      ? 'bg-blue-50 text-blue-600 border-blue-500 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold">PNG (.png)</div>
                  <div className="text-[11px] text-slate-400 font-normal">Lossless raster image</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetFormat('image/webp')}
                  className={`py-3 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                    targetFormat === 'image/webp'
                      ? 'bg-blue-50 text-blue-600 border-blue-500 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="font-bold">WebP (.webp)</div>
                  <div className="text-[11px] text-slate-400 font-normal">Modern high-compression</div>
                </button>
              </div>
            </div>

            {targetFormat === 'image/webp' && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">WebP Quality:</span>
                  <span className="font-bold text-blue-600 font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Convert Image</span>
                <ArrowRight className="w-4 h-4" />
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

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                {result ? `Converted ${targetFormat === 'image/webp' ? 'WebP' : 'PNG'} Output` : 'Original Preview'}
              </h3>

              <div className="relative w-full h-[360px] bg-slate-900/90 rounded-xl overflow-hidden flex items-center justify-center p-4">
                <img
                  src={result ? result.url : previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain shadow-lg"
                />
              </div>

              {result && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span>Format: <strong>{targetFormat === 'image/webp' ? 'WebP' : 'PNG'}</strong></span>
                  <span className="font-mono">Output Size: {formatBytes(result.size)}</span>
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
                  <span>Download Converted File</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
