import { TranslationDictionary } from '../types';

export interface CompactLocalePack {
  // Nav (8)
  nav: [
    home: string,
    imageTools: string,
    templates: string,
    tools: string,
    about: string,
    allTools: string,
    searchPlaceholder: string,
    language: string,
  ];
  searchLang: string;
  noLang: string;
  noTools: string; // includes {query}
  localEngine: string;
  localEngineDesc: string;
  privacy: string;
  terms: string;
  rights: string;

  // Categories (8)
  cats: [
    resizeDim: string,
    compress: string,
    convert: string,
    edit: string,
    watermark: string,
    pdf: string,
    favicon: string,
    appIcon: string,
  ];

  // Tool Titles (17)
  tools: [
    resize: string,
    crop: string,
    passport: string,
    compress: string,
    toJpg: string,
    fromJpg: string,
    converter: string,
    rotate: string,
    editor: string,
    meme: string,
    watermark: string,
    imgToPdf: string,
    pdfToImg: string,
    imgFav: string,
    txtFav: string,
    appIcon: string,
    removeBg: string,
  ];

  // Hero & Home
  heroBadge: string;
  heroPrefix: string;
  heroAccent: string;
  heroSub: string;
  startBtn: string;
  exploreBtn: string;
  free: string;
  browser: string;
  secure: string;
  quality: string;
  popularTitle: string;
  popularSub: string;
  viewAll: string;
  useTool: string;
  catTitle: string;
  catSub: string;
  toolWord: [singular: string, plural: string];
  bannerTitle: string;
  bannerSub: string;

  // Dropzone & Actions
  dropTitle: string;
  dropSub: string;
  chooseImg: string;
  chooseFiles: string;
  tryDemo: string;
  fileTooLarge: string; // includes {name} and {max}
  actions: [
    download: string,
    downloadZip: string,
    reset: string,
    changeImg: string,
    apply: string,
    processing: string,
    copyCode: string,
    copied: string,
  ];

  // Favicon UI
  favShapes: [
    square: string,
    rounded: string,
    circle: string,
    squircle: string,
    custom: string,
  ];
  favCornerRadius: string;
  favTransparent: string;
  favBgColor: string;
  favTextColor: string;
  favCropPos: string;
  favScale: string;
  favLivePreview: string;
  favGeneratedFiles: string;
  favHtmlTitle: string;
  favHtmlDesc: string;
  favInstructions: string;
  favPathNote: string;

  // Optional extra overrides
  overrides?: Partial<TranslationDictionary>;
}

export function expandLocale(pack: CompactLocalePack): Partial<TranslationDictionary> {
  const [
    home,
    imageTools,
    templates,
    tools,
    about,
    allTools,
    searchPlaceholder,
    language,
  ] = pack.nav;

  const [
    catResize,
    catCompress,
    catConvert,
    catEdit,
    catWatermark,
    catPdf,
    catFavicon,
    catAppIcon,
  ] = pack.cats;

  const [
    tResize,
    tCrop,
    tPassport,
    tCompress,
    tToJpg,
    tFromJpg,
    tConverter,
    tRotate,
    tEditor,
    tMeme,
    tWatermark,
    tImgToPdf,
    tPdfToImg,
    tImgFav,
    tTxtFav,
    tAppIcon,
    tRemoveBg,
  ] = pack.tools;

  const [
    download,
    downloadZip,
    reset,
    changeImg,
    apply,
    processing,
    copyCode,
    copied,
  ] = pack.actions;

  const [sSquare, sRounded, sCircle, sSquircle, sCustom] = pack.favShapes;

  return {
    'nav.home': home,
    'nav.imageTools': imageTools,
    'nav.templates': templates,
    'nav.tools': tools,
    'nav.about': about,
    'nav.allTools': allTools,
    'nav.searchPlaceholder': searchPlaceholder,
    'nav.selectLanguage': language,
    'nav.searchLanguage': pack.searchLang,
    'nav.noLanguageFound': pack.noLang,
    'nav.noToolsFound': pack.noTools,
    'nav.menu': `DesignKit · ${tools}`,
    'nav.localEngine': pack.localEngine,
    'nav.localEngineDesc': pack.localEngineDesc,
    'nav.privacyPromise': pack.privacy,
    'nav.termsOfUse': pack.terms,
    'nav.rightsReserved': pack.rights,

    'cat.resize-dimensions': catResize,
    'cat.compress-image': catCompress,
    'cat.convert-format': catConvert,
    'cat.edit-image': catEdit,
    'cat.watermark-overlay': catWatermark,
    'cat.image-pdf': catPdf,
    'cat.favicon-generator': catFavicon,
    'cat.app-icon-generator': catAppIcon,

    'tool.resize-image': tResize,
    'tool.crop-image': tCrop,
    'tool.passport-photo': tPassport,
    'tool.compress-image': tCompress,
    'tool.convert-to-jpg': tToJpg,
    'tool.convert-from-jpg': tFromJpg,
    'tool.format-converter': tConverter,
    'tool.rotate-image': tRotate,
    'tool.photo-editor': tEditor,
    'tool.meme-generator': tMeme,
    'tool.watermark-image': tWatermark,
    'tool.image-to-pdf': tImgToPdf,
    'tool.pdf-to-images': tPdfToImg,
    'tool.image-to-favicon': tImgFav,
    'tool.text-to-favicon': tTxtFav,
    'tool.app-icon-maker': tAppIcon,
    'tool.remove-bg': tRemoveBg,

    // Contextual localized descriptions for every tool card
    'toolDesc.resize-image': `${tResize} — ${pack.browser} · ${pack.quality}`,
    'toolDesc.crop-image': `${tCrop} — ${pack.browser} · ${pack.quality}`,
    'toolDesc.passport-photo': `${tPassport} — ${pack.browser} · ${pack.quality}`,
    'toolDesc.compress-image': `${tCompress} — ${pack.secure} · ${pack.quality}`,
    'toolDesc.convert-to-jpg': `${tToJpg} — JPG · PNG · WebP`,
    'toolDesc.convert-from-jpg': `${tFromJpg} — PNG · WebP`,
    'toolDesc.format-converter': `${tConverter} — JPG · PNG · WebP · BMP`,
    'toolDesc.rotate-image': `${tRotate} — 90° · 180° · 270°`,
    'toolDesc.photo-editor': `${tEditor} — ${pack.browser}`,
    'toolDesc.meme-generator': `${tMeme} — ${templates}`,
    'toolDesc.watermark-image': `${tWatermark} — ${pack.secure}`,
    'toolDesc.image-to-pdf': `${tImgToPdf} — PDF`,
    'toolDesc.pdf-to-images': `${tPdfToImg} — PNG · JPG`,
    'toolDesc.image-to-favicon': `${tImgFav} — PNG · ICO · HTML`,
    'toolDesc.text-to-favicon': `${tTxtFav} — 1,500+ Fonts · ICO · HTML`,
    'toolDesc.app-icon-maker': `${tAppIcon} — iOS · Android · ZIP`,
    'toolDesc.remove-bg': `${tRemoveBg} — PNG`,

    'hero.badge': pack.heroBadge,
    'hero.titlePrefix': pack.heroPrefix,
    'hero.titleAccent': pack.heroAccent,
    'hero.subtitle': pack.heroSub,
    'hero.searchPlaceholder': searchPlaceholder,
    'hero.startDesigning': pack.startBtn,
    'hero.exploreTools': pack.exploreBtn,
    'hero.free': pack.free,
    'hero.freeSub': pack.localEngine,
    'hero.browser': pack.browser,
    'hero.browserSub': pack.localEngine,
    'hero.secure': pack.secure,
    'hero.secureSub': pack.privacy,
    'hero.quality': pack.quality,
    'hero.qualitySub': download,

    'home.popularTitle': pack.popularTitle,
    'home.popularSub': pack.popularSub,
    'home.viewAllTools': pack.viewAll,
    'home.useTool': pack.useTool,
    'home.categoriesTitle': pack.catTitle,
    'home.categoriesSub': pack.catSub,
    'home.viewAllCategories': pack.viewAll,
    'home.exploreSuite': pack.useTool,
    'home.toolSingular': pack.toolWord[0],
    'home.toolPlural': pack.toolWord[1],
    'home.bannerTitle': pack.bannerTitle,
    'home.bannerSub': pack.bannerSub,
    'home.featNoSignup': pack.free,
    'home.featFast': pack.secure,
    'home.featQuality': pack.quality,
    'home.featDevices': pack.browser,
    'home.featFree': pack.free,

    'footer.privateTitle': pack.privacy,
    'footer.privateDesc': pack.localEngineDesc,
    'footer.fastTitle': pack.secure,
    'footer.fastDesc': pack.heroSub,
    'footer.freeTitle': pack.free,
    'footer.freeDesc': pack.bannerSub,
    'footer.brandDesc': pack.heroSub,

    'allTools.kicker': allTools,
    'allTools.subtitle': pack.popularSub,
    'allTools.filterKeyword': searchPlaceholder,
    'allTools.popularBadge': '★',
    'allTools.launchTool': pack.useTool,
    'templates.kicker': templates,
    'templates.title': templates,
    'templates.subtitle': pack.catSub,
    'about.kicker': pack.privacy,
    'about.title': `${about} DesignKit`,
    'about.subtitle': pack.localEngineDesc,

    'drop.title': pack.dropTitle,
    'drop.subtitle': pack.dropSub,
    'drop.chooseImage': pack.chooseImg,
    'drop.chooseFiles': pack.chooseFiles,
    'drop.tryDemo': pack.tryDemo,
    'drop.clientSide': pack.browser,
    'drop.private': pack.privacy,
    'drop.noUploads': pack.localEngine,
    'drop.fileTooLarge': pack.fileTooLarge,

    'action.download': download,
    'action.downloadZip': downloadZip,
    'action.reset': reset,
    'action.changeImage': changeImg,
    'action.apply': apply,
    'action.processing': processing,
    'action.copyCode': copyCode,
    'action.copied': copied,

    'fav.kicker': catFavicon,
    'fav.title': catFavicon,
    'fav.subtitle': pack.favHtmlDesc,
    'fav.imageTab': tImgFav,
    'fav.textTab': tTxtFav,
    'fav.uploadLabel': `${pack.chooseImg} (JPG, JPEG, PNG, WebP)`,
    'fav.uploadTitle': pack.dropTitle,
    'fav.uploadSub': pack.dropSub,
    'fav.cropPositionTitle': pack.favCropPos,
    'fav.imageScale': pack.favScale,
    'fav.resetPosition': reset,
    'fav.shapeTitle': `${catFavicon} — ${pack.favCornerRadius}`,
    'fav.shapeSquare': sSquare,
    'fav.shapeRounded': sRounded,
    'fav.shapeCircle': sCircle,
    'fav.shapeSquircle': sSquircle,
    'fav.shapeCustom': sCustom,
    'fav.cornerRadius': pack.favCornerRadius,
    'fav.transparentBg': pack.favTransparent,
    'fav.bgColor': pack.favBgColor,
    'fav.textColor': pack.favTextColor,
    'fav.livePreview': pack.favLivePreview,
    'fav.multiResTitle': pack.favGeneratedFiles,
    'fav.downloadIco': `${download} favicon.ico`,
    'fav.downloadApple': `${download} Apple Touch Icon`,
    'fav.downloadAllZip': downloadZip,
    'fav.htmlSectionTitle': pack.favHtmlTitle,
    'fav.htmlSectionDesc': pack.favHtmlDesc,
    'fav.instructionsTitle': pack.favInstructions,
    'fav.pathNote': pack.favPathNote,

    ...pack.overrides,
  };
}

export interface LexiconSpec {
  home: string;
  imageTools: string;
  templates: string;
  tools: string;
  about: string;
  allTools: string;
  search: string;
  lang: string;
  noLang: string;
  noTools: string;
  privacy: string;
  terms: string;
  rights: string;
  localEngine: string;
  localDesc: string;

  // Core verbs/nouns for categories & tools
  resizeImg: string;
  cropImg: string;
  passportImg: string;
  compressImg: string;
  toJpg: string;
  fromJpg: string;
  convertFmt: string;
  rotateImg: string;
  photoEditor: string;
  memeGen: string;
  watermarkImg: string;
  imgToPdf: string;
  pdfToImg: string;
  imgToFav: string;
  txtToFav: string;
  appIcon: string;
  removeBg: string;

  // Homepage
  heroBadge: string;
  heroPrefix: string;
  heroAccent: string;
  heroSub: string;
  startBtn: string;
  exploreBtn: string;
  free: string;
  browser: string;
  secure: string;
  quality: string;
  popularTitle: string;
  viewAll: string;
  useTool: string;
  catTitle: string;
  bannerTitle: string;

  // Dropzone & Actions
  dropTitle: string;
  chooseImg: string;
  chooseFiles: string;
  tryDemo: string;
  fileTooLarge: string;
  download: string;
  downloadZip: string;
  reset: string;
  changeImg: string;
  apply: string;
  processing: string;
  copyCode: string;
  copied: string;

  // Favicon
  favGen: string;
  shapes: [square: string, rounded: string, circle: string, squircle: string, custom: string];
  cornerRadius: string;
  transparentBg: string;
  bgColor: string;
  textColor: string;
  favHtmlTitle: string;
  favHtmlDesc: string;
  favInstructions: string;
}

export function buildFromLexicon(lex: LexiconSpec): Partial<TranslationDictionary> {
  return expandLocale({
    nav: [
      lex.home,
      lex.imageTools,
      lex.templates,
      lex.tools,
      lex.about,
      lex.allTools,
      lex.search,
      lex.lang,
    ],
    searchLang: lex.search,
    noLang: lex.noLang,
    noTools: lex.noTools,
    localEngine: lex.localEngine,
    localEngineDesc: lex.localDesc,
    privacy: lex.privacy,
    terms: lex.terms,
    rights: lex.rights,
    cats: [
      lex.resizeImg,
      lex.compressImg,
      lex.convertFmt,
      lex.photoEditor,
      lex.watermarkImg,
      `${lex.imgToPdf} / PDF`,
      lex.favGen,
      lex.appIcon,
    ],
    tools: [
      lex.resizeImg,
      lex.cropImg,
      lex.passportImg,
      lex.compressImg,
      lex.toJpg,
      lex.fromJpg,
      lex.convertFmt,
      lex.rotateImg,
      lex.photoEditor,
      lex.memeGen,
      lex.watermarkImg,
      lex.imgToPdf,
      lex.pdfToImg,
      lex.imgToFav,
      lex.txtToFav,
      lex.appIcon,
      lex.removeBg,
    ],
    heroBadge: lex.heroBadge,
    heroPrefix: lex.heroPrefix,
    heroAccent: lex.heroAccent,
    heroSub: lex.heroSub,
    startBtn: lex.startBtn,
    exploreBtn: lex.exploreBtn,
    free: lex.free,
    browser: lex.browser,
    secure: lex.secure,
    quality: lex.quality,
    popularTitle: lex.popularTitle,
    popularSub: lex.heroSub,
    viewAll: lex.viewAll,
    useTool: lex.useTool,
    catTitle: lex.catTitle,
    catSub: lex.localDesc,
    toolWord: [lex.tools, lex.tools],
    bannerTitle: lex.bannerTitle,
    bannerSub: lex.heroSub,
    dropTitle: lex.dropTitle,
    dropSub: `JPG, JPEG, PNG, WebP (≤ 50MB) — ${lex.localDesc}`,
    chooseImg: lex.chooseImg,
    chooseFiles: lex.chooseFiles,
    tryDemo: lex.tryDemo,
    fileTooLarge: lex.fileTooLarge,
    actions: [
      lex.download,
      lex.downloadZip,
      lex.reset,
      lex.changeImg,
      lex.apply,
      lex.processing,
      lex.copyCode,
      lex.copied,
    ],
    favShapes: lex.shapes,
    favCornerRadius: lex.cornerRadius,
    favTransparent: lex.transparentBg,
    favBgColor: lex.bgColor,
    favTextColor: lex.textColor,
    favCropPos: `${lex.cropImg} & ${lex.resizeImg}`,
    favScale: lex.resizeImg,
    favLivePreview: 'Preview',
    favGeneratedFiles: `${lex.favGen} (PNG · ICO)`,
    favHtmlTitle: lex.favHtmlTitle,
    favHtmlDesc: lex.favHtmlDesc,
    favInstructions: lex.favInstructions,
    favPathNote: lex.favHtmlDesc,
  });
}

