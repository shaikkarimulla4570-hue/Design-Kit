import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { createSampleImage } from '../../utils/imageProcessors';
import { useI18n } from '../../i18n/I18nContext';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
  sampleType?: 'landscape' | 'portrait' | 'icon';
  compact?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp',
  multiple = false,
  maxSizeMB = 50,
  title,
  subtitle,
  sampleType = 'landscape',
  compact = false,
}) => {
  const { locale, t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolvedTitle = (locale === 'en' || compact) && title ? title : t('drop.title');
  const resolvedSubtitle = (locale === 'en' || compact) && subtitle ? subtitle : t('drop.subtitle');

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMsg(null);

    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMsg(t('drop.fileTooLarge', { name: file.name, max: maxSizeMB }));
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(multiple ? validFiles : [validFiles[0]]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleLoadSample = (e: React.MouseEvent) => {
    e.stopPropagation();
    const sample = createSampleImage(sampleType);
    onFilesSelected([sample]);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl ${
          compact ? 'p-6' : 'p-8 sm:p-12'
        } text-center transition-all cursor-pointer bg-white group ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 scale-[1.005]'
            : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-1">{resolvedTitle}</h3>
          <p className="text-sm text-slate-500 mb-6">{resolvedSubtitle}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4 shrink-0" />
              <span>{multiple ? t('drop.chooseFiles') : t('drop.chooseImage')}</span>
            </button>

            <button
              type="button"
              onClick={handleLoadSample}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all flex items-center gap-2 border border-slate-200 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{t('drop.tryDemo')}</span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span>{t('drop.clientSide')}</span>
            <span>·</span>
            <span>{t('drop.private')}</span>
            <span>·</span>
            <span>{t('drop.noUploads')}</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
