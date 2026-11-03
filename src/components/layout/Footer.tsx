import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { ToolId } from '../../types';
import { CATEGORIES_LIST } from '../../utils/toolsCatalog';
import { useI18n } from '../../i18n/I18nContext';

interface FooterProps {
  onSelectTool: (id: ToolId) => void;
  onGoHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool, onGoHome }) => {
  const { t, tCategoryTitle, tToolTitle } = useI18n();

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 mt-16 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Trust row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-200/60 mb-10">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{t('footer.privateTitle')}</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {t('footer.privateDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{t('footer.fastTitle')}</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {t('footer.fastDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{t('footer.freeTitle')}</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {t('footer.freeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Categories columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                D
              </div>
              <span className="font-bold text-base text-slate-900">DesignKit</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              {t('footer.brandDesc')}
            </p>
            <div className="text-xs text-slate-400">
              Static host ready · HTML5 Canvas Engine
            </div>
          </div>

          {CATEGORIES_LIST.slice(0, 4).map((cat) => (
            <div key={cat.id}>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {tCategoryTitle(cat.id)}
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {cat.tools.map((tool) => (
                  <li key={tool.id}>
                    <button
                      type="button"
                      onClick={() => onSelectTool(tool.id)}
                      className="hover:text-blue-600 text-start transition-colors"
                    >
                      {tToolTitle(tool.id)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} DesignKit. {t('nav.rightsReserved')}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button type="button" onClick={onGoHome} className="hover:text-slate-900 transition-colors">
              {t('nav.privacyPromise')}
            </button>
            <span>·</span>
            <button type="button" onClick={onGoHome} className="hover:text-slate-900 transition-colors">
              {t('nav.termsOfUse')}
            </button>
            <span>·</span>
            <button type="button" onClick={onGoHome} className="hover:text-slate-900 transition-colors">
              {t('nav.localEngine')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
