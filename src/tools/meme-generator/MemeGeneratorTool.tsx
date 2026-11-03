import React, { useState, useEffect, useRef } from 'react';
import { Smile, Download, Type, Sparkles, UploadCloud, RefreshCw } from 'lucide-react';
import { downloadBlob, loadImage } from '../../utils/imageProcessors';

interface MemeTemplate {
  id: string;
  name: string;
  drawTemplate: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  defaultTop: string;
  defaultBottom: string;
}

const TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Approves / Disapproves',
    defaultTop: 'COMPLICATED PHOTO SOFTWARE',
    defaultBottom: 'DESIGNKIT FREE IMAGE TOOLS',
    drawTemplate: (ctx, w, h) => {
      // Top half orange bg, bottom half teal
      ctx.fillStyle = '#ffedd5';
      ctx.fillRect(0, 0, w / 2, h / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w / 2, 0, w / 2, h / 2);

      ctx.fillStyle = '#dbeafe';
      ctx.fillRect(0, h / 2, w / 2, h / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(w / 2, h / 2, w / 2, h / 2);

      // Dividing lines
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, w, h);
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();

      // Top Emoji Disapproval
      ctx.font = '72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🙅‍♂️', w / 4, h / 4 + 20);

      // Bottom Emoji Approval
      ctx.fillText('👉😎', w / 4, (3 * h) / 4 + 20);
    },
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons Dilemma',
    defaultTop: 'WHEN YOU NEED TO COMPRESS AN IMAGE',
    defaultBottom: 'TARGET 100 KB  vs  QUALITY 80%',
    drawTemplate: (ctx, w, h) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, w, h);

      // Control panel desk
      ctx.fillStyle = '#334155';
      ctx.fillRect(50, 100, w - 100, h - 200);

      // Red button 1
      ctx.beginPath();
      ctx.ellipse(w / 3, h / 2, 60, 40, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#991b1b';
      ctx.stroke();

      // Red button 2
      ctx.beginPath();
      ctx.ellipse((2 * w) / 3, h / 2, 60, 40, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.stroke();

      // Sweating emoji
      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('😰💦', w / 2, h / 4);
    },
  },
  {
    id: 'success-kid',
    name: 'Success Kid',
    defaultTop: 'REDUCED FILE FROM 15 MB TO 200 KB',
    defaultBottom: 'STILL LOOKS CRISP AND SHARP',
    drawTemplate: (ctx, w, h) => {
      // Sunburst background
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.5);
      grad.addColorStop(0, '#67e8f9');
      grad.addColorStop(0.5, '#0284c7');
      grad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.font = '96px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✊👶', w / 2, h / 2 + 30);
    },
  },
  {
    id: 'distracted',
    name: 'Distracted Boyfriend',
    defaultTop: 'SLOW DESKTOP PHOTO EDITORS',
    defaultBottom: 'FAST IN-BROWSER DESIGNKIT',
    drawTemplate: (ctx, w, h) => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      ctx.font = '80px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💁‍♀️  🚶‍♂️👀   💃', w / 2, h / 2);
    },
  },
];

export const MemeGeneratorTool: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate>(TEMPLATES[0]);
  const [customImage, setCustomImage] = useState<HTMLImageElement | null>(null);

  const [topText, setTopText] = useState<string>(TEMPLATES[0].defaultTop);
  const [bottomText, setBottomText] = useState<string>(TEMPLATES[0].defaultBottom);
  const [fontSize, setFontSize] = useState<number>(42);
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [allCaps, setAllCaps] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 700;
    const h = 700;
    canvas.width = w;
    canvas.height = h;

    // Draw background: custom image or template
    if (customImage) {
      ctx.drawImage(customImage, 0, 0, w, h);
    } else {
      selectedTemplate.drawTemplate(ctx, w, h);
    }

    // Draw Top & Bottom Meme Text (Impact style font with black stroke)
    const renderCaption = (txt: string, yPos: number, isTop: boolean) => {
      if (!txt) return;
      const formatted = allCaps ? txt.toUpperCase() : txt;
      ctx.font = `900 ${fontSize}px Impact, -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = isTop ? 'top' : 'bottom';

      // Thick black stroke
      ctx.lineWidth = Math.max(3, fontSize / 7);
      ctx.strokeStyle = '#000000';
      ctx.lineJoin = 'round';
      ctx.strokeText(formatted, w / 2, yPos);

      // White fill
      ctx.fillStyle = textColor;
      ctx.fillText(formatted, w / 2, yPos);
    };

    renderCaption(topText, 25, true);
    renderCaption(bottomText, h - 25, false);
  };

  useEffect(() => {
    renderMeme();
  }, [selectedTemplate, customImage, topText, bottomText, fontSize, textColor, allCaps]);

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const img = await loadImage(e.target.files[0]);
      setCustomImage(img);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, 'designkit-meme.png');
    }, 'image/png');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Smile className="w-4 h-4" />
          <span>Humor & Viral Content</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Meme Generator
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Create classic memes with punchy top and bottom captions, heavy stroke typography, popular starter templates, or upload your own photo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Templates */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Starter Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setCustomImage(null);
                    setTopText(tmpl.defaultTop);
                    setBottomText(tmpl.defaultBottom);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    selectedTemplate.id === tmpl.id && !customImage
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {tmpl.name}
                </button>
              ))}
            </div>

            {/* Custom upload option */}
            <div className="mt-3">
              <label className="block text-xs text-slate-500 mb-1">Or upload personal base photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomUpload}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Captions */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Top Caption Text
              </label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP CAPTION"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bottom Caption Text
              </label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM CAPTION"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Text Size ({fontSize}px)</label>
                <input
                  type="range"
                  min="20"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1">Text Color</label>
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
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={allCaps}
                onChange={(e) => setAllCaps(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span>Force ALL CAPS (Standard Meme Format)</span>
            </label>
          </div>
        </div>

        {/* Meme Preview */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Live Meme Preview</h3>

            <div className="relative w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-3">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Meme Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
