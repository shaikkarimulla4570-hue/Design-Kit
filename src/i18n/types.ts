export type Direction = 'ltr' | 'rtl';

export interface LanguageMeta {
  code: string;
  name: string;        // English name (used for alphabetical sorting & search)
  nativeName: string;  // Native script name
  region: string;      // Country / Region label
  dir: Direction;
}

export interface TranslationDictionary {
  // Navigation & Header
  'nav.home': string;
  'nav.imageTools': string;
  'nav.templates': string;
  'nav.tools': string;
  'nav.about': string;
  'nav.allTools': string;
  'nav.searchPlaceholder': string;
  'nav.selectLanguage': string;
  'nav.searchLanguage': string;
  'nav.noLanguageFound': string;
  'nav.noToolsFound': string;
  'nav.menu': string;
  'nav.localEngine': string;
  'nav.localEngineDesc': string;
  'nav.privacyPromise': string;
  'nav.termsOfUse': string;
  'nav.rightsReserved': string;

  // Categories
  'cat.resize-dimensions': string;
  'cat.compress-image': string;
  'cat.convert-format': string;
  'cat.edit-image': string;
  'cat.watermark-overlay': string;
  'cat.image-pdf': string;
  'cat.favicon-generator': string;
  'cat.app-icon-generator': string;

  // Tool Titles
  'tool.resize-image': string;
  'tool.crop-image': string;
  'tool.passport-photo': string;
  'tool.compress-image': string;
  'tool.convert-to-jpg': string;
  'tool.convert-from-jpg': string;
  'tool.format-converter': string;
  'tool.rotate-image': string;
  'tool.photo-editor': string;
  'tool.meme-generator': string;
  'tool.watermark-image': string;
  'tool.image-to-pdf': string;
  'tool.pdf-to-images': string;
  'tool.image-to-favicon': string;
  'tool.text-to-favicon': string;
  'tool.app-icon-maker': string;
  'tool.remove-bg': string;

  // Tool Descriptions
  'toolDesc.resize-image': string;
  'toolDesc.crop-image': string;
  'toolDesc.passport-photo': string;
  'toolDesc.compress-image': string;
  'toolDesc.convert-to-jpg': string;
  'toolDesc.convert-from-jpg': string;
  'toolDesc.format-converter': string;
  'toolDesc.rotate-image': string;
  'toolDesc.photo-editor': string;
  'toolDesc.meme-generator': string;
  'toolDesc.watermark-image': string;
  'toolDesc.image-to-pdf': string;
  'toolDesc.pdf-to-images': string;
  'toolDesc.image-to-favicon': string;
  'toolDesc.text-to-favicon': string;
  'toolDesc.app-icon-maker': string;
  'toolDesc.remove-bg': string;

  // Homepage
  'hero.badge': string;
  'hero.titlePrefix': string;
  'hero.titleAccent': string;
  'hero.subtitle': string;
  'hero.searchPlaceholder': string;
  'hero.startDesigning': string;
  'hero.exploreTools': string;
  'hero.free': string;
  'hero.freeSub': string;
  'hero.browser': string;
  'hero.browserSub': string;
  'hero.secure': string;
  'hero.secureSub': string;
  'hero.quality': string;
  'hero.qualitySub': string;
  'home.popularTitle': string;
  'home.popularSub': string;
  'home.viewAllTools': string;
  'home.useTool': string;
  'home.categoriesTitle': string;
  'home.categoriesSub': string;
  'home.viewAllCategories': string;
  'home.exploreSuite': string;
  'home.toolSingular': string;
  'home.toolPlural': string;
  'home.bannerTitle': string;
  'home.bannerSub': string;
  'home.featNoSignup': string;
  'home.featFast': string;
  'home.featQuality': string;
  'home.featDevices': string;
  'home.featFree': string;

  // Footer & Pages
  'footer.privateTitle': string;
  'footer.privateDesc': string;
  'footer.fastTitle': string;
  'footer.fastDesc': string;
  'footer.freeTitle': string;
  'footer.freeDesc': string;
  'footer.brandDesc': string;
  'allTools.kicker': string;
  'allTools.subtitle': string;
  'allTools.filterKeyword': string;
  'allTools.popularBadge': string;
  'allTools.launchTool': string;
  'templates.kicker': string;
  'templates.title': string;
  'templates.subtitle': string;
  'about.kicker': string;
  'about.title': string;
  'about.subtitle': string;
  'about.faqTitle': string;

  // Shared Dropzone & Actions
  'drop.title': string;
  'drop.subtitle': string;
  'drop.chooseImage': string;
  'drop.chooseFiles': string;
  'drop.tryDemo': string;
  'drop.clientSide': string;
  'drop.private': string;
  'drop.noUploads': string;
  'drop.fileTooLarge': string;
  'action.download': string;
  'action.downloadZip': string;
  'action.reset': string;
  'action.changeImage': string;
  'action.apply': string;
  'action.processing': string;
  'action.copyCode': string;
  'action.copied': string;

  // Favicon Generator & HTML Code Section
  'fav.kicker': string;
  'fav.title': string;
  'fav.subtitle': string;
  'fav.imageTab': string;
  'fav.textTab': string;
  'fav.uploadLabel': string;
  'fav.uploadTitle': string;
  'fav.uploadSub': string;
  'fav.cropPositionTitle': string;
  'fav.imageScale': string;
  'fav.panX': string;
  'fav.panY': string;
  'fav.resetPosition': string;
  'fav.shapeTitle': string;
  'fav.shapeSquare': string;
  'fav.shapeRounded': string;
  'fav.shapeCircle': string;
  'fav.shapeSquircle': string;
  'fav.shapeCustom': string;
  'fav.cornerRadius': string;
  'fav.individualCorners': string;
  'fav.transparentBg': string;
  'fav.bgColor': string;
  'fav.textColor': string;
  'fav.textInputLabel': string;
  'fav.textAlign': string;
  'fav.alignLeft': string;
  'fav.alignCenter': string;
  'fav.alignRight': string;
  'fav.livePreview': string;
  'fav.browserPreview': string;
  'fav.multiResTitle': string;
  'fav.downloadIco': string;
  'fav.downloadApple': string;
  'fav.downloadAllZip': string;
  'fav.htmlSectionTitle': string;
  'fav.htmlSectionDesc': string;
  'fav.pathPrefixLabel': string;
  'fav.instructionsTitle': string;
  'fav.step1': string;
  'fav.step2': string;
  'fav.step3': string;
  'fav.step4': string;
  'fav.step5': string;
  'fav.step6': string;
  'fav.pathNote': string;
}

export type TranslationKey = keyof TranslationDictionary;
