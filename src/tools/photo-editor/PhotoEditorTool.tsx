import React, { useRef, useState, useEffect } from 'react';
import {
  Wand2,
  Type,
  Square,
  Circle,
  Download,
  RotateCw,
  SunMedium,
  Sliders,
  Undo2,
  Redo2,
  Trash2,
  Smile,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Dropzone } from '../../components/common/Dropzone';
import { downloadBlob, loadImage } from '../../utils/imageProcessors';

interface CanvasItem {
  id: string;
  type: 'text' | 'rect' | 'circle' | 'sticker';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fill: string;
  fontSize?: number;
  rotation?: number;
}

export const PhotoEditorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [baseImg, setBaseImg] = useState<HTMLImageElement | null>(null);

  // Filters & Adjustments
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [filterMode, setFilterMode] = useState<'none' | 'grayscale' | 'sepia' | 'invert' | 'vintage'>('none');

  // Canvas overlays (text, shapes, stickers)
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [history, setHistory] = useState<CanvasItem[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    const img = await loadImage(f);
    setBaseImg(img);
    setItems([]);
    setHistory([[]]);
    setHistoryIndex(0);
  };

  const pushHistory = (newItems: CanvasItem[]) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(newItems);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
    setItems(newItems);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setItems(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setItems(history[historyIndex + 1]);
    }
  };

  const addText = () => {
    const newItem: CanvasItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'text',
      x: 100,
      y: 100,
      text: 'Double click to edit',
      fill: '#FFFFFF',
      fontSize: 32,
    };
    pushHistory([...items, newItem]);
    setSelectedItemId(newItem.id);
  };

  const addShape = (type: 'rect' | 'circle') => {
    const newItem: CanvasItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      x: 120,
      y: 120,
      width: 140,
      height: 90,
      radius: 50,
      fill: '#2563EB',
    };
    pushHistory([...items, newItem]);
    setSelectedItemId(newItem.id);
  };

  const addSticker = (emoji: string) => {
    const newItem: CanvasItem = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'sticker',
      x: 150,
      y: 150,
      text: emoji,
      fill: '#000000',
      fontSize: 48,
    };
    pushHistory([...items, newItem]);
    setSelectedItemId(newItem.id);
  };

  const deleteSelectedItem = () => {
    if (!selectedItemId) return;
    const remaining = items.filter((i) => i.id !== selectedItemId);
    pushHistory(remaining);
    setSelectedItemId(null);
  };

  // Render to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = baseImg.naturalWidth;
    canvas.height = baseImg.naturalHeight;

    // Apply CSS filters directly on canvas drawing
    let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    if (filterMode === 'grayscale') filterStr += ' grayscale(100%)';
    if (filterMode === 'sepia') filterStr += ' sepia(100%)';
    if (filterMode === 'invert') filterStr += ' invert(100%)';
    if (filterMode === 'vintage') filterStr += ' sepia(50%) contrast(120%)';

    ctx.filter = filterStr;
    ctx.drawImage(baseImg, 0, 0);
    ctx.filter = 'none'; // reset filter for overlays

    // Draw overlays
    items.forEach((item) => {
      ctx.save();
      if (item.type === 'rect') {
        ctx.fillStyle = item.fill;
        ctx.fillRect(item.x, item.y, item.width || 100, item.height || 100);
      } else if (item.type === 'circle') {
        ctx.fillStyle = item.fill;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius || 40, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.type === 'text' || item.type === 'sticker') {
        ctx.font = `bold ${item.fontSize || 32}px sans-serif`;
        ctx.fillStyle = item.fill;
        ctx.textBaseline = 'top';
        // subtle drop shadow for text readability
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 6;
        ctx.fillText(item.text || '', item.x, item.y);
      }

      // Highlight selected item with border
      if (item.id === selectedItemId) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        const w = item.width || 120;
        const h = item.height || 60;
        ctx.strokeRect(item.x - 4, item.y - 4, w + 8, h + 8);
      }
      ctx.restore();
    });
  }, [baseImg, brightness, contrast, saturation, filterMode, items, selectedItemId]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) {
        downloadBlob(blob, 'edited-designkit.png');
      }
    }, 'image/png');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Wand2 className="w-4 h-4" />
          <span>Creative Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Photo Editor
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Enhance photos with brightness, contrast, saturation, filters, text typography, shapes, and fun stickers with full undo & redo history.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={false}
          title="Drop image to open Photo Editor"
          subtitle="Add text captions, geometric shapes, adjust lighting, and apply artistic filters"
          sampleType="landscape"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            {/* Toolbar row */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Add Elements
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyIndex === 0}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    title="Undo"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    title="Redo"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={addText}
                  className="py-2 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => addShape('rect')}
                  className="py-2 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Rectangle</span>
                </button>
                <button
                  type="button"
                  onClick={() => addShape('circle')}
                  className="py-2 px-2 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Circle className="w-3.5 h-3.5" />
                  <span>Circle</span>
                </button>
              </div>

              {/* Quick Stickers */}
              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5 text-amber-500" />
                  <span>Add Sticker</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['🔥', '✨', '🚀', '❤️', '🎉', '⭐', '💯', '📸'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addSticker(emoji)}
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-base transition-transform hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Adjustments: Brightness, Contrast, Saturation */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-400 block">
                Lighting & Color
              </span>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Brightness</span>
                  <span className="font-mono text-blue-600">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Contrast</span>
                  <span className="font-mono text-blue-600">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Saturation</span>
                  <span className="font-mono text-blue-600">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            {/* Artistic Filters */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Color Filters
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold">
                {[
                  { id: 'none', label: 'Original' },
                  { id: 'grayscale', label: 'B & W' },
                  { id: 'sepia', label: 'Warm Sepia' },
                  { id: 'vintage', label: 'Vintage' },
                  { id: 'invert', label: 'Invert' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterMode(f.id as any)}
                    className={`py-1.5 px-2 rounded-lg border transition-all text-center ${
                      filterMode === f.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected item controls */}
            {selectedItemId && (
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
                <span className="font-medium text-blue-800">Element selected</span>
                <button
                  type="button"
                  onClick={deleteSelectedItem}
                  className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Canvas View */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Creative Canvas</h3>
                <span className="text-xs text-slate-400">Live GPU Filter Rendering</span>
              </div>

              <div className="relative w-full h-[440px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-2">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Processed locally with zero quality degradation
              </div>
              <button
                type="button"
                onClick={handleDownload}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Edited Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
