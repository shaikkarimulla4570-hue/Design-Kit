import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  Maximize2,
  Database,
  ArrowLeftRight,
  Wand2,
  Droplet,
  FileText,
  Star,
  LayoutGrid,
  ChevronRight,
  RotateCw,
  Crop,
} from 'lucide-react';
import { ToolId, CategoryId } from '../types';
import { CATEGORIES_LIST, TOOLS_LIST } from '../utils/toolsCatalog';
import { useI18n } from '../i18n/I18nContext';

interface HomePageProps {
  onSelectTool: (id: ToolId) => void;
  onGoAllTools: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTool, onGoAllTools }) => {
  const { t, tCategoryTitle, tToolTitle, tToolDesc } = useI18n();
  const [heroSearch, setHeroSearch] = useState('');

  const filteredTools = heroSearch.trim()
    ? TOOLS_LIST.filter((tool) => {
        const q = heroSearch.toLowerCase();
        return (
          tToolTitle(tool.id).toLowerCase().includes(q) ||
          tToolDesc(tool.id).toLowerCase().includes(q) ||
          tool.title.toLowerCase().includes(q) ||
          tool.shortDesc.toLowerCase().includes(q)
        );
      })
    : [];

  const popularTools = TOOLS_LIST.filter((tool) => tool.popular);

  const getToolIcon = (id: ToolId) => {
    const iconClass = 'w-6 h-6';
    switch (id) {
      case 'compress-image':
        return <Database className={`${iconClass} text-emerald-500`} />;
      case 'resize-image':
        return <Maximize2 className={`${iconClass} text-blue-500`} />;
      case 'crop-image':
        return <Crop className={`${iconClass} text-indigo-500`} />;
      case 'convert-to-jpg':
      case 'convert-from-jpg':
      case 'format-converter':
        return <ArrowLeftRight className={`${iconClass} text-amber-500`} />;
      case 'photo-editor':
        return <Wand2 className={`${iconClass} text-pink-500`} />;
      case 'rotate-image':
        return <RotateCw className={`${iconClass} text-sky-500`} />;
      case 'watermark-image':
        return <Droplet className={`${iconClass} text-rose-500`} />;
      case 'remove-bg':
        return <Wand2 className={`${iconClass} text-blue-600`} />;
      default:
        return <Sparkles className={`${iconClass} text-slate-500`} />;
    }
  };

  const getCategoryIcon = (id: CategoryId) => {
    const iconClass = 'w-5 h-5';
    switch (id) {
      case 'resize-dimensions':
        return <Maximize2 className={`${iconClass} text-blue-500`} />;
      case 'compress-image':
        return <Database className={`${iconClass} text-emerald-500`} />;
      case 'convert-format':
        return <ArrowLeftRight className={`${iconClass} text-indigo-500`} />;
      case 'edit-image':
        return <Wand2 className={`${iconClass} text-amber-500`} />;
      case 'watermark-overlay':
        return <Droplet className={`${iconClass} text-rose-500`} />;
      case 'image-pdf':
        return <FileText className={`${iconClass} text-pink-500`} />;
      case 'favicon-generator':
        return <Star className={`${iconClass} text-amber-400`} />;
      case 'app-icon-generator':
        return <LayoutGrid className={`${iconClass} text-sky-500`} />;
      default:
        return <Sparkles className={`${iconClass} text-slate-400`} />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-white border border-blue-100/80 p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Start Column: Copy & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100/80 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {t('hero.titlePrefix')}{' '}
              <span className="text-blue-600">{t('hero.titleAccent')}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Prominent Search bar */}
            <div className="relative max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full ps-11 pe-4 py-3.5 bg-white text-slate-800 text-sm rounded-2xl border border-slate-200/90 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400"
                />
                <Search className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Instant Search Results Dropdown */}
              {heroSearch.trim().length > 0 && (
                <div className="absolute top-full inset-x-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-30 max-h-64 overflow-y-auto">
                  {filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => onSelectTool(tool.id)}
                        className="w-full px-4 py-2.5 text-start hover:bg-blue-50/70 flex items-center justify-between group transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                            {tToolTitle(tool.id)}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1">
                            {tToolDesc(tool.id)}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 ms-2 rtl:rotate-180" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-slate-500 text-center">
                      {t('nav.noToolsFound', { query: heroSearch })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onSelectTool('compress-image')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 group whitespace-nowrap"
              >
                <span>{t('hero.startDesigning')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:rotate-180 transition-transform shrink-0" />
              </button>

              <button
                type="button"
                onClick={onGoAllTools}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 transition-colors shadow-xs whitespace-nowrap"
              >
                {t('hero.exploreTools')}
              </button>
            </div>

            {/* 4 Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/60">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('hero.free')}</div>
                  <div className="text-[11px] text-slate-500">{t('hero.freeSub')}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('hero.browser')}</div>
                  <div className="text-[11px] text-slate-500">{t('hero.browserSub')}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('hero.secure')}</div>
                  <div className="text-[11px] text-slate-500">{t('hero.secureSub')}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('hero.quality')}</div>
                  <div className="text-[11px] text-slate-500">{t('hero.qualitySub')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* End Column: Hero Graphic Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 overflow-hidden">
              {/* Window controls bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                  <Maximize2 className="w-3 h-3 text-blue-600" />
                  <span>DesignKit Canvas</span>
                </div>
              </div>

              {/* Central sample landscape */}
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-gradient-to-tr from-sky-600 to-indigo-800 flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 bg-radial from-sky-600 via-sky-800 to-slate-900 opacity-95" />

                {/* Floating tool crop handles */}
                <div className="absolute inset-4 border-2 border-dashed border-white/80 rounded-lg pointer-events-none flex items-center justify-center">
                  <div className="absolute -top-1.5 -start-1.5 w-3 h-3 bg-white rounded-sm shadow-sm" />
                  <div className="absolute -top-1.5 -end-1.5 w-3 h-3 bg-white rounded-sm shadow-sm" />
                  <div className="absolute -bottom-1.5 -start-1.5 w-3 h-3 bg-white rounded-sm shadow-sm" />
                  <div className="absolute -bottom-1.5 -end-1.5 w-3 h-3 bg-white rounded-sm shadow-sm" />
                </div>

                <div className="relative text-center text-white p-4">
                  <span className="inline-block px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-md text-xs font-semibold mb-1">
                    {tToolTitle('photo-editor')}
                  </span>
                  <div className="text-[11px] text-white/80 font-mono tabular-nums" dir="ltr">
                    1920 × 1080 px · 1.4 MB
                  </div>
                </div>
              </div>

              {/* Controls preview bar */}
              <div className="mt-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>{tToolTitle('resize-image')}</span>
                  <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-600 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>{tToolTitle('compress-image')}</span>
                  <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-600 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>{tToolTitle('image-to-favicon')}</span>
                  <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-blue-600 rounded-full" />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-pink-500 inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTool('photo-editor')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                  >
                    <span>{tToolTitle('photo-editor')}</span>
                    <ArrowRight className="w-3 h-3 rtl:rotate-180 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Image Tools */}
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('home.popularTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t('home.popularSub')}
            </p>
          </div>
          <button
            type="button"
            onClick={onGoAllTools}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap shrink-0"
          >
            <span>{t('home.viewAllTools')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:rotate-180 transition-transform shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => onSelectTool(tool.id)}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all text-start flex flex-col justify-between group h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center mb-4 transition-colors">
                  {getToolIcon(tool.id)}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                  {tToolTitle(tool.id)}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {tToolDesc(tool.id)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>{t('home.useTool')}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:rotate-180 transition-transform shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Image Tools Categories */}
      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('home.categoriesTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t('home.categoriesSub')}
            </p>
          </div>
          <button
            type="button"
            onClick={onGoAllTools}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group whitespace-nowrap shrink-0"
          >
            <span>{t('home.viewAllCategories')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:rotate-180 transition-transform shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES_LIST.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                if (category.tools.length > 0) {
                  onSelectTool(category.tools[0].id);
                }
              }}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all text-start flex flex-col justify-between group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors shrink-0">
                  {getCategoryIcon(category.id)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {tCategoryTitle(category.id)}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium tabular-nums">
                    {category.tools.length}{' '}
                    {category.tools.length === 1 ? t('home.toolSingular') : t('home.toolPlural')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600 pt-2 border-t border-slate-100">
                <span>{t('home.exploreSuite')}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:rotate-180 transition-transform shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Bottom Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-blue-50/30 border border-blue-100/80 p-8 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('home.bannerTitle')}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              {t('home.bannerSub')}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onGoAllTools}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2 group whitespace-nowrap"
              >
                <span>{t('hero.exploreTools')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:rotate-180 transition-transform shrink-0" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-2.5">
            {[
              t('home.featNoSignup'),
              t('home.featFast'),
              t('home.featQuality'),
              t('home.featDevices'),
              t('home.featFree'),
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
