import React, { useState } from 'react';
import { FileText, Download, ArrowUpDown, Trash2, Sparkles, Layers } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Dropzone } from '../../components/common/Dropzone';
import { loadImage, downloadBlob, formatBytes } from '../../utils/imageProcessors';

interface PdfImagePage {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export const ImageToPdfTool: React.FC = () => {
  const [pages, setPages] = useState<PdfImagePage[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(10); // mm
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleFiles = async (files: File[]) => {
    const newPages: PdfImagePage[] = [];
    for (const f of files) {
      const url = URL.createObjectURL(f);
      const img = await loadImage(f);
      newPages.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        previewUrl: url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    }
    setPages((prev) => [...prev, ...newPages]);
  };

  const movePage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= pages.length) return;
    const copy = [...pages];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    setPages(copy);
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleGeneratePdf = async () => {
    if (pages.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF({
        orientation,
        unit: 'mm',
        format: pageSize,
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const printableW = pageWidth - margin * 2;
      const printableH = pageHeight - margin * 2;

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) doc.addPage(pageSize, orientation);

        const page = pages[i];
        const img = await loadImage(page.file);

        // Aspect fit calculation
        const imgAspect = img.naturalWidth / img.naturalHeight;
        let drawW = printableW;
        let drawH = drawW / imgAspect;

        if (drawH > printableH) {
          drawH = printableH;
          drawW = drawH * imgAspect;
        }

        const xPos = margin + (printableW - drawW) / 2;
        const yPos = margin + (printableH - drawH) / 2;

        // Draw image onto canvas to get clean JPEG data URL
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        doc.addImage(imgData, 'JPEG', xPos, yPos, drawW, drawH);
      }

      doc.save('designkit-document.pdf');
    } catch (e) {
      console.error('PDF Generation failed', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Document Compilation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Image to PDF Converter
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Combine single or multiple images into a clean, paginated PDF document. Reorder pages, customize margins, and set page orientation.
        </p>
      </div>

      {pages.length === 0 ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={true}
          title="Drop images to compile into a PDF"
          subtitle="Supports JPG, PNG, and WebP. Reorder pages and customize paper layout."
          sampleType="landscape"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div>
                <label className="text-slate-500 block mb-1">Paper Size</label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="a4">A4 (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Orientation</label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setOrientation('portrait')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      orientation === 'portrait' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('landscape')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      orientation === 'landscape' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Margins</label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                >
                  <option value="0">None (0 mm)</option>
                  <option value="10">Normal (10 mm)</option>
                  <option value="20">Wide (20 mm)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF ({pages.length} Pages)</span>
              </button>

              <button
                type="button"
                onClick={() => setPages([])}
                className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Page Grid with Reordering */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pages.map((p, idx) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex flex-col justify-between group"
              >
                <div className="relative aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center mb-2">
                  <img src={p.previewUrl} alt={`Page ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                  <div className="absolute top-1.5 left-1.5 bg-slate-900/80 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                    Page {idx + 1}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => movePage(idx, idx - 1)}
                      className="p-1 hover:bg-slate-100 disabled:opacity-30 rounded text-slate-600"
                      title="Move backward"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={idx === pages.length - 1}
                      onClick={() => movePage(idx, idx + 1)}
                      className="p-1 hover:bg-slate-100 disabled:opacity-30 rounded text-slate-600"
                      title="Move forward"
                    >
                      →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePage(p.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    title="Remove page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
