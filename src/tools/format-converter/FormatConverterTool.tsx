import React, { useState } from 'react';
import { ArrowLeftRight, Download, FileArchive, Check, Sparkles, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import { Dropzone } from '../../components/common/Dropzone';
import { loadImage, canvasToBlob, downloadBlob, formatBytes } from '../../utils/imageProcessors';

interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;
  status: 'idle' | 'converting' | 'done' | 'error';
  error?: string;
}

export const FormatConverterTool: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [globalTargetFormat, setGlobalTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = (files: File[]) => {
    const newItems: BatchItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      targetFormat: globalTargetFormat,
      status: 'idle',
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const handleConvertAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    const updated = [...items];
    for (const item of updated) {
      item.status = 'converting';
      setItems([...updated]);

      try {
        const img = await loadImage(item.file);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;

        if (item.targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const quality = item.targetFormat === 'image/png' ? undefined : 0.92;
        const blob = await canvasToBlob(canvas, item.targetFormat, quality);
        item.resultBlob = blob;
        item.resultUrl = URL.createObjectURL(blob);
        item.resultSize = blob.size;
        item.status = 'done';
      } catch (e: any) {
        item.status = 'error';
        item.error = e.message || 'Conversion error';
      }

      setItems([...updated]);
    }

    setIsProcessing(false);
  };

  const handleDownloadSingle = (item: BatchItem) => {
    if (!item.resultBlob) return;
    const name = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || 'image';
    const ext = item.targetFormat === 'image/jpeg' ? 'jpg' : item.targetFormat === 'image/webp' ? 'webp' : 'png';
    downloadBlob(item.resultBlob, `${name}.${ext}`);
  };

  const handleDownloadZip = async () => {
    const doneItems = items.filter((i) => i.status === 'done' && i.resultBlob);
    if (doneItems.length === 0) return;

    const zip = new JSZip();
    doneItems.forEach((item, idx) => {
      const name = item.file.name.substring(0, item.file.name.lastIndexOf('.')) || `image-${idx + 1}`;
      const ext = item.targetFormat === 'image/jpeg' ? 'jpg' : item.targetFormat === 'image/webp' ? 'webp' : 'png';
      zip.file(`${name}.${ext}`, item.resultBlob!);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(blob, 'designkit-converted-images.zip');
  };

  const handleFormatChange = (fmt: 'image/jpeg' | 'image/png' | 'image/webp') => {
    setGlobalTargetFormat(fmt);
    setItems((prev) =>
      prev.map((i) => ({
        ...i,
        targetFormat: fmt,
        status: 'idle',
        resultBlob: undefined,
        resultUrl: undefined,
      }))
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <ArrowLeftRight className="w-4 h-4" />
          <span>Universal Format Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Image Format Converter
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Batch convert images between JPG, PNG, WebP, and BMP. Process single or multiple files with high fidelity directly in your browser.
        </p>
      </div>

      {items.length === 0 ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={true}
          title="Drop one or multiple images to convert"
          subtitle="Supports batch conversion of JPG, PNG, WebP, and standard image formats"
          sampleType="landscape"
        />
      ) : (
        <div className="space-y-6">
          {/* Global Target Format Picker */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Batch Target Format
              </span>
              <div className="flex items-center gap-2">
                {[
                  { id: 'image/jpeg', label: 'JPEG (.jpg)' },
                  { id: 'image/png', label: 'PNG (.png)' },
                  { id: 'image/webp', label: 'WebP (.webp)' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => handleFormatChange(fmt.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      globalTargetFormat === fmt.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConvertAll}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Convert All ({items.length})</span>
              </button>

              {items.some((i) => i.status === 'done') && (
                <button
                  type="button"
                  onClick={handleDownloadZip}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <FileArchive className="w-4 h-4" />
                  <span>Download ZIP</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setItems([])}
                className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* List of items */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={item.resultUrl || item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800 max-w-sm truncate">
                      {item.file.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                      <span>Source: {formatBytes(item.file.size)}</span>
                      <span>·</span>
                      <span className="uppercase text-blue-600 font-semibold">
                        Target: {item.targetFormat.replace('image/', '')}
                      </span>
                      {item.resultSize && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600 font-semibold">
                            Output: {formatBytes(item.resultSize)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'done' && (
                    <button
                      type="button"
                      onClick={() => handleDownloadSingle(item)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>Download</span>
                    </button>
                  )}
                  {item.status === 'converting' && (
                    <span className="text-xs text-blue-600 flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Converting...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Compatibility Note */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
            <strong>Browser Support:</strong> DesignKit converts image formats client-side using browser-native Canvas engines. Formats like JPG, PNG, and WebP are universally supported with high performance. Specialized binary containers (e.g. Photoshop PSD, RAW camera formats, multi-frame animated GIFs) are not converted.
          </div>
        </div>
      )}
    </div>
  );
};
