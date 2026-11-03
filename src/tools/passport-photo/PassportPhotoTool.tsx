import React, { useState, useEffect } from 'react';
import { Camera, Download, Layers, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { Dropzone } from '../../components/common/Dropzone';
import { loadImage, downloadBlob, formatBytes } from '../../utils/imageProcessors';

interface PassportPreset {
  id: string;
  name: string;
  dimLabel: string;
  widthPx: number;
  heightPx: number;
}

const PASSPORT_PRESETS: PassportPreset[] = [
  { id: 'us', name: 'US / India Passport', dimLabel: '2 × 2 inches (51 × 51 mm)', widthPx: 600, heightPx: 600 },
  { id: 'schengen', name: 'UK / Schengen / EU', dimLabel: '35 × 45 mm', widthPx: 413, heightPx: 531 },
  { id: 'china', name: 'China Visa', dimLabel: '33 × 48 mm', widthPx: 390, heightPx: 567 },
  { id: 'japan', name: 'Japan Visa', dimLabel: '35 × 35 mm', widthPx: 413, heightPx: 413 },
  { id: 'custom', name: 'Custom Dimensions', dimLabel: 'Configurable', widthPx: 600, heightPx: 600 },
];

export const PassportPhotoTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<PassportPreset>(PASSPORT_PRESETS[0]);
  const [customW, setCustomW] = useState<number>(600);
  const [customH, setCustomH] = useState<number>(600);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [zoom, setZoom] = useState<number>(100);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [generateSheet, setGenerateSheet] = useState<boolean>(true); // 4x6 inch printable sheet
  const [sheetResult, setSheetResult] = useState<{ url: string; blob: Blob } | null>(null);
  const [singleResult, setSingleResult] = useState<{ url: string; blob: Blob } | null>(null);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setSheetResult(null);
    setSingleResult(null);
  };

  const renderPassport = async () => {
    if (!file) return;
    const img = await loadImage(file);

    const w = selectedPreset.id === 'custom' ? customW : selectedPreset.widthPx;
    const h = selectedPreset.id === 'custom' ? customH : selectedPreset.heightPx;

    // 1. Render single photo
    const singleCanvas = document.createElement('canvas');
    singleCanvas.width = w;
    singleCanvas.height = h;
    const sCtx = singleCanvas.getContext('2d')!;

    // Fill chosen background
    sCtx.fillStyle = bgColor;
    sCtx.fillRect(0, 0, w, h);

    // Draw image with zoom and pan
    const scale = (zoom / 100) * Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const drawX = (w - drawW) / 2 + panX;
    const drawY = (h - drawH) / 2 + panY;

    sCtx.drawImage(img, drawX, drawY, drawW, drawH);

    // Optional border guide
    sCtx.strokeStyle = 'rgba(0,0,0,0.1)';
    sCtx.lineWidth = 2;
    sCtx.strokeRect(1, 1, w - 2, h - 2);

    const singleBlob = await new Promise<Blob>((resolve) =>
      singleCanvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95)
    );
    setSingleResult({ url: URL.createObjectURL(singleBlob), blob: singleBlob });

    // 2. Render 4x6 inch (1200x1800 px @ 300dpi) printable sheet if requested
    const sheetCanvas = document.createElement('canvas');
    sheetCanvas.width = 1800; // 6 inches @ 300dpi
    sheetCanvas.height = 1200; // 4 inches @ 300dpi
    const sheetCtx = sheetCanvas.getContext('2d')!;

    sheetCtx.fillStyle = '#FFFFFF';
    sheetCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

    // Calculate grid copies
    const cols = Math.floor(sheetCanvas.width / (w + 40));
    const rows = Math.floor(sheetCanvas.height / (h + 40));
    const gapX = (sheetCanvas.width - cols * w) / (cols + 1);
    const gapY = (sheetCanvas.height - rows * h) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = gapX + c * (w + gapX);
        const y = gapY + r * (h + gapY);
        sheetCtx.drawImage(singleCanvas, x, y);
        // Cutting guide border
        sheetCtx.strokeStyle = '#e2e8f0';
        sheetCtx.lineWidth = 1;
        sheetCtx.strokeRect(x, y, w, h);
      }
    }

    const sheetBlob = await new Promise<Blob>((resolve) =>
      sheetCanvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95)
    );
    setSheetResult({ url: URL.createObjectURL(sheetBlob), blob: sheetBlob });
  };

  useEffect(() => {
    if (file) {
      renderPassport();
    }
  }, [file, selectedPreset, customW, customH, bgColor, zoom, panX, panY]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Camera className="w-4 h-4" />
          <span>Official ID & Document Formatting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Passport Size Photo Maker
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Crop and format portrait photos to exact physical dimensions (e.g. 2×2 inch, 35×45 mm) and generate ready-to-print 4×6 photo sheets.
        </p>
      </div>

      {/* Compliance Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-800">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
        <p>
          <strong>Notice:</strong> This tool formats photos according to standard dimensional requirements. It does not provide automated biometric or government compliance validation. Please review your issuing authority's lighting and expression guidelines before printing.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={false}
          title="Drop portrait photo here"
          subtitle="Supports standard passport, visa, and ID card formats with 4×6 inch printable sheet generation."
          sampleType="portrait"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Standard Country / Size Preset
              </label>
              <div className="space-y-1.5">
                {PASSPORT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between text-xs ${
                      selectedPreset.id === preset.id
                        ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{preset.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{preset.dimLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Background Color Fill
              </label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'White', hex: '#FFFFFF' },
                  { name: 'Light Blue', hex: '#E0F2FE' },
                  { name: 'Off White', hex: '#F8FAFC' },
                  { name: 'Neutral Gray', hex: '#E2E8F0' },
                ].map((bg) => (
                  <button
                    key={bg.hex}
                    type="button"
                    onClick={() => setBgColor(bg.hex)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      bgColor === bg.hex ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: bg.hex }}
                    />
                    <span>{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Face zoom & reposition */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Photo Zoom: {zoom}%</span>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(100);
                    setPanX(0);
                    setPanY(0);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Reset position
                </button>
              </div>
              <input
                type="range"
                min="60"
                max="200"
                value={zoom}
                onChange={(e) => setZoom(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600"
              />

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-slate-500 block mb-1">Pan Horizontal</label>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    value={panX}
                    onChange={(e) => setPanX(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Pan Vertical</label>
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    value={panY}
                    onChange={(e) => setPanY(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Upload Different Portrait
              </button>
            </div>
          </div>

          {/* Preview & Sheet */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  {generateSheet ? 'Printable 4×6" Photo Sheet' : 'Single Passport Photo'}
                </h3>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setGenerateSheet(false)}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      !generateSheet ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Single Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setGenerateSheet(true)}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      generateSheet ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    4×6" Print Sheet
                  </button>
                </div>
              </div>

              <div className="relative w-full h-[360px] bg-slate-900/90 rounded-xl overflow-hidden flex items-center justify-center p-4">
                {generateSheet && sheetResult ? (
                  <img
                    src={sheetResult.url}
                    alt="Printable Sheet"
                    className="max-w-full max-h-full object-contain shadow-lg border border-white/20"
                  />
                ) : singleResult ? (
                  <img
                    src={singleResult.url}
                    alt="Single Passport"
                    className="max-w-full max-h-full object-contain shadow-lg border border-white/20"
                  />
                ) : null}
              </div>
            </div>

            {/* Downloads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {singleResult && (
                <button
                  type="button"
                  onClick={() => downloadBlob(singleResult.blob, 'passport-photo-single.jpg')}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Download Single Photo</span>
                </button>
              )}

              {sheetResult && (
                <button
                  type="button"
                  onClick={() => downloadBlob(sheetResult.blob, 'passport-photo-sheet-4x6.jpg')}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4×6" Printable Sheet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
