import { CategoryItem, ToolItem, ToolId } from '../types';

export const TOOLS_LIST: ToolItem[] = [
  // Resize & Dimensions
  {
    id: 'resize-image',
    title: 'Resize Image',
    shortDesc: 'Change image dimensions easily with exact pixels or percentage scaling.',
    category: 'resize-dimensions',
    popular: true,
  },
  {
    id: 'crop-image',
    title: 'Crop Image',
    shortDesc: 'Crop to your desired size, freehand, or common aspect ratios.',
    category: 'resize-dimensions',
    popular: true,
  },
  {
    id: 'passport-photo',
    title: 'Passport Size Photo Maker',
    shortDesc: 'Format photos for official IDs, passport standards, and printable sheets.',
    category: 'resize-dimensions',
  },

  // Compress Image
  {
    id: 'compress-image',
    title: 'Compress Image',
    shortDesc: 'Reduce file size to exact target (e.g. 100 KB) or quality without quality loss.',
    category: 'compress-image',
    popular: true,
  },

  // Convert Image Format
  {
    id: 'convert-to-jpg',
    title: 'Convert to JPG',
    shortDesc: 'Convert PNG, WebP, and other formats to high quality JPG with custom bg.',
    category: 'convert-format',
    popular: true,
  },
  {
    id: 'convert-from-jpg',
    title: 'Convert from JPG',
    shortDesc: 'Convert JPG to PNG or WebP with transparency support and clean rendering.',
    category: 'convert-format',
    popular: true,
  },
  {
    id: 'format-converter',
    title: 'Image Format Converter',
    shortDesc: 'Convert between JPG, PNG, WebP, and SVG client-side in seconds.',
    category: 'convert-format',
  },

  // Edit Image
  {
    id: 'rotate-image',
    title: 'Rotate Image',
    shortDesc: 'Rotate 90°, 180°, 270°, flip horizontally/vertically or custom angle.',
    category: 'edit-image',
    popular: true,
  },
  {
    id: 'photo-editor',
    title: 'Photo Editor',
    shortDesc: 'Edit images with text, shapes, filters, brightness, contrast, and stickers.',
    category: 'edit-image',
    popular: true,
  },
  {
    id: 'meme-generator',
    title: 'Meme Generator',
    shortDesc: 'Create hilarious memes with top & bottom captions and classic templates.',
    category: 'edit-image',
  },

  // Watermark & Overlay
  {
    id: 'watermark-image',
    title: 'Watermark Image',
    shortDesc: 'Add custom text or logo watermarks with opacity and tile repeating.',
    category: 'watermark-overlay',
    popular: true,
  },

  // Image & PDF Tools
  {
    id: 'image-to-pdf',
    title: 'Image to PDF Converter',
    shortDesc: 'Convert one or multiple images into a multi-page PDF document.',
    category: 'image-pdf',
  },
  {
    id: 'pdf-to-images',
    title: 'PDF to Images',
    shortDesc: 'Extract pages from PDF files and download as high quality PNG or JPG.',
    category: 'image-pdf',
  },

  // Favicon Generator
  {
    id: 'image-to-favicon',
    title: 'Image to Favicon',
    shortDesc: 'Generate multi-resolution browser favicons (16x16 to 512x512) and ICO/PNG.',
    category: 'favicon-generator',
  },
  {
    id: 'text-to-favicon',
    title: 'Text to Favicon',
    shortDesc: 'Design monogram favicons with 1,400+ fonts in Telugu, Hindi, English, Tamil, Arabic & more.',
    category: 'favicon-generator',
  },

  // App Icon Generator
  {
    id: 'app-icon-maker',
    title: 'App Icon Maker',
    shortDesc: 'Generate complete iOS & Android application icon packages with ZIP export.',
    category: 'app-icon-generator',
  },

  // Bonus Smart Tool (also shown on hero image!)
  {
    id: 'remove-bg',
    title: 'Remove Background',
    shortDesc: 'Erase solid backgrounds and isolate subjects with color-keying tolerance.',
    category: 'edit-image',
    popular: true,
  },
];

export const CATEGORIES_LIST: CategoryItem[] = [
  {
    id: 'resize-dimensions',
    title: 'Resize & Dimensions',
    iconName: 'Maximize2',
    tools: TOOLS_LIST.filter((t) => t.category === 'resize-dimensions'),
  },
  {
    id: 'compress-image',
    title: 'Compress Image',
    iconName: 'Database',
    tools: TOOLS_LIST.filter((t) => t.category === 'compress-image'),
  },
  {
    id: 'convert-format',
    title: 'Convert Image Format',
    iconName: 'ArrowLeftRight',
    tools: TOOLS_LIST.filter((t) => t.category === 'convert-format'),
  },
  {
    id: 'edit-image',
    title: 'Edit Image',
    iconName: 'Wand2',
    tools: TOOLS_LIST.filter((t) => t.category === 'edit-image'),
  },
  {
    id: 'watermark-overlay',
    title: 'Watermark & Overlay',
    iconName: 'Droplet',
    tools: TOOLS_LIST.filter((t) => t.category === 'watermark-overlay'),
  },
  {
    id: 'image-pdf',
    title: 'Image & PDF Tools',
    iconName: 'FileText',
    tools: TOOLS_LIST.filter((t) => t.category === 'image-pdf'),
  },
  {
    id: 'favicon-generator',
    title: 'Favicon Generator',
    iconName: 'Star',
    tools: TOOLS_LIST.filter((t) => t.category === 'favicon-generator'),
  },
  {
    id: 'app-icon-generator',
    title: 'App Icon Generator',
    iconName: 'LayoutGrid',
    tools: TOOLS_LIST.filter((t) => t.category === 'app-icon-generator'),
  },
];

export function getToolById(id: string): ToolItem | undefined {
  return TOOLS_LIST.find((t) => t.id === id);
}

export function getCategoryById(id: string): CategoryItem | undefined {
  return CATEGORIES_LIST.find((c) => c.id === id);
}
