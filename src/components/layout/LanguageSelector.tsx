import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Search, Check, ChevronDown, X } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale, currentLanguage, languages, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.region.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [languages, query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 30);
      return () => window.clearTimeout(timer);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('nav.selectLanguage')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap ${
          isOpen
            ? 'bg-blue-50 border-blue-400 text-blue-700'
            : 'bg-slate-100/90 hover:bg-slate-200/70 border-slate-200/80 text-slate-700 hover:text-slate-900'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="max-w-[100px] sm:max-w-[125px] truncate">
          {currentLanguage.nativeName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('nav.selectLanguage')}
          className="absolute top-full end-0 mt-2 w-80 max-w-[92vw] bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden"
        >
          {/* Top Search Header */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>{t('nav.selectLanguage')}</span>
              <span className="tabular-nums text-blue-600 font-bold">
                {languages.length} Languages
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('nav.searchLanguage')}
                className="w-full ps-8 pe-8 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute end-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Alphabetical Scrollable List */}
          <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-slate-50">
            {filteredLanguages.length === 0 ? (
              <div className="py-8 px-4 text-center text-xs text-slate-500">
                {t('nav.noLanguageFound')}
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === locale;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setLocale(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-start transition-colors ${
                      isSelected
                        ? 'bg-blue-50/90 text-blue-700'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          dir={lang.dir}
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isSelected ? 'text-blue-700' : 'text-slate-900'
                          }`}
                        >
                          {lang.nativeName}
                        </span>
                        {lang.dir === 'rtl' && (
                          <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/70 shrink-0">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {lang.name} · <span className="text-slate-400">{lang.region}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {lang.code}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
