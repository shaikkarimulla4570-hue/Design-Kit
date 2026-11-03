import React, { useState } from 'react';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, Sparkles } from 'lucide-react';
import { Dropzone } from '../../components/common/Dropzone';
import { rotateAndFlipImage, downloadBlob, formatBytes } from '../../utils/imageProcessors';

export const RotateImageTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [result, setResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setResult(null);
  };

  const handleRotate90 = (dir: 'cw' | 'ccw') => {
    const delta = dir === 'cw' ? 90 : -90;
    setRotation((prev) => (prev + delta) % 360);
    setResult(null);
  };

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const res = await rotateAndFlipImage(file, rotation, flipH, flipV, 'image/png');
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
    downloadBlob(result.blob, `${name}-rotated.png`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <RotateCw className="w-4 h-4" />
          <span>Orientation & Geometry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Rotate Image
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Rotate photos 90°, 180°, or any custom angle. Mirror or flip photos horizontally and vertically with zero loss.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={false}
          title="Drop image to rotate or flip"
          subtitle="Rotate clockwise, counter-clockwise, or flip horizontally & vertically"
          sampleType="landscape"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Active Source
              </span>
              <div className="text-sm font-semibold text-slate-800 truncate">{file.name}</div>
            </div>

            {/* Quick 90 deg buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Quick 90° Turn
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleRotate90('ccw')}
                  className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>90° Left</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRotate90('cw')}
                  className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>90° Right</span>
                </button>
              </div>
            </div>

            {/* Flip toggles */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Flip / Mirror
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFlipH(!flipH);
                    setResult(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    flipH
                      ? 'bg-blue-50 text-blue-600 border-blue-400 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span>Flip Horizontal</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFlipV(!flipV);
                    setResult(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-2 ${
                    flipV
                      ? 'bg-blue-50 text-blue-600 border-blue-400 font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <FlipVertical className="w-4 h-4" />
                  <span>Flip Vertical</span>
                </button>
              </div>
            </div>

            {/* Custom Angle Slider */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Arbitrary Angle:</span>
                <span className="font-bold text-blue-600 font-mono">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => {
                  setRotation(parseInt(e.target.value, 10));
                  setResult(null);
                }}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-180°</span>
                <span>0°</span>
                <span>+180°</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleApply}
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Render Rotation</span>
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
                {result ? 'Rendered Output' : 'Live Orientation Preview'}
              </h3>

              <div className="relative w-full h-[360px] bg-slate-900/90 rounded-xl overflow-hidden flex items-center justify-center p-4">
                <img
                  src={result ? result.url : previewUrl}
                  alt="Rotated preview"
                  style={
                    !result
                      ? {
                          transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                          transition: 'transform 0.2s ease',
                        }
                      : {}
                  }
                  className="max-w-full max-h-full object-contain shadow-lg"
                />
              </div>

              {result && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span>Rotation: <strong>{rotation}°</strong> | Flip: <strong>{flipH ? 'H ' : ''}{flipV ? 'V' : ''}{!flipH && !flipV ? 'None' : ''}</strong></span>
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
                  <span>Download Rotated Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
