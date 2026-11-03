import React, { useState } from 'react';
import { LayoutGrid, Download, FileArchive, Sparkles, Smartphone, ShieldAlert } from 'lucide-react';
import JSZip from 'jszip';
import { Dropzone } from '../../components/common/Dropzone';
import { loadImage, downloadBlob, formatBytes } from '../../utils/imageProcessors';

interface IconSizeConfig {
  platform: 'ios' | 'android';
  name: string;
  size: number;
}

const APP_ICON_SIZES: IconSizeConfig[] = [
  // iOS
  { platform: 'ios', name: 'AppIcon-20x20@2x.png', size: 40 },
  { platform: 'ios', name: 'AppIcon-20x20@3x.png', size: 60 },
  { platform: 'ios', name: 'AppIcon-29x29@2x.png', size: 58 },
  { platform: 'ios', name: 'AppIcon-29x29@3x.png', size: 87 },
  { platform: 'ios', name: 'AppIcon-40x40@2x.png', size: 80 },
  { platform: 'ios', name: 'AppIcon-60x60@2x.png', size: 120 },
  { platform: 'ios', name: 'AppIcon-60x60@3x.png', size: 180 },
  { platform: 'ios', name: 'AppIcon-1024x1024.png', size: 1024 },

  // Android
  { platform: 'android', name: 'ic_launcher-mdpi.png', size: 48 },
  { platform: 'android', name: 'ic_launcher-hdpi.png', size: 72 },
  { platform: 'android', name: 'ic_launcher-xhdpi.png', size: 96 },
  { platform: 'android', name: 'ic_launcher-xxhdpi.png', size: 144 },
  { platform: 'android', name: 'ic_launcher-xxxhdpi.png', size: 192 },
  { platform: 'android', name: 'playstore-icon-512.png', size: 512 },
];

export const AppIconGeneratorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPackaging, setIsPackaging] = useState<boolean>(false);

  const handleFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleExportZip = async () => {
    if (!file) return;
    setIsPackaging(true);

    try {
      const img = await loadImage(file);
      const zip = new JSZip();
      const iosFolder = zip.folder('ios');
      const androidFolder = zip.folder('android');

      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - minDim) / 2;
      const sy = (img.naturalHeight - minDim) / 2;

      for (const item of APP_ICON_SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = item.size;
        canvas.height = item.size;
        const ctx = canvas.getContext('2d')!;

        // Fill white background for iOS app store requirements
        if (item.platform === 'ios') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, item.size, item.size);
        }

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, item.size, item.size);

        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));

        if (item.platform === 'ios') {
          iosFolder?.file(item.name, blob);
        } else {
          androidFolder?.file(item.name, blob);
        }
      }

      // Readme note
      zip.file(
        'README.txt',
        'DesignKit App Icon Assets\n\n- Copy files inside ios/ into your Xcode AppIcon asset catalog.\n- Copy files inside android/ into your Android res/mipmap folders.\n\nNote: These graphic PNG assets do not constitute a compiled mobile app package.'
      );

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, 'designkit-app-icons.zip');
    } catch (e) {
      console.error(e);
    } finally {
      setIsPackaging(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          <Smartphone className="w-4 h-4" />
          <span>Mobile App Store Assets</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          App Icon Maker
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Generate production-ready icon asset packages for iOS (iPhone, iPad, App Store) and Android (mipmap mdpi through xxxhdpi and Google Play).
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-600">
        <ShieldAlert className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
        <p>
          <strong>Notice:</strong> This tool produces standard image dimensions for Xcode Asset Catalogs and Android Res folders. These graphical assets must be bundled into your native mobile codebase.
        </p>
      </div>

      {!file ? (
        <Dropzone
          onFilesSelected={handleFiles}
          multiple={false}
          title="Drop square master logo (1024×1024 recommended)"
          subtitle="Generates all 14 standard iOS and Android asset catalog resolutions in a single ZIP package."
          sampleType="icon"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Master Icon Source
              </span>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img src={previewUrl} alt="Source" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="text-xs font-bold text-slate-800 truncate">{file.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{formatBytes(file.size)}</div>
                </div>
              </div>
            </div>

            {/* Platform checklist */}
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-800 block">Export Formats Included:</span>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1 text-slate-700">
                <div className="font-semibold text-blue-900">Apple iOS Bundle:</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  20×20, 29×29, 40×40, 60×60 (@2x/@3x), and 1024×1024 App Store master.
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1 text-slate-700">
                <div className="font-semibold text-emerald-900">Google Android Bundle:</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  MDPI (48px), HDPI (72px), XHDPI (96px), XXHDPI (144px), XXXHDPI (192px), and 512px Play Store.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Change Master Image
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">App Icon Mockup Preview</h3>

              <div className="relative w-full h-[320px] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-6 gap-6">
                {/* iOS rounded square mockup */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 rounded-[22px] overflow-hidden shadow-2xl border border-white/20">
                    <img src={previewUrl} alt="iOS" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">iOS Style</span>
                </div>

                {/* Android circular icon mockup */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl border border-white/20">
                    <img src={previewUrl} alt="Android" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Android Round</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleExportZip}
                disabled={isPackaging}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <FileArchive className="w-4 h-4" />
                <span>{isPackaging ? 'Packaging Zip Archive...' : 'Download Complete Icon Package (ZIP)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
