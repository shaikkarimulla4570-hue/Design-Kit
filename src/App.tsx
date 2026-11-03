import React, { useState } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { ToolId } from './types';
import { TOOLS_LIST } from './utils/toolsCatalog';
import { useI18n } from './i18n/I18nContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { AboutPage } from './pages/AboutPage';

// Tools
import { CompressImageTool } from './tools/compress-image/CompressImageTool';
import { ResizeImageTool } from './tools/resize-image/ResizeImageTool';
import { CropImageTool } from './tools/crop-image/CropImageTool';
import { PassportPhotoTool } from './tools/passport-photo/PassportPhotoTool';
import { ConvertToJpgTool } from './tools/convert-to-jpg/ConvertToJpgTool';
import { ConvertFromJpgTool } from './tools/convert-from-jpg/ConvertFromJpgTool';
import { FormatConverterTool } from './tools/format-converter/FormatConverterTool';
import { RotateImageTool } from './tools/rotate-image/RotateImageTool';
import { PhotoEditorTool } from './tools/photo-editor/PhotoEditorTool';
import { MemeGeneratorTool } from './tools/meme-generator/MemeGeneratorTool';
import { WatermarkTool } from './tools/watermark-image/WatermarkTool';
import { ImageToPdfTool } from './tools/image-to-pdf/ImageToPdfTool';
import { PdfToImagesTool } from './tools/pdf-to-images/PdfToImagesTool';
import { FaviconGeneratorTool } from './tools/favicon-generator/FaviconGeneratorTool';
import { AppIconGeneratorTool } from './tools/app-icon-generator/AppIconGeneratorTool';
import { RemoveBgTool } from './tools/remove-bg/RemoveBgTool';

export default function App() {
  const { t, tCategoryTitle, tToolTitle } = useI18n();
  const [currentTool, setCurrentTool] = useState<ToolId | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'all-tools' | 'templates' | 'about'>('home');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleSelectTool = (id: ToolId) => {
    setCurrentTool(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setCurrentTool(null);
    setActiveNavTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoAllTools = () => {
    setCurrentTool(null);
    setActiveNavTab('all-tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoTemplates = () => {
    setCurrentTool(null);
    setActiveNavTab('templates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoAbout = () => {
    setCurrentTool(null);
    setActiveNavTab('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeToolMeta = currentTool ? TOOLS_LIST.find((item) => item.id === currentTool) : null;

  const renderToolComponent = () => {
    switch (currentTool) {
      case 'compress-image':
        return <CompressImageTool />;
      case 'resize-image':
        return <ResizeImageTool />;
      case 'crop-image':
        return <CropImageTool />;
      case 'passport-photo':
        return <PassportPhotoTool />;
      case 'convert-to-jpg':
        return <ConvertToJpgTool />;
      case 'convert-from-jpg':
        return <ConvertFromJpgTool />;
      case 'format-converter':
        return <FormatConverterTool />;
      case 'rotate-image':
        return <RotateImageTool />;
      case 'photo-editor':
        return <PhotoEditorTool />;
      case 'meme-generator':
        return <MemeGeneratorTool />;
      case 'watermark-image':
        return <WatermarkTool />;
      case 'image-to-pdf':
        return <ImageToPdfTool />;
      case 'pdf-to-images':
        return <PdfToImagesTool />;
      case 'image-to-favicon':
        return <FaviconGeneratorTool initialTab="image" />;
      case 'text-to-favicon':
        return <FaviconGeneratorTool initialTab="text" />;
      case 'app-icon-maker':
        return <AppIconGeneratorTool />;
      case 'remove-bg':
        return <RemoveBgTool />;
      default:
        return null;
    }
  };

  const renderContent = () => {
    if (currentTool) {
      return (
        <div className="space-y-4">
          {/* Localized Breadcrumb Navigation */}
          {activeToolMeta && (
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 max-w-6xl mx-auto"
            >
              <button
                type="button"
                onClick={handleGoHome}
                className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors font-medium"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{t('nav.home')}</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 rtl:rotate-180 shrink-0" />
              <button
                type="button"
                onClick={handleGoAllTools}
                className="hover:text-blue-600 transition-colors font-medium"
              >
                {tCategoryTitle(activeToolMeta.category)}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 rtl:rotate-180 shrink-0" />
              <span className="font-semibold text-slate-800">
                {tToolTitle(activeToolMeta.id)}
              </span>
            </nav>
          )}
          <div className="pt-1">{renderToolComponent()}</div>
        </div>
      );
    }

    switch (activeNavTab) {
      case 'all-tools':
        return <AllToolsPage onSelectTool={handleSelectTool} />;
      case 'templates':
        return <TemplatesPage onSelectTool={handleSelectTool} />;
      case 'about':
        return <AboutPage />;
      case 'home':
      default:
        return <HomePage onSelectTool={handleSelectTool} onGoAllTools={handleGoAllTools} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Sticky Header */}
      <Header
        currentTool={currentTool}
        onSelectTool={handleSelectTool}
        onGoHome={handleGoHome}
        onGoAllTools={handleGoAllTools}
        onGoAbout={handleGoAbout}
        onGoTemplates={handleGoTemplates}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        activeNavTab={activeNavTab}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Accordion Sidebar */}
        <Sidebar
          currentTool={currentTool}
          onSelectTool={handleSelectTool}
          onGoHome={handleGoHome}
          onGoAllTools={handleGoAllTools}
          isOpenMobile={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <Footer onSelectTool={handleSelectTool} onGoHome={handleGoHome} />
    </div>
  );
}
