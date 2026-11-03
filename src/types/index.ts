export type ToolId =
  | 'compress-image'
  | 'resize-image'
  | 'crop-image'
  | 'passport-photo'
  | 'convert-to-jpg'
  | 'convert-from-jpg'
  | 'format-converter'
  | 'rotate-image'
  | 'photo-editor'
  | 'meme-generator'
  | 'watermark-image'
  | 'image-to-pdf'
  | 'pdf-to-images'
  | 'image-to-favicon'
  | 'text-to-favicon'
  | 'app-icon-maker'
  | 'remove-bg';

export type CategoryId =
  | 'resize-dimensions'
  | 'compress-image'
  | 'convert-format'
  | 'edit-image'
  | 'watermark-overlay'
  | 'image-pdf'
  | 'favicon-generator'
  | 'app-icon-generator';

export interface ToolItem {
  id: ToolId;
  title: string;
  shortDesc: string;
  category: CategoryId;
  badge?: string;
  popular?: boolean;
}

export interface CategoryItem {
  id: CategoryId;
  title: string;
  iconName: string;
  tools: ToolItem[];
}

export interface ProcessedImageResult {
  id: string;
  originalFile: File;
  originalUrl: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  outputBlob?: Blob;
  outputUrl?: string;
  outputSize?: number;
  outputWidth?: number;
  outputHeight?: number;
  outputFormat?: string;
  qualityUsed?: number;
  status: 'idle' | 'processing' | 'done' | 'error';
  statusMessage?: string;
  error?: string;
}
