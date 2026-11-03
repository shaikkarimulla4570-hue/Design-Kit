import React, { useState } from 'react';
import {
  Home,
  LayoutGrid,
  Maximize2,
  Database,
  ArrowLeftRight,
  Wand2,
  Droplet,
  FileText,
  Star,
  ChevronDown,
  Shield,
  Layers,
} from 'lucide-react';
import { ToolId, CategoryId } from '../../types';
import { CATEGORIES_LIST } from '../../utils/toolsCatalog';
import { useI18n } from '../../i18n/I18nContext';

interface SidebarProps {
  currentTool: ToolId | null;
  onSelectTool: (id: ToolId) => void;
  onGoHome: () => void;
  onGoAllTools: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTool,
  onSelectTool,
  onGoHome,
  onGoAllTools,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { t, tCategoryTitle, tToolTitle } = useI18n();

  const [expandedCategories, setExpandedCategories] = useState<Record<CategoryId, boolean>>({
    'resize-dimensions': true,
    'compress-image': true,
    'convert-format': true,
    'edit-image': true,
    'watermark-overlay': false,
    'image-pdf': true,
    'favicon-generator': true,
    'app-icon-generator': false,
  });

  const toggleCategory = (catId: CategoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const getCategoryIcon = (id: CategoryId) => {
    const iconClass = 'w-4 h-4 shrink-0';
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
        return <Layers className={iconClass} />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-y-auto py-4 px-3 text-sm">
      {/* Top Nav Items */}
      <div className="space-y-1 mb-4">
        <button
          type="button"
          onClick={() => {
            onGoHome();
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-start ${
            currentTool === null
              ? 'bg-blue-50 text-blue-600 font-semibold shadow-xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Home className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">{t('nav.home')}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onGoAllTools();
            onCloseMobile();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors text-start"
        >
          <LayoutGrid className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="truncate">{t('nav.allTools')}</span>
        </button>
      </div>

      <div className="h-px bg-slate-200/80 mb-3 mx-1" />

      {/* Accordion Categories */}
      <div className="space-y-1.5 flex-1">
        {CATEGORIES_LIST.map((category) => {
          const isExpanded = expandedCategories[category.id];
          const hasActiveChild = category.tools.some((tool) => tool.id === currentTool);
          const categoryLabel = tCategoryTitle(category.id);

          return (
            <div key={category.id} className="rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-start rounded-xl font-medium transition-colors group ${
                  hasActiveChild
                    ? 'bg-slate-100/90 text-slate-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(category.id)}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-tight truncate">
                    {categoryLabel}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ms-1 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Sub-tools */}
              {isExpanded && (
                <div className="mt-1 ms-4 ps-3 border-s-2 border-slate-100 space-y-0.5 pb-1">
                  {category.tools.map((tool) => {
                    const isSelected = currentTool === tool.id;
                    const toolLabel = tToolTitle(tool.id);
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => {
                          onSelectTool(tool.id);
                          onCloseMobile();
                        }}
                        className={`w-full text-start px-2.5 py-1.5 rounded-lg text-xs sm:text-sm transition-colors block truncate ${
                          isSelected
                            ? 'bg-blue-600 text-white font-medium shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        title={toolLabel}
                      >
                        {toolLabel}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Privacy Box at Bottom */}
      <div className="mt-6 p-3 bg-gradient-to-br from-blue-50/60 to-slate-100 rounded-xl border border-blue-100/70 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-semibold text-blue-700 mb-1">
          <Shield className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{t('nav.localEngine')}</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {t('nav.localEngineDesc')}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (border-e adapts automatically in RTL) */}
      <aside className="hidden lg:block w-64 shrink-0 border-e border-slate-200/80 bg-white sticky top-16 h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-in Drawer (inset-y-0 start-0 adapts to right side in RTL) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 start-0 w-72 max-w-[85vw] bg-white shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  D
                </div>
                <span className="font-bold text-slate-900 truncate">{t('nav.menu')}</span>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
