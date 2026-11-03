import React from 'react';
import { Sparkles, Smile, Camera, LayoutGrid, Star, ArrowRight } from 'lucide-react';
import { ToolId } from '../types';
import { useI18n } from '../i18n/I18nContext';

interface TemplatesPageProps {
  onSelectTool: (id: ToolId) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ onSelectTool }) => {
  const { t, tToolTitle, tToolDesc } = useI18n();

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{t('templates.kicker')}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {t('templates.title')}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          {t('templates.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Memes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Smile className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {tToolTitle('meme-generator')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {tToolDesc('meme-generator')}
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
              <span className="bg-slate-100 px-2 py-1 rounded-md">Drake Meme</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">Two Buttons</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">Success Kid</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">Distracted Guy</span>
            </div>
          </div>
          <div className="pt-6 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onSelectTool('meme-generator')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>{tToolTitle('meme-generator')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </button>
          </div>
        </div>

        {/* Card 2: Passport Standards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {tToolTitle('passport-photo')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {tToolDesc('passport-photo')}
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
              <span className="bg-slate-100 px-2 py-1 rounded-md">US 2×2 in</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">UK / EU 35×45 mm</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">India 35×45 mm</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">4×6" Print Sheet</span>
            </div>
          </div>
          <div className="pt-6 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onSelectTool('passport-photo')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>{tToolTitle('passport-photo')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </button>
          </div>
        </div>

        {/* Card 3: App Icons */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {tToolTitle('app-icon-maker')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {tToolDesc('app-icon-maker')}
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
              <span className="bg-slate-100 px-2 py-1 rounded-md">iOS 1024px App Store</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">Android 512px Play Store</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">iPhone @2x/@3x</span>
            </div>
          </div>
          <div className="pt-6 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onSelectTool('app-icon-maker')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>{tToolTitle('app-icon-maker')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </button>
          </div>
        </div>

        {/* Card 4: Favicon Generator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {tToolTitle('image-to-favicon')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {tToolDesc('image-to-favicon')}
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
              <span className="bg-slate-100 px-2 py-1 rounded-md">Squircle & Rounded</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">ICO + Apple Touch</span>
              <span className="bg-slate-100 px-2 py-1 rounded-md">HTML Head Code</span>
            </div>
          </div>
          <div className="pt-6 mt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onSelectTool('image-to-favicon')}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>{tToolTitle('image-to-favicon')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
