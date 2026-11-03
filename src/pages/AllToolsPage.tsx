import React, { useState } from 'react';
import { LayoutGrid, Search, ChevronRight } from 'lucide-react';
import { ToolId } from '../types';
import { CATEGORIES_LIST, TOOLS_LIST } from '../utils/toolsCatalog';
import { useI18n } from '../i18n/I18nContext';

interface AllToolsPageProps {
  onSelectTool: (id: ToolId) => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({ onSelectTool }) => {
  const { t, tCategoryTitle, tToolTitle, tToolDesc } = useI18n();
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredCategories = CATEGORIES_LIST.filter((cat) => {
    if (filter !== 'all' && cat.id !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <LayoutGrid className="w-4 h-4 shrink-0" />
          <span>{t('allTools.kicker')}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {t('nav.allTools')}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          {t('allTools.subtitle')}
        </p>

        {/* Filter Bar & Search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap tabular-nums ${
                filter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {t('nav.allTools')} ({TOOLS_LIST.length})
            </button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 whitespace-nowrap ${
                  filter === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tCategoryTitle(cat.id)}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('allTools.filterKeyword')}
              className="w-full ps-9 pe-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Categories & Tool Cards */}
      <div className="space-y-10">
        {filteredCategories.map((cat) => {
          const matchingTools = cat.tools.filter((tool) => {
            const q = search.toLowerCase();
            return (
              tToolTitle(tool.id).toLowerCase().includes(q) ||
              tToolDesc(tool.id).toLowerCase().includes(q) ||
              tool.title.toLowerCase().includes(q) ||
              tool.shortDesc.toLowerCase().includes(q)
            );
          });

          if (matchingTools.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {tCategoryTitle(cat.id)}
                </h2>
                <span className="text-xs text-slate-400 font-medium tabular-nums">
                  ({matchingTools.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => onSelectTool(tool.id)}
                    className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-start flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {tToolTitle(tool.id)}
                        </h3>
                        {tool.popular && (
                          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md shrink-0">
                            {t('allTools.popularBadge')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {tToolDesc(tool.id)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                      <span>{t('allTools.launchTool')}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:rotate-180 transition-transform shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
