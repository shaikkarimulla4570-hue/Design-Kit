import React, { useState, useEffect } from 'react';
import { Droplet, Download, Type, Image as ImageIcon, Grid3X3, Sparkles } from 'lucide-react';
import { Dropzone } from '../../components/common/Dropzone';
import { applyWatermark, downloadBlob, formatBytes, WatermarkOptions } from '../../utils/imageProcessors';

export const WatermarkTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Watermark options
  const [wmType, setWmType] = useState<'text' | 'image'>('text');
  const [text, setText] = useState<string>('© DesignKit Proof');
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [fontSize, setFontSize] = useState<number>(36);
  const [opacity, setOpacity] = useState<number>(0.65);
  const [rotation, setRotation] = useState<number>(-25);
  const [position, setPosition] = useState<WatermarkOptions['position']>('center');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoScale, setLogoScale] = useState<number>(25);

  const [result, setResult] = useState<{ blob: Blob; url: string; size: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setResult(null);
  };

  const handleApply = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const res = await applyWatermark(file, {
        type: wmType,
        text,
        textColor,
        fontSize,
        opacity,
        rotation,
        position,
        logoFile: logoFile || undefined,
        logoScale,
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (file) {
      handleApply();
    }
  }, [file, wmType, text, textColor, fontSize, opacity, rotation, position, logoFile, logoScale]);

  const handleDownload = () => {
    if (!result || !file) return;
    const name = file.name.substring(0, file.name.lastIndexOf('.')) || 'watermarked';
    downloadBlob(result.blob, `${name}-watermarked.png`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Droplet className="w-4 h-4" />
          <span>Brand Protection & Copyright</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Watermark Image
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Safeguard your creative photographs with custom copyright text or logo stamps, adjustable transparency, and repeating tiled patterns.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={false}
          title="Drop image to add watermark"
          subtitle="Add text watermarks or company logos with full opacity control"
          sampleType="landscape"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            {/* Watermark Type Selector */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setWmType('text')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  wmType === 'text' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Type className="w-4 h-4" />
                <span>Text Watermark</span>
              </button>
              <button
                type="button"
                onClick={() => setWmType('image')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  wmType === 'image' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Logo Stamp</span>
              </button>
            </div>

            {wmType === 'text' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g. © 2026 Studio"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                      />
                      <span className="text-xs font-mono text-slate-600">{textColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Font Size ({fontSize}px)
                    </label>
                    <input
                      type="range"
                      min="14"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Transparent Logo (PNG / SVG)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLogoFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">Logo Scale:</span>
                    <span className="font-mono text-blue-600">{logoScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={logoScale}
                    onChange={(e) => setLogoScale(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Position Picker */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Placement Grid
              </label>
              <div className="grid grid-cols-3 gap-1.5 max-w-[200px]">
                {[
                  { id: 'top-left', label: 'TL' },
                  { id: 'top-center', label: 'TC' },
                  { id: 'top-right', label: 'TR' },
                  { id: 'bottom-left', label: 'BL' },
                  { id: 'center', label: 'Center' },
                  { id: 'bottom-right', label: 'BR' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id as any)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                      position === pos.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setPosition('tile')}
                  className={`w-full py-2 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                    position === 'tile'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Full Canvas Repeating Tile</span>
                </button>
              </div>
            </div>

            {/* Opacity & Rotation */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-700">Opacity:</span>
                  <span className="font-mono text-blue-600">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={Math.round(opacity * 100)}
                  onChange={(e) => setOpacity(parseInt(e.target.value, 10) / 100)}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-700">Rotation Angle:</span>
                  <span className="font-mono text-blue-600">{rotation}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Change Image
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Live Watermarked Output</h3>

              <div className="relative w-full h-[360px] bg-slate-900/90 rounded-xl overflow-hidden flex items-center justify-center p-4">
                <img
                  src={result ? result.url : previewUrl}
                  alt="Watermarked"
                  className="max-w-full max-h-full object-contain shadow-lg"
                />
              </div>

              {result && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span>Watermark Applied: <strong>{wmType === 'text' ? `"${text}"` : 'Logo'}</strong></span>
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
                  <span>Download Watermarked Image</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
