import React, { useState, useEffect } from 'react';
import {
  Database,
  ArrowRight,
  Download,
  RotateCcw,
  Sliders,
  SlidersHorizontal,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileArchive,
  Image as ImageIcon,
  Check,
  ChevronDown,
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { Dropzone } from '../../components/common/Dropzone';
import { CompareSlider } from '../../components/common/CompareSlider';
import {
  compressImage,
  formatBytes,
  getImageDimensions,
  downloadBlob,
  CompressResult,
} from '../../utils/imageProcessors';

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
  width: number;
  height: number;
  result?: CompressResult;
  status: 'idle' | 'processing' | 'done' | 'error';
  statusMessage?: string;
  error?: string;
}

export const CompressImageTool: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Compression Mode: 'target' | 'quality'
  const [mode, setMode] = useState<'target' | 'quality'>('target');

  // Target size options
  const TARGET_PRESETS = [
    { label: '20 KB', bytes: 20 * 1024 },
    { label: '50 KB', bytes: 50 * 1024 },
    { label: '100 KB', bytes: 100 * 1024 },
    { label: '150 KB', bytes: 150 * 1024 },
    { label: '200 KB', bytes: 200 * 1024 },
    { label: '300 KB', bytes: 300 * 1024 },
    { label: '500 KB', bytes: 500 * 1024 },
    { label: '1 MB', bytes: 1024 * 1024 },
    { label: '2 MB', bytes: 2 * 1024 * 1024 },
  ];

  const [selectedTargetBytes, setSelectedTargetBytes] = useState<number>(100 * 1024);
  const [customTargetVal, setCustomTargetVal] = useState<string>('100');
  const [customUnit, setCustomUnit] = useState<'KB' | 'MB'>('KB');

  // Quality Mode
  const [qualityPercent, setQualityPercent] = useState<number>(75);

  // Additional settings
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [maxWidth, setMaxWidth] = useState<string>('');
  const [maxHeight, setMaxHeight] = useState<string>('');
  const [preserveAspectRatio, setPreserveAspectRatio] = useState<boolean>(true);
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [globalProgressMessage, setGlobalProgressMessage] = useState<string>('');

  const currentItem = images[selectedIndex] || null;

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        URL.revokeObjectURL(img.previewUrl);
        if (img.result?.url) URL.revokeObjectURL(img.result.url);
      });
    };
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const newItems: ImageItem[] = [];
    for (const file of files) {
      try {
        const previewUrl = URL.createObjectURL(file);
        const dims = await getImageDimensions(file);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          previewUrl,
          originalSize: file.size,
          width: dims.width,
          height: dims.height,
          status: 'idle',
        });
      } catch (e) {
        console.error('Failed to load file', file.name, e);
      }
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
      if (images.length === 0) {
        setSelectedIndex(0);
      }
    }
  };

  const handleCustomTargetChange = (val: string, unit: 'KB' | 'MB') => {
    setCustomTargetVal(val);
    setCustomUnit(unit);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const bytes = unit === 'MB' ? num * 1024 * 1024 : num * 1024;
      setSelectedTargetBytes(bytes);
    }
  };

  const handlePresetClick = (presetBytes: number) => {
    setSelectedTargetBytes(presetBytes);
    if (presetBytes >= 1024 * 1024) {
      setCustomTargetVal((presetBytes / (1024 * 1024)).toString());
      setCustomUnit('MB');
    } else {
      setCustomTargetVal((presetBytes / 1024).toString());
      setCustomUnit('KB');
    }
  };

  // Run Compression
  const handleStartCompression = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      const item = updatedImages[i];
      setSelectedIndex(i);
      setGlobalProgressMessage(`Processing "${item.file.name}" (${i + 1}/${updatedImages.length})...`);

      item.status = 'processing';
      setImages([...updatedImages]);

      try {
        const parsedMaxWidth = maxWidth ? parseInt(maxWidth, 10) : undefined;
        const parsedMaxHeight = maxHeight ? parseInt(maxHeight, 10) : undefined;

        const result = await compressImage(item.file, {
          mode,
          targetBytes: selectedTargetBytes,
          qualityPercent,
          outputFormat,
          maxWidth: parsedMaxWidth,
          maxHeight: parsedMaxHeight,
          preserveAspectRatio,
          onProgress: (status) => {
            item.statusMessage = status;
            setGlobalProgressMessage(status);
            setImages([...updatedImages]);
          },
        });

        item.result = result;
        item.status = 'done';
      } catch (err: any) {
        item.status = 'error';
        item.error = err.message || 'Compression failed';
      }

      setImages([...updatedImages]);
    }

    setIsProcessing(false);
    setGlobalProgressMessage('');

    // Trigger subtle confetti celebration
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563eb', '#38bdf8', '#10b981'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleDownloadSingle = (item: ImageItem) => {
    if (!item.result?.blob) return;
    const originalName = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || item.file.name;
    const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
    downloadBlob(item.result.blob, `${originalName}-compressed.${ext}`);
  };

  const handleDownloadAllZip = async () => {
    const doneItems = images.filter((img) => img.status === 'done' && img.result?.blob);
    if (doneItems.length === 0) return;

    setGlobalProgressMessage('Packaging ZIP archive...');
    const zip = new JSZip();

    doneItems.forEach((img, idx) => {
      const originalName = img.file.name.substring(0, img.file.name.lastIndexOf('.')) || `image-${idx + 1}`;
      const ext = outputFormat === 'image/webp' ? 'webp' : outputFormat === 'image/png' ? 'png' : 'jpg';
      zip.file(`${originalName}-compressed.${ext}`, img.result!.blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'designkit-compressed-images.zip');
    setGlobalProgressMessage('');
  };

  const handleReset = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl);
      if (img.result?.url) URL.revokeObjectURL(img.result.url);
    });
    setImages([]);
    setSelectedIndex(0);
    setIsProcessing(false);
  };

  const hasResults = images.some((img) => img.status === 'done');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header Info */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Flagship Optimization Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Image Compressor
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Compress JPG, PNG, and WebP images client-side. Set an exact target file size (e.g. 100 KB, 500 KB) or adjust quality with real-time before/after visual inspection.
        </p>
      </div>

      {/* Main Upload / View Area */}
      {images.length === 0 ? (
        <Dropzone
          onFilesSelected={handleFilesSelected}
          multiple={true}
          title="Drop images here for compression"
          subtitle="Supports bulk compression of JPG, PNG, and WebP. 100% private in-browser processing."
          sampleType="landscape"
        />
      ) : (
        <div className="space-y-6">
          {/* Thumbnails strip for multi-image / bulk */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>Selected Images ({images.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.multiple = true;
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handleFilesSelected(Array.from(files));
                    };
                    input.click();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  + Add more
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 text-left transition-all ${
                    selectedIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-500/20 scale-102'
                      : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white px-1.5 py-0.5 truncate font-mono">
                    {formatBytes(item.originalSize, 0)}
                  </div>
                  {item.status === 'done' && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Image Details Card */}
          {currentItem && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                  <img
                    src={currentItem.previewUrl}
                    alt={currentItem.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm max-w-xs sm:max-w-md truncate">
                    {currentItem.file.name}
                  </div>
                  <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{currentItem.width} × {currentItem.height} px</span>
                    <span>·</span>
                    <span className="font-mono">{formatBytes(currentItem.originalSize)}</span>
                    <span>·</span>
                    <span className="uppercase">{currentItem.file.type.replace('image/', '') || 'JPG'}</span>
                  </div>
                </div>
              </div>

              {currentItem.status === 'done' && currentItem.result && (
                <div className="flex items-center gap-3 bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-xs">
                  <div>
                    <span className="text-slate-400">Compressed: </span>
                    <span className="font-semibold text-emerald-700 font-mono">
                      {formatBytes(currentItem.result.size)}
                    </span>
                  </div>
                  <div className="w-px h-4 bg-slate-200" />
                  <div className="text-emerald-700 font-semibold">
                    {Math.round(((currentItem.originalSize - currentItem.result.size) / currentItem.originalSize) * 100)}% saved
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Compression Controls */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              {/* Mode Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Compression Mode
                </label>
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMode('target')}
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                      mode === 'target'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>Target File Size</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('quality')}
                    className={`py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                      mode === 'quality'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Quality Slider</span>
                  </button>
                </div>
              </div>

              {/* MODE 1: Target File Size */}
              {mode === 'target' ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-700">
                        Quick Preset Target Sizes
                      </span>
                      <span className="text-xs text-blue-600 font-medium font-mono">
                        Target: {formatBytes(selectedTargetBytes)}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {TARGET_PRESETS.map((preset) => {
                        const isSelected = selectedTargetBytes === preset.bytes;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handlePresetClick(preset.bytes)}
                            className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Target Input */}
                  <div className="pt-2 border-t border-slate-100">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Or specify custom maximum size:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={customTargetVal}
                        onChange={(e) => handleCustomTargetChange(e.target.value, customUnit)}
                        placeholder="e.g. 100"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                      <select
                        value={customUnit}
                        onChange={(e) =>
                          handleCustomTargetChange(customTargetVal, e.target.value as 'KB' | 'MB')
                        }
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                      >
                        <option value="KB">KB</option>
                        <option value="MB">MB</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      The binary search algorithm will automatically adjust compression and downscale if necessary to ensure output is under your target.
                    </p>
                  </div>
                </div>
              ) : (
                /* MODE 2: Quality Slider */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      Compression Quality:
                    </span>
                    <span className="text-sm font-bold text-blue-600 font-mono">
                      {qualityPercent}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    value={qualityPercent}
                    onChange={(e) => setQualityPercent(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />

                  {/* Quality presets */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[
                      { label: 'Smallest', q: 30, desc: '30%' },
                      { label: 'Balanced', q: 65, desc: '65%' },
                      { label: 'High Qual', q: 80, desc: '80%' },
                      { label: 'Max Qual', q: 95, desc: '95%' },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setQualityPercent(p.q)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                          qualityPercent === p.q
                            ? 'bg-blue-50 text-blue-600 border-blue-400 font-semibold'
                            : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        <div>{p.label}</div>
                        <div className="text-[10px] text-slate-400">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Lower percentage produces smaller file sizes, while higher percentage preserves photographic details.
                  </p>
                </div>
              )}

              {/* Additional Settings */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Format & Sizing Settings
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Output Format
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="image/jpeg">JPEG (.jpg) - Recommended</option>
                      <option value="image/webp">WebP (.webp) - Modern & Small</option>
                      <option value="image/png">PNG (.png) - Lossless</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Max Dimensions (Optional)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Max Width (px)"
                        value={maxWidth}
                        onChange={(e) => setMaxWidth(e.target.value)}
                        className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max Height"
                        value={maxHeight}
                        onChange={(e) => setMaxHeight(e.target.value)}
                        className="w-1/2 px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preserveAspectRatio}
                      onChange={(e) => setPreserveAspectRatio(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Preserve Aspect Ratio</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={removeMetadata}
                      onChange={(e) => setRemoveMetadata(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Strip Camera EXIF Metadata</span>
                  </label>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleStartCompression}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{globalProgressMessage || 'Compressing...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>
                        Compress {images.length > 1 ? `All ${images.length} Images` : 'Image Now'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right 5 cols: Comparison & Real Results */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>Visual Quality Comparison</span>
                  {currentItem?.status === 'done' && (
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Optimized
                    </span>
                  )}
                </h3>

                {currentItem && currentItem.result ? (
                  <div className="space-y-4">
                    <CompareSlider
                      originalUrl={currentItem.previewUrl}
                      compressedUrl={currentItem.result.url}
                      originalSizeText={formatBytes(currentItem.originalSize)}
                      compressedSizeText={formatBytes(currentItem.result.size)}
                    />

                    {/* Stats table */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Original Size:</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          {formatBytes(currentItem.originalSize)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Compressed Size:</span>
                        <span className="font-bold text-blue-600 font-mono">
                          {formatBytes(currentItem.result.size)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Space Saved:</span>
                        <span className="font-bold text-emerald-600 font-mono">
                          {formatBytes(Math.max(0, currentItem.originalSize - currentItem.result.size))} (
                          {Math.round(((currentItem.originalSize - currentItem.result.size) / currentItem.originalSize) * 100)}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Output Dimensions:</span>
                        <span className="font-medium text-slate-700 font-mono">
                          {currentItem.result.width} × {currentItem.result.height} px
                        </span>
                      </div>
                      {currentItem.result.qualityUsed && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Quality Factor:</span>
                          <span className="font-medium text-slate-700">
                            {currentItem.result.qualityUsed}%
                          </span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-slate-200 text-slate-600 italic text-[11px]">
                        {currentItem.result.message}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <ImageIcon className="w-10 h-10 mb-2 stroke-1" />
                    <p className="text-xs">
                      Choose settings on the left and click "Compress Image Now" to view interactive before/after comparison.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {currentItem?.status === 'done' && (
                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(currentItem)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Compressed Image</span>
                  </button>

                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={handleDownloadAllZip}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
                    >
                      <FileArchive className="w-4 h-4 text-blue-600" />
                      <span>Download All as ZIP Archive</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
