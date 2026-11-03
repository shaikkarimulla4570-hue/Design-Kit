import React from 'react';
import { ShieldCheck, ServerOff, Globe, Cpu } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const AboutPage: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-16">
      <div className="border-b border-slate-200/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{t('about.kicker')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          {t('about.title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
          {t('about.subtitle')}
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ServerOff className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{t('footer.privateTitle')}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('footer.privateDesc')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{t('footer.fastTitle')}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('footer.fastDesc')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">{t('footer.freeTitle')}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t('footer.freeDesc')}
          </p>
        </div>
      </div>

      {/* Technical FAQ */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900">{t('about.faqTitle')}</h2>

        <div className="space-y-4 divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="pt-4 first:pt-0 space-y-1.5">
            <h4 className="font-bold text-slate-900">How does DesignKit reach exact file sizes (e.g. 100 KB)?</h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              Our Image Compressor utilizes a bounded binary search algorithm. It decodes the source image onto an in-memory canvas, evaluates the lossy byte stream across quality factors, and progressively resizes if quality adjustment alone cannot reach small targets.
            </p>
          </div>

          <div className="pt-4 space-y-1.5">
            <h4 className="font-bold text-slate-900">Is there any file upload limit?</h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              Because files are processed directly in your browser&apos;s RAM, there is no remote server upload cap. You can process images up to 50MB and batch process multiple files safely.
            </p>
          </div>

          <div className="pt-4 space-y-1.5">
            <h4 className="font-bold text-slate-900">What image formats are supported?</h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              All browser-readable bitmap formats including JPEG, PNG, WebP, SVG, GIF (first frame), and BMP. We avoid formats requiring heavyweight server software to maintain 100% client-side privacy.
            </p>
          </div>

          <div className="pt-4 space-y-1.5">
            <h4 className="font-bold text-slate-900">Can I deploy this to Hostinger static hosting?</h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              Yes! Running <code>npm run build</code> produces static HTML, CSS, and JS bundles in the <code>dist/</code> folder. You can upload those files directly to Hostinger&apos;s File Manager (public_html) with no Node.js or backend required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
