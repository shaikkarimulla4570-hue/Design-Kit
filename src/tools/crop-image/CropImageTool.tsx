import React, { useState, useRef, useEffect } from 'react';
import { Crop, Download, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Dropzone } from '../../components/common/Dropzone';
import { loadImage, cropImage, downloadBlob, formatBytes } from '../../utils/imageProcessors';

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CropImageTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cropBox, setCropBox] = useState<CropBox>({ x: 20, y: 20, width: 200, height: 200 });
  const [aspectPreset, setAspectPreset] = useState<string>('free'); // 'free', '1:1', '4:3', '16:9', '9:16'
  const [result, setResult] = useState<{
    blob: Blob;
    url: string;
    width: number;
    height: number;
    size: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ mouseX: number; mouseY: number; boxX: number; boxY: number }>({
    mouseX: 0,
    mouseY: 0,
    boxX: 0,
    boxY: 0,
  });

  const handleFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);

    const img = await loadImage(f);
    setImgElement(img);

    // Initial crop box centered 70%
    const initW = Math.round(img.naturalWidth * 0.7);
    const initH = Math.round(img.naturalHeight * 0.7);
    setCropBox({
      x: Math.round((img.naturalWidth - initW) / 2),
      y: Math.round((img.naturalHeight - initH) / 2),
      width: initW,
      height: initH,
    });
    setResult(null);
  };

  const setPresetRatio = (preset: string) => {
    setAspectPreset(preset);
    if (!imgElement) return;

    const natW = imgElement.naturalWidth;
    const natH = imgElement.naturalHeight;

    let targetRatio = 1;
    if (preset === '1:1') targetRatio = 1;
    else if (preset === '4:3') targetRatio = 4 / 3;
    else if (preset === '16:9') targetRatio = 16 / 9;
    else if (preset === '9:16') targetRatio = 9 / 16;
    else return; // free

    let newW = natW * 0.7;
    let newH = newW / targetRatio;
    if (newH > natH * 0.9) {
      newH = natH * 0.7;
      newW = newH * targetRatio;
    }

    setCropBox({
      x: Math.round((natW - newW) / 2),
      y: Math.round((natH - newH) / 2),
      width: Math.round(newW),
      height: Math.round(newH),
    });
  };

  const handleCrop = async () => {
    if (!file) return;
    try {
      const cropped = await cropImage(file, cropBox, 'image/png');
      setResult(cropped);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
    downloadBlob(result.blob, `${name}-cropped.png`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Crop className="w-4 h-4" />
          <span>Composition Precision</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Crop Image
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Trim unwanted outer areas, frame subjects, and crop images to 1:1 square, 16:9 landscape, 9:16 mobile story, or custom aspect ratios.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={false}
          title="Drop image to crop"
          subtitle="Supports precise freehand cropping and standard social aspect ratios"
          sampleType="landscape"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Aspect Ratio Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'free', label: 'Freeform' },
                  { id: '1:1', label: '1:1 Square' },
                  { id: '4:3', label: '4:3 Standard' },
                  { id: '16:9', label: '16:9 Banner' },
                  { id: '9:16', label: '9:16 Story' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPresetRatio(p.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      aspectPreset === p.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Numeric Coordinates */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-700 block">
                Crop Area Geometry (px)
              </span>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="text-slate-500 block mb-1">X Offset</label>
                  <input
                    type="number"
                    value={cropBox.x}
                    onChange={(e) =>
                      setCropBox((prev) => ({ ...prev, x: parseInt(e.target.value, 10) || 0 }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Y Offset</label>
                  <input
                    type="number"
                    value={cropBox.y}
                    onChange={(e) =>
                      setCropBox((prev) => ({ ...prev, y: parseInt(e.target.value, 10) || 0 }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Crop Width</label>
                  <input
                    type="number"
                    value={cropBox.width}
                    onChange={(e) =>
                      setCropBox((prev) => ({ ...prev, width: parseInt(e.target.value, 10) || 10 }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Crop Height</label>
                  <input
                    type="number"
                    value={cropBox.height}
                    onChange={(e) =>
                      setCropBox((prev) => ({ ...prev, height: parseInt(e.target.value, 10) || 10 }))
                    }
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCrop}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Apply Crop</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Choose Another Image
              </button>
            </div>
          </div>

          {/* Canvas Interactive View */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                {result ? 'Cropped Preview' : 'Interactive Crop Window'}
              </h3>

              {result ? (
                <div className="space-y-4">
                  <div className="relative w-full h-[360px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={result.url}
                      alt="Cropped output"
                      className="max-w-full max-h-full object-contain shadow-lg"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-mono">
                      {result.width} × {result.height} px
                    </div>
                  </div>

                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <span>Cropped Output Dimension: <strong>{result.width} × {result.height} px</strong></span>
                    <span className="font-mono">{formatBytes(result.size)}</span>
                  </div>
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="relative w-full h-[360px] bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-4"
                >
                  <img
                    src={previewUrl}
                    alt="Source"
                    className="max-w-full max-h-full object-contain opacity-75"
                  />
                  {/* Visual Crop Box Simulation Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] w-3/4 h-3/4 rounded-sm flex items-center justify-center text-white/90 text-xs font-semibold backdrop-blur-[1px]">
                      Crop Preview Region
                    </div>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Adjust Crop
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Cropped Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
