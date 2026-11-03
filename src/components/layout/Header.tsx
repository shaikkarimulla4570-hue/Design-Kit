import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { ToolId } from '../../types';
import { TOOLS_LIST } from '../../utils/toolsCatalog';
import { useI18n } from '../../i18n/I18nContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  currentTool: ToolId | null;
  onSelectTool: (id: ToolId) => void;
  onGoHome: () => void;
  onGoAllTools: () => void;
  onGoAbout: () => void;
  onGoTemplates: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  activeNavTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTool,
  onSelectTool,
  onGoHome,
  onGoAllTools,
  onGoAbout,
  onGoTemplates,
  onToggleSidebar,
  sidebarOpen,
  activeNavTab,
}) => {
  const { t, tToolTitle, tToolDesc } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredTools = searchQuery.trim()
    ? TOOLS_LIST.filter((tool) => {
        const q = searchQuery.toLowerCase();
        const localizedTitle = tToolTitle(tool.id).toLowerCase();
        const localizedDesc = tToolDesc(tool.id).toLowerCase();
        return (
          localizedTitle.includes(q) ||
          localizedDesc.includes(q) ||
          tool.title.toLowerCase().includes(q) ||
          tool.shortDesc.toLowerCase().includes(q)
        );
      })
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (id: ToolId) => {
    onSelectTool(id);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Start: Mobile Toggle & Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label={t('nav.menu')}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2.5 group text-start focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <span className="font-extrabold tracking-tighter">D</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Design<span className="text-blue-600">Kit</span>
            </span>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onGoHome}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap ${
              activeNavTab === 'home' && !currentTool ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {t('nav.home')}
          </button>
          <button
            type="button"
            onClick={onGoAllTools}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap ${
              activeNavTab === 'all-tools' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {t('nav.imageTools')}
          </button>
          <button
            type="button"
            onClick={onGoTemplates}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap ${
              activeNavTab === 'templates' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {t('nav.templates')}
          </button>
          <button
            type="button"
            onClick={() => onSelectTool('compress-image')}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap ${
              currentTool === 'compress-image' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {t('nav.tools')}
          </button>
          <button
            type="button"
            onClick={onGoAbout}
            className={`transition-colors hover:text-blue-600 whitespace-nowrap ${
              activeNavTab === 'about' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            {t('nav.about')}
          </button>
        </nav>

        {/* End: Search Bar, Language Selector, Theme & CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-1 max-w-xl justify-end">
          {/* Search Box */}
          <div ref={searchContainerRef} className="relative hidden md:block w-full max-w-[230px] lg:max-w-[260px]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-full ps-9 pe-10 py-1.5 bg-slate-100 hover:bg-slate-150 focus:bg-white text-slate-800 text-sm rounded-xl border border-transparent focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                className="absolute end-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm shadow-blue-500/20"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Dropdown Results */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full inset-x-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 max-h-80 overflow-y-auto">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleSelectSearchResult(tool.id)}
                      className="w-full px-4 py-2.5 text-start hover:bg-blue-50/70 flex items-center justify-between group transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 group-hover:text-blue-600 truncate">
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
                  <div className="px-4 py-3 text-xs text-slate-500 text-center">
                    {t('nav.noToolsFound', { query: searchQuery })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Global 123-Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            title="Toggle theme appearance"
            aria-label="Toggle theme appearance"
          >
            {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Quick CTA */}
          <button
            type="button"
            onClick={() => onSelectTool('compress-image')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-all whitespace-nowrap shrink-0"
          >
            {tToolTitle('compress-image')}
          </button>
        </div>
      </div>
    </header>
  );
};
