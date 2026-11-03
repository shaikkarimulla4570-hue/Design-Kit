export type LanguageId =
  | 'all'
  | 'english'
  | 'telugu'
  | 'hindi'
  | 'tamil'
  | 'bengali'
  | 'kannada'
  | 'malayalam'
  | 'arabic'
  | 'japanese'
  | 'korean'
  | 'chinese'
  | 'russian';

export type FontCategory =
  | 'All'
  | 'Sans-Serif'
  | 'Serif'
  | 'Display'
  | 'Handwriting'
  | 'Monospace';

export type FontRenderStyle = 'solid' | 'outline' | 'shadow';

export interface FaviconFontItem {
  id: string;
  name: string;
  googleFamily: string;
  language: Exclude<LanguageId, 'all'>;
  category: Exclude<FontCategory, 'All'>;
  weight: number;
  italic?: boolean;
  slant?: number;
  scaleX?: number;
  renderStyle?: FontRenderStyle;
}

export interface LanguageOption {
  id: LanguageId;
  label: string;
  nativeLabel: string;
  defaultSample: string;
  sampleChars: string[];
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'all',
    label: 'All Languages',
    nativeLabel: 'Global',
    defaultSample: 'D',
    sampleChars: ['D', 'అ', 'अ', 'அ', 'অ', 'ಅ', 'അ', 'ع', 'あ', '가', '福', 'Д'],
  },
  {
    id: 'telugu',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
    defaultSample: 'అ',
    sampleChars: ['అ', 'ఆ', 'శ్రీ', 'ఓం', 'తె', 'క', 'మ', 'ర', 'స', 'న', 'వ', 'జ', 'గ', 'ల'],
  },
  {
    id: 'hindi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    defaultSample: 'अ',
    sampleChars: ['अ', 'आ', 'श्री', 'ॐ', 'हि', 'क', 'र', 'स', 'म', 'ग', 'भ', 'प्र', 'न', 'व'],
  },
  {
    id: 'english',
    label: 'English',
    nativeLabel: 'Latin',
    defaultSample: 'D',
    sampleChars: ['D', 'DK', 'A', 'S', 'AI', 'X', 'M', 'K', 'R', '⚡', '🚀', '★'],
  },
  {
    id: 'tamil',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    defaultSample: 'அ',
    sampleChars: ['அ', 'ஆ', 'க', 'த', 'ஸ்ரீ', 'ஓம்', 'ம', 'ந', 'வ', 'ச', 'ப', 'ழ'],
  },
  {
    id: 'bengali',
    label: 'Bengali',
    nativeLabel: 'বাংলা',
    defaultSample: 'অ',
    sampleChars: ['অ', 'আ', 'ক', 'শ্রী', 'ওঁ', 'বা', 'ম', 'র', 'স', 'ন', 'ভ', 'দ'],
  },
  {
    id: 'kannada',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    defaultSample: 'ಅ',
    sampleChars: ['ಅ', 'ಆ', 'ಕ', 'ಶ್ರೀ', 'ಓಂ', 'ಮ', 'ರ', 'ಸ', 'ನ', 'ವ', 'ಗ', 'ಜ'],
  },
  {
    id: 'malayalam',
    label: 'Malayalam',
    nativeLabel: 'മലയാളം',
    defaultSample: 'അ',
    sampleChars: ['അ', 'ആ', 'ക', 'ശ്രീ', 'ഓം', 'മ', 'ര', 'സ', 'ന', 'വ', 'ഗ', 'ജ'],
  },
  {
    id: 'arabic',
    label: 'Arabic',
    nativeLabel: 'العربية',
    defaultSample: 'ع',
    sampleChars: ['ع', 'م', 'أ', 'ب', 'ن', 'ح', 'س', 'ر', 'ك', 'ي', 'ف', 'ق'],
  },
  {
    id: 'japanese',
    label: 'Japanese',
    nativeLabel: '日本語',
    defaultSample: 'あ',
    sampleChars: ['あ', '愛', '夢', '光', '和', '神', '龍', '星', '桜', '道', '心', '空'],
  },
  {
    id: 'korean',
    label: 'Korean',
    nativeLabel: '한국어',
    defaultSample: '가',
    sampleChars: ['가', '한', '별', '꿈', '빛', '강', '산', '해', '달', '복', '미', '정'],
  },
  {
    id: 'chinese',
    label: 'Chinese',
    nativeLabel: '中文',
    defaultSample: '福',
    sampleChars: ['福', '龍', '愛', '華', '星', '夢', '天', '道', '心', '光', '和', '玉'],
  },
  {
    id: 'russian',
    label: 'Russian',
    nativeLabel: 'Русский',
    defaultSample: 'Д',
    sampleChars: ['Д', 'Я', 'Ж', 'Ф', 'Б', 'З', 'Л', 'П', 'И', 'Ш', 'Э', 'Ю'],
  },
];

// ---------------------------------------------------------------------------
// 1. Verified Real Google Fonts — English / Latin (650+ Distinct Families)
// ---------------------------------------------------------------------------
const LATIN_SANS: string[] = [
  'Plus Jakarta Sans', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
  'Oswald', 'Raleway', 'Nunito', 'Nunito Sans', 'Ubuntu', 'Rubik', 'Work Sans',
  'Quicksand', 'Fira Sans', 'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed',
  'Mulish', 'Titillium Web', 'PT Sans', 'PT Sans Narrow', 'PT Sans Caption', 'Karla',
  'Josefin Sans', 'Libre Franklin', 'DM Sans', 'Manrope', 'Outfit', 'Cabin', 'Dosis',
  'Anton', 'Hind', 'Oxygen', 'Source Sans 3', 'Maven Pro', 'Exo', 'Exo 2', 'Signika',
  'Signika Negative', 'Varela Round', 'Varela', 'Asap', 'Asap Condensed', 'Archivo',
  'Archivo Black', 'Archivo Narrow', 'Abel', 'Questrial', 'Catamaran', 'Public Sans',
  'Urbanist', 'Bricolage Grotesque', 'Syne', 'Space Grotesk', 'Chivo', 'Overpass',
  'Assistant', 'Teko', 'Rajdhani', 'Fjalla One', 'Yanone Kaffeesatz', 'Cuprum',
  'Didact Gothic', 'Francois One', 'Pathway Gothic One', 'Acme', 'Ropa Sans',
  'Russo One', 'Paytone One', 'Secular One', 'Hammersmith One', 'Jost',
  'Red Hat Display', 'Red Hat Text', 'Lexend', 'Lexend Deca', 'Lexend Exa',
  'Lexend Giga', 'Lexend Mega', 'Lexend Peta', 'Lexend Tera', 'Lexend Zetta',
  'Be Vietnam Pro', 'Albert Sans', 'Figtree', 'Onest', 'Geologica',
  'Wix Madefor Display', 'Wix Madefor Text', 'Schibsted Grotesk', 'Hanken Grotesk',
  'League Spartan', 'Commissioner', 'Epilogue', 'Sora', 'Sen', 'Alata', 'Days One',
  'Electrolize', 'Michroma', 'Orbitron', 'Aldrich', 'Syncopate', 'Chakra Petch',
  'Bai Jamjuree', 'Kanit', 'Prompt', 'Sarabun', 'Mitr', 'Athiti', 'K2D', 'Niramit',
  'Kodchasan', 'Mali', 'Fahkwang', 'Krub', 'Saira', 'Saira Condensed',
  'Saira Semi Condensed', 'Saira Extra Condensed', 'Encode Sans',
  'Encode Sans Condensed', 'Encode Sans Semi Condensed', 'Alegreya Sans',
  'Alegreya Sans SC', 'Merriweather Sans', 'Pontano Sans', 'Gudea', 'Istok Web',
  'Nobile', 'Scada', 'Spinnaker', 'Telex', 'Monda', 'Julius Sans One', 'Tenor Sans',
  'Carrois Gothic', 'Economica', 'Armata', 'Basic', 'Candal', 'Capriola',
  'Doppio One', 'Duru Sans', 'Englebert', 'Federo', 'Fresca', 'Galdeano', 'Geo',
  'Homenaje', 'Imprima', 'Jockey One', 'Kite One', 'Mako', 'Marmelad', 'Marvel',
  'Metrophobic', 'Molengo', 'Mouse Memoirs', 'Numans', 'Orienta', 'Puritan',
  'Quantico', 'Rambla', 'Rosario', 'Ruluko', 'Rum Raisin', 'Shanti', 'Snippet',
  'Strait', 'Tauri', 'Text Me One', 'Wendy One', 'Spline Sans', 'Readex Pro',
  'Atkinson Hyperlegible', 'Sofia Sans', 'Sofia Sans Condensed',
  'Sofia Sans Extra Condensed', 'Sofia Sans Semi Condensed', 'Instrument Sans',
  'Golos Text', 'Anuphan', 'Familjen Grotesk', 'Radio Canada', 'Gantari', 'Finlandica',
];

const LATIN_SERIF: string[] = [
  'Playfair Display', 'Playfair Display SC', 'Merriweather', 'Lora', 'PT Serif',
  'PT Serif Caption', 'Libre Baskerville', 'Crimson Text', 'Crimson Pro',
  'EB Garamond', 'Cormorant', 'Cormorant Garamond', 'Cormorant Infant',
  'Cormorant SC', 'Cormorant Unicase', 'Cormorant Upright', 'Bitter', 'Arvo',
  'Josefin Slab', 'Rokkitt', 'Zilla Slab', 'Slabo 27px', 'Slabo 13px', 'Domine',
  'Vollkorn', 'Vollkorn SC', 'Noticia Text', 'Bree Serif', 'Crete Round',
  'Patua One', 'Alfa Slab One', 'Cinzel', 'Cinzel Decorative', 'Abril Fatface',
  'Yeseva One', 'Prata', 'Bodoni Moda', 'Fraunces', 'DM Serif Display',
  'DM Serif Text', 'Source Serif 4', 'Spectral', 'Spectral SC', 'Alegreya',
  'Alegreya SC', 'Cardo', 'Neuton', 'Old Standard TT', 'Goudy Bookletter 1911',
  'Sorts Mill Goudy', 'Gentium Book Plus', 'Gentium Plus', 'Vidaloka', 'Ultra',
  'Frank Ruhl Libre', 'David Libre', 'Miriam Libre', 'Faustina', 'Literata',
  'Newsreader', 'Instrument Serif', 'Young Serif', 'Castoro', 'Castoro Titling',
  'Brygada 1918', 'Petrona', 'Piazzolla', 'Imbue', 'Gloock', 'Besley', 'BioRhyme',
  'Kameron', 'Lusitana', 'Lustria', 'Mate', 'Mate SC', 'Ovo', 'Podkova', 'Poly',
  'Quattrocento', 'Radley', 'Sanchez', 'Scope One', 'Taviraj', 'Tinos', 'Trirong',
  'Trykker', 'Unna', 'Volkhov', 'Abhaya Libre', 'Adamina', 'Alike', 'Alike Angular',
  'Almendra', 'Almendra SC', 'Amethysta', 'Andada Pro', 'Antic Didone',
  'Antic Slab', 'Arapey', 'Artifika', 'Arbutus Slab', 'Average', 'Balthazar',
  'Belgrano', 'Bellefair', 'Bentham', 'Bona Nova', 'Buenard', 'Cambo',
  'Cantata One', 'Caudex', 'Copse', 'Coustard', 'Cutive', 'Della Respira',
  'Donegal One', 'Enriqueta', 'Esteban', 'Fanwood Text', 'Fenix', 'Fjord One',
  'Gabriela', 'Gilda Display', 'Habibi', 'Headland One', 'Holtwood One SC',
  'Inika', 'Italiana', 'Jacques Francois', 'Judson', 'Junge', 'Ledger',
  'Linden Hill', 'Marcellus', 'Marcellus SC', ' Libre Caslon Text',
  'Libre Caslon Display', 'Libre Bodoni', 'Ibarra Real Nova', ' Rosarivo',
].map((s) => s.trim());

const LATIN_DISPLAY: string[] = [
  'Bebas Neue', 'Righteous', 'Lobster', 'Lobster Two', 'Bangers', 'Fredoka',
  'Comfortaa', 'Poiret One', 'Special Elite', 'Bungee', 'Bungee Inline',
  'Bungee Shade', 'Bungee Outline', 'Bungee Hairline', 'Monoton', 'Audiowide',
  'Press Start 2P', 'Silkscreen', 'VT323', 'Creepster', 'Nosifer', 'Eater',
  'Butcherman', 'Metal Mania', 'Rye', 'UnifrakturMaguntia', 'Pirata One',
  'MedievalSharp', 'Uncial Antiqua', 'Macondo', 'Carter One', 'Lilita One',
  'Titan One', 'Bowlby One', 'Bowlby One SC', 'Passion One', 'Concert One',
  'Fugaz One', 'Racing Sans One', 'Black Ops One', 'Staatliches', 'Squada One',
  'Wallpoet', 'Faster One', 'Plaster', 'Kelly Slab', 'Codystar', 'Raleway Dots',
  'Vast Shadow', 'Londrina Outline', 'Londrina Shadow', 'Londrina Sketch',
  'Londrina Solid', 'Fredericka the Great', 'Cabin Sketch',
  'Love Ya Like A Sister', 'Luckiest Guy', 'Chewy', 'Boogaloo', 'Bubblegum Sans',
  'Cherry Cream Soda', 'Fontdiner Swanky', 'Slackey', 'Sniglet', 'Ranchers',
  'Freckle Face', 'Finger Paint', 'Happy Monkey', 'Henny Penny', 'Irish Grover',
  'Jolly Lodger', 'Kranky', 'Life Savers', 'Mountains of Christmas',
  'Mystery Quest', 'New Rocker', 'Original Surfer', 'Piedra', 'Ribeye',
  'Ribeye Marrow', 'Risque', 'Sancreek', 'Sarina', 'Shojumaru', 'Smokum',
  'Snowburst One', 'Sonsie One', 'Spicy Rice', 'Spirax', 'Stint Ultra Condensed',
  'Stint Ultra Expanded', 'Supermercado One', 'Trade Winds', 'Trochut',
  'Tulpen One', 'Unica One', 'Vampiro One', 'Voces', 'Wellfleet',
  'Big Shoulders Display', 'Big Shoulders Text', 'Big Shoulders Stencil Display',
  'Unbounded', 'Climate Crisis', 'Tourney', 'Rubik Moonrocks', 'Rubik Glitch',
  'Rubik Wet Paint', 'Rubik Bubbles', 'Rubik Vinyl', 'Rubik Puddles', 'Rubik Iso',
  'Rubik Microbe', 'Rubik Burned', 'Rubik Distressed', 'Rubik Gemstones',
  'Rubik Marker Hatch', 'Rubik Maze', 'Rubik Spray Paint', 'Rubik Storm',
  'Rubik 80s Fade', 'Rubik Pixels', 'Kablammo', 'Kalnia', 'Cherry Bomb One',
  'Chango', 'Coiny', 'Mogra', 'Shrikhand', 'Kavoon', 'Lemon', 'Calistoga',
  'Croissant One', 'Forum', 'Graduate', 'Gravitas One', 'Gruppo', 'Iceberg',
  'Iceland', 'Keania One', 'Kenia', 'Kumar One', 'Kumar One Outline', 'Limelight',
  'Megrim', 'Metamorphous', 'Milonga', 'Modern Antiqua', 'Nixie One', 'Nova Cut',
  'Nova Flat', 'Nova Oval', 'Nova Round', 'Nova Script', 'Nova Slim',
  'Nova Square', 'Offside', 'Oldenburg', 'Oleo Script', 'Oleo Script Swash Caps',
  'Oregano', 'Overlock', 'Overlock SC', 'Paprika', 'Peralta', 'Poller One',
  'Pompiere', 'Prosto One', 'Purple Purse', 'Rammetto One', 'Redressed',
  'Revalia', 'Salsa', 'Simonetta', 'Sirin Stencil', 'Skranji', 'Sofadi One',
  'Stalinist One', 'Stardos Stencil', 'Underdog', 'Warnes',
];

const LATIN_HANDWRITING: string[] = [
  'Pacifico', 'Dancing Script', 'Caveat', 'Satisfy', 'Great Vibes', 'Sacramento',
  'Kaushan Script', 'Permanent Marker', 'Indie Flower', 'Shadows Into Light',
  'Shadows Into Light Two', 'Amatic SC', 'Patrick Hand', 'Patrick Hand SC',
  'Courgette', 'Cookie', 'Yellowtail', 'Allura', 'Alex Brush', 'Tangerine',
  'Pinyon Script', 'Parisienne', 'Marck Script', 'Bad Script', 'Neucha',
  'Architects Daughter', 'Gloria Hallelujah', 'Handlee', 'Homemade Apple',
  'Kristi', 'La Belle Aurore', 'Leckerli One', 'Loved by the King', 'Meie Script',
  'Merienda', 'Monsieur La Doulaise', 'Mr Dafoe', 'Mr De Haviland',
  'Mrs Saint Delafield', 'Mrs Sheppards', 'Nothing You Could Do', 'Niconne',
  'Norican', 'Over the Rainbow', 'Petit Formal Script', 'Playball',
  'Princess Sofia', 'Quintessential', 'Qwigley', 'Rancho', 'Reenie Beanie',
  'Rochester', 'Rock Salt', 'Rouge Script', 'Ruge Boogie', 'Ruthie', 'Schoolbell',
  'Sedgwick Ave', 'Sedgwick Ave Display', 'Short Stack', 'Sofia', 'Sriracha',
  'Stalemate', 'Sue Ellen Francisco', 'Sunshiney', 'Swanky and Moo Moo',
  'The Girl Next Door', 'Vibur', 'Waiting for the Sunrise', 'Walter Turncoat',
  'Yesteryear', 'Zeyada', 'Arizonia', 'Berkshire Swash', 'Bilbo',
  'Bilbo Swash Caps', 'Bonbon', 'Butterfly Kids', 'Calligraffitti',
  'Cedarville Cursive', 'Charm', 'Charmonman', 'Clicker Script', 'Condiment',
  'Crafty Girls', 'Damion', 'Dawning of a New Day', 'Delius', 'Delius Swash Caps',
  'Delius Unicase', 'Devonshire', 'Dr Sugiyama', 'Eagle Lake', 'Engagement',
  'Euphoria Script', 'Felipa', 'Fondamento', 'Gochi Hand', 'Grand Hotel',
  'Herr Von Muellerhoff', 'Italianno', 'Jim Nightshade', 'Julee',
  'Just Another Hand', 'Just Me Again Down Here', 'Knewave', 'Lovers Quarrel',
  'Meddon', 'Miss Fajardose', 'Montez', 'Moon Dance', 'Allison', 'Birthstone',
  'Birthstone Bounce', 'Bonheur Royale', 'Caramel', 'Cherish', 'Comforter',
  'Comforter Brush', 'Corinthia', 'Ephesis', 'Explora', 'Festive',
  'Fleur De Leah', 'Freehand', 'Grey Qo', 'Gwendolyn', 'Hurricane',
  'Imperial Script', 'Inspiration', 'Island Moments', 'Kolker Brush',
  'Lavishly Yours', 'Licorice', 'Love Light', 'Luxurious Script', 'Mea Culpa',
  'MonteCarlo', 'Ms Madi', 'My Soul', 'Neonderthaw', 'Oooh Baby',
  'Passions Conflict', 'Petemoss', 'Praise', 'Qwitcher Grypen', 'Road Rage',
  'Sassy Frass', 'Send Flowers', 'Shalimar', 'Splash', 'Square Peg',
  'Style Script', 'Tapestry', 'Twinkle Star', 'Updock', 'Vujahday Script',
  'Waterfall', 'Whisper', 'WindSong', 'Seaweed Script',
];

const LATIN_MONO: string[] = [
  'JetBrains Mono', 'Fira Code', 'Source Code Pro', 'IBM Plex Mono', 'Space Mono',
  'Roboto Mono', 'Ubuntu Mono', 'Inconsolata', 'PT Mono', 'Courier Prime',
  'Anonymous Pro', 'Cousine', 'Share Tech Mono', 'Overpass Mono', 'DM Mono',
  'Red Hat Mono', 'Azeret Mono', 'Martian Mono', 'Fragment Mono', 'Syne Mono',
  'Major Mono Display', 'Cutive Mono', 'B612 Mono', 'Oxygen Mono', 'Fira Mono',
  'Chivo Mono', 'Spline Sans Mono', 'Noto Sans Mono', 'Nanum Gothic Coding',
  'Xanh Mono', 'Victor Mono', 'Sometype Mono', 'Kode Mono', 'Nova Mono',
];

// ---------------------------------------------------------------------------
// 2. Native Multi-Language Google Font Suites (50+ Types per Language!)
// ---------------------------------------------------------------------------

interface NativeFamilySeed {
  family: string;
  category: Exclude<FontCategory, 'All'>;
  weights?: number[];
  hasItalic?: boolean;
}

const TELUGU_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans Telugu', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Noto Serif Telugu', category: 'Serif', weights: [300, 400, 600, 700, 900] },
  { family: 'Anek Telugu', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Tiro Telugu', category: 'Serif', weights: [400], hasItalic: true },
  { family: 'Baloo Tammudu 2', category: 'Display', weights: [400, 600, 700, 800] },
  { family: 'Hind Guntur', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Chathura', category: 'Sans-Serif', weights: [300, 400, 700, 800] },
  { family: 'Ramabhadra', category: 'Sans-Serif', weights: [400] },
  { family: 'Ramaraja', category: 'Serif', weights: [400] },
  { family: 'Ravi Prakash', category: 'Display', weights: [400] },
  { family: 'Lakki Reddy', category: 'Handwriting', weights: [400] },
  { family: 'Akaya Telivigala', category: 'Display', weights: [400] },
  { family: 'Gurajada', category: 'Serif', weights: [400] },
  { family: 'Tenali Ramakrishna', category: 'Sans-Serif', weights: [400] },
  { family: 'Timmana', category: 'Display', weights: [400] },
  { family: 'Sree Krushnadevaraya', category: 'Serif', weights: [400] },
  { family: 'Suranna', category: 'Serif', weights: [400] },
  { family: 'Suravaram', category: 'Serif', weights: [400] },
  { family: 'Mallanna', category: 'Sans-Serif', weights: [400] },
  { family: 'Mandali', category: 'Sans-Serif', weights: [400] },
  { family: 'NTR', category: 'Sans-Serif', weights: [400] },
  { family: 'Peddana', category: 'Serif', weights: [400] },
  { family: 'Ponnala', category: 'Display', weights: [400] },
  { family: 'Gidugu', category: 'Display', weights: [400] },
  { family: 'Dhurjati', category: 'Display', weights: [400] },
];

const HINDI_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans Devanagari', category: 'Sans-Serif', weights: [300, 400, 600, 700, 900] },
  { family: 'Noto Serif Devanagari', category: 'Serif', weights: [400, 600, 700, 900] },
  { family: 'Tiro Devanagari Hindi', category: 'Serif', weights: [400], hasItalic: true },
  { family: 'Tiro Devanagari Sanskrit', category: 'Serif', weights: [400], hasItalic: true },
  { family: 'Tiro Devanagari Marathi', category: 'Serif', weights: [400] },
  { family: 'Anek Devanagari', category: 'Sans-Serif', weights: [400, 600, 800] },
  { family: 'Poppins', category: 'Sans-Serif', weights: [400, 600, 700, 800] },
  { family: 'Mukta', category: 'Sans-Serif', weights: [400, 600, 700, 800] },
  { family: 'Hind', category: 'Sans-Serif', weights: [400, 600, 700] },
  { family: 'Baloo 2', category: 'Display', weights: [500, 700, 800] },
  { family: 'Teko', category: 'Display', weights: [400, 600, 700] },
  { family: 'Rajdhani', category: 'Sans-Serif', weights: [500, 700] },
  { family: 'Khand', category: 'Sans-Serif', weights: [500, 700] },
  { family: 'Karma', category: 'Serif', weights: [400, 700] },
  { family: 'Rozha One', category: 'Serif', weights: [400] },
  { family: 'Kalam', category: 'Handwriting', weights: [400, 700] },
  { family: 'Yatra One', category: 'Display', weights: [400] },
  { family: 'Modak', category: 'Display', weights: [400] },
  { family: 'Eczar', category: 'Serif', weights: [500, 700, 800] },
  { family: 'Glegoo', category: 'Serif', weights: [400, 700] },
  { family: 'Halant', category: 'Serif', weights: [400, 700] },
  { family: 'Jaldi', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Kadwa', category: 'Serif', weights: [400, 700] },
  { family: 'Kurale', category: 'Serif', weights: [400] },
  { family: 'Laila', category: 'Serif', weights: [500, 700] },
  { family: 'Martel', category: 'Serif', weights: [400, 700, 900] },
  { family: 'Martel Sans', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Palanquin', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Palanquin Dark', category: 'Display', weights: [500, 700] },
  { family: 'Pragati Narrow', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Ranga', category: 'Display', weights: [400, 700] },
  { family: 'Rhodium Libre', category: 'Serif', weights: [400] },
  { family: 'Sahitya', category: 'Serif', weights: [400, 700] },
  { family: 'Sarala', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Sarpanch', category: 'Display', weights: [500, 700, 900] },
  { family: 'Sumana', category: 'Serif', weights: [400, 700] },
  { family: 'Sura', category: 'Serif', weights: [400, 700] },
  { family: 'Tillana', category: 'Handwriting', weights: [500, 700] },
  { family: 'Vesper Libre', category: 'Serif', weights: [400, 700] },
  { family: 'Yantramanav', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Arya', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Asar', category: 'Serif', weights: [400] },
  { family: 'Bakbak One', category: 'Display', weights: [400] },
  { family: 'Biryani', category: 'Sans-Serif', weights: [400, 700, 800] },
  { family: 'Cambay', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Dekko', category: 'Handwriting', weights: [400] },
  { family: 'Gotu', category: 'Sans-Serif', weights: [400] },
  { family: 'Gajraj One', category: 'Display', weights: [400] },
  { family: 'Inknut Antiqua', category: 'Serif', weights: [600, 800] },
  { family: 'Jaini', category: 'Display', weights: [400] },
  { family: 'Amita', category: 'Handwriting', weights: [400, 700] },
];

const TAMIL_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans Tamil', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Noto Serif Tamil', category: 'Serif', weights: [300, 400, 600, 700, 900], hasItalic: true },
  { family: 'Tiro Tamil', category: 'Serif', weights: [400], hasItalic: true },
  { family: 'Anek Tamil', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Baloo Thambi 2', category: 'Display', weights: [400, 500, 600, 700, 800] },
  { family: 'Catamaran', category: 'Sans-Serif', weights: [300, 400, 600, 700, 800, 900] },
  { family: 'Hind Madurai', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Mukta Malar', category: 'Sans-Serif', weights: [300, 400, 600, 700, 800] },
  { family: 'Arima', category: 'Display', weights: [400, 600, 700] },
  { family: 'Kavivanar', category: 'Handwriting', weights: [400] },
  { family: 'Meera Inimai', category: 'Sans-Serif', weights: [400] },
  { family: 'Pavanam', category: 'Sans-Serif', weights: [400] },
  { family: 'Coiny', category: 'Display', weights: [400] },
  { family: 'Oi', category: 'Display', weights: [400] },
];

const BENGALI_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans Bengali', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Noto Serif Bengali', category: 'Serif', weights: [300, 400, 600, 700, 900] },
  { family: 'Tiro Bangla', category: 'Serif', weights: [400], hasItalic: true },
  { family: 'Anek Bangla', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Baloo Da 2', category: 'Display', weights: [400, 500, 600, 700, 800] },
  { family: 'Hind Siliguri', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Atma', category: 'Display', weights: [300, 400, 500, 600, 700] },
  { family: 'Galada', category: 'Handwriting', weights: [400] },
  { family: 'Mina', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Alkatra', category: 'Display', weights: [400, 600, 700] },
];

const KANNADA_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans Kannada', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Noto Serif Kannada', category: 'Serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Tiro Kannada', category: 'Serif', weights: [400], hasItalic: true },
  { family: 'Anek Kannada', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Baloo Tamma 2', category: 'Display', weights: [400, 500, 600, 700, 800] },
  { family: 'Hind Mysuru', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700] },
  { family: 'Akaya Kanadaka', category: 'Display', weights: [400] },
  { family: 'Benne', category: 'Serif', weights: [400] },
  { family: 'Hubballi', category: 'Sans-Serif', weights: [400] },
  { family: 'Padyakke Expanded One', category: 'Display', weights: [400] },
];

const MALAYALAM_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans Malayalam', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Noto Serif Malayalam', category: 'Serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { family: 'Anek Malayalam', category: 'Sans-Serif', weights: [300, 400, 500, 600, 700, 800] },
  { family: 'Baloo Chettan 2', category: 'Display', weights: [400, 500, 600, 700, 800] },
  { family: 'Manjari', category: 'Sans-Serif', weights: [100, 400, 700] },
  { family: 'Gayathri', category: 'Sans-Serif', weights: [100, 400, 700] },
  { family: 'Chilanka', category: 'Handwriting', weights: [400] },
  { family: 'Arima', category: 'Display', weights: [400, 600, 700] },
];

const ARABIC_SEEDS: NativeFamilySeed[] = [
  { family: 'Cairo', category: 'Sans-Serif', weights: [400, 600, 700, 900] },
  { family: 'Tajawal', category: 'Sans-Serif', weights: [400, 500, 700, 900] },
  { family: 'Almarai', category: 'Sans-Serif', weights: [400, 700, 800] },
  { family: 'Amiri', category: 'Serif', weights: [400, 700], hasItalic: true },
  { family: 'Changa', category: 'Sans-Serif', weights: [400, 600, 700, 800] },
  { family: 'El Messiri', category: 'Serif', weights: [400, 600, 700] },
  { family: 'Lalezar', category: 'Display', weights: [400] },
  { family: 'Lemonada', category: 'Display', weights: [400, 600, 700] },
  { family: 'Mada', category: 'Sans-Serif', weights: [400, 600, 700, 900] },
  { family: 'Markazi Text', category: 'Serif', weights: [400, 600, 700] },
  { family: 'Mirza', category: 'Serif', weights: [400, 600, 700] },
  { family: 'Rakkas', category: 'Display', weights: [400] },
  { family: 'Readex Pro', category: 'Sans-Serif', weights: [400, 600, 700] },
  { family: 'Reem Kufi', category: 'Display', weights: [400, 600, 700] },
  { family: 'Rubik', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Scheherazade New', category: 'Serif', weights: [400, 700] },
  { family: 'Aref Ruqaa', category: 'Handwriting', weights: [400, 700] },
  { family: 'Harmattan', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Jomhuria', category: 'Display', weights: [400] },
  { family: 'Katibeh', category: 'Display', weights: [400] },
  { family: 'Kufam', category: 'Display', weights: [400, 700, 900] },
  { family: 'Lateef', category: 'Serif', weights: [400, 700] },
  { family: 'Marhey', category: 'Display', weights: [400, 700] },
  { family: 'Noto Kufi Arabic', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Noto Naskh Arabic', category: 'Serif', weights: [400, 700] },
  { family: 'Noto Sans Arabic', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Qahiri', category: 'Display', weights: [400] },
  { family: 'Vibes', category: 'Display', weights: [400] },
  { family: 'Alexandria', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Alkalami', category: 'Serif', weights: [400] },
];

const JAPANESE_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans JP', category: 'Sans-Serif', weights: [300, 400, 500, 700, 900] },
  { family: 'Noto Serif JP', category: 'Serif', weights: [400, 600, 700, 900] },
  { family: 'M PLUS 1p', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'M PLUS Rounded 1c', category: 'Display', weights: [400, 700, 800] },
  { family: 'Sawarabi Mincho', category: 'Serif', weights: [400] },
  { family: 'Sawarabi Gothic', category: 'Sans-Serif', weights: [400] },
  { family: 'Kosugi', category: 'Sans-Serif', weights: [400] },
  { family: 'Kosugi Maru', category: 'Display', weights: [400] },
  { family: 'Zen Kaku Gothic New', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Zen Maru Gothic', category: 'Display', weights: [400, 700, 900] },
  { family: 'Zen Old Mincho', category: 'Serif', weights: [400, 700, 900] },
  { family: 'Zen Antique', category: 'Serif', weights: [400] },
  { family: 'Shippori Mincho', category: 'Serif', weights: [400, 700, 800] },
  { family: 'Kaisei Decol', category: 'Serif', weights: [400, 700] },
  { family: 'Kaisei Tokumin', category: 'Serif', weights: [400, 700, 800] },
  { family: 'Kaisei Opti', category: 'Serif', weights: [400, 700] },
  { family: 'Hachi Maru Pop', category: 'Handwriting', weights: [400] },
  { family: 'Yusei Magic', category: 'Handwriting', weights: [400] },
  { family: 'Potta One', category: 'Display', weights: [400] },
  { family: 'Dela Gothic One', category: 'Display', weights: [400] },
  { family: 'DotGothic16', category: 'Monospace', weights: [400] },
  { family: 'Rampart One', category: 'Display', weights: [400] },
  { family: 'Reggae One', category: 'Display', weights: [400] },
  { family: 'RocknRoll One', category: 'Display', weights: [400] },
  { family: 'Stick', category: 'Display', weights: [400] },
  { family: 'Train One', category: 'Display', weights: [400] },
  { family: 'Klee One', category: 'Handwriting', weights: [400, 600] },
  { family: 'Kiwi Maru', category: 'Serif', weights: [400, 500] },
  { family: 'Mochiy Pop One', category: 'Display', weights: [400] },
  { family: 'Yuji Syuku', category: 'Handwriting', weights: [400] },
];

const KOREAN_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans KR', category: 'Sans-Serif', weights: [300, 400, 500, 700, 900] },
  { family: 'Noto Serif KR', category: 'Serif', weights: [400, 600, 700, 900] },
  { family: 'Nanum Gothic', category: 'Sans-Serif', weights: [400, 700, 800] },
  { family: 'Nanum Myeongjo', category: 'Serif', weights: [400, 700, 800] },
  { family: 'Nanum Pen Script', category: 'Handwriting', weights: [400] },
  { family: 'Nanum Brush Script', category: 'Handwriting', weights: [400] },
  { family: 'Black Han Sans', category: 'Display', weights: [400] },
  { family: 'Do Hyeon', category: 'Sans-Serif', weights: [400] },
  { family: 'Jua', category: 'Display', weights: [400] },
  { family: 'Gamja Flower', category: 'Handwriting', weights: [400] },
  { family: 'Hi Melody', category: 'Handwriting', weights: [400] },
  { family: 'Poor Story', category: 'Display', weights: [400] },
  { family: 'Cute Font', category: 'Display', weights: [400] },
  { family: 'East Sea Dokdo', category: 'Handwriting', weights: [400] },
  { family: 'Gaegu', category: 'Handwriting', weights: [400, 700] },
  { family: 'Gothic A1', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Gowun Batang', category: 'Serif', weights: [400, 700] },
  { family: 'Gowun Dodum', category: 'Sans-Serif', weights: [400] },
  { family: 'Gugi', category: 'Display', weights: [400] },
  { family: 'Hahmlet', category: 'Serif', weights: [400, 600, 800] },
  { family: 'IBM Plex Sans KR', category: 'Sans-Serif', weights: [400, 600, 700] },
  { family: 'Kirang Haerang', category: 'Display', weights: [400] },
  { family: 'Single Day', category: 'Handwriting', weights: [400] },
  { family: 'Song Myung', category: 'Serif', weights: [400] },
  { family: 'Stylish', category: 'Sans-Serif', weights: [400] },
  { family: 'Sunflower', category: 'Sans-Serif', weights: [500, 700] },
  { family: 'Yeon Sung', category: 'Display', weights: [400] },
  { family: 'Bagel Fat One', category: 'Display', weights: [400] },
];

const CHINESE_SEEDS: NativeFamilySeed[] = [
  { family: 'Noto Sans SC', category: 'Sans-Serif', weights: [300, 400, 500, 700, 900] },
  { family: 'Noto Serif SC', category: 'Serif', weights: [300, 400, 600, 700, 900] },
  { family: 'Noto Sans TC', category: 'Sans-Serif', weights: [300, 400, 500, 700, 900] },
  { family: 'Noto Serif TC', category: 'Serif', weights: [400, 600, 700, 900] },
  { family: 'ZCOOL XiaoWei', category: 'Serif', weights: [400] },
  { family: 'ZCOOL QingKe HuangYou', category: 'Display', weights: [400] },
  { family: 'ZCOOL KuaiLe', category: 'Display', weights: [400] },
  { family: 'Ma Shan Zheng', category: 'Handwriting', weights: [400] },
  { family: 'Zhi Mang Xing', category: 'Handwriting', weights: [400] },
  { family: 'Liu Jian Mao Cao', category: 'Handwriting', weights: [400] },
  { family: 'Long Cang', category: 'Handwriting', weights: [400] },
  { family: 'LXGW WenKai TC', category: 'Handwriting', weights: [400, 700] },
  { family: 'Cactus Classical Serif', category: 'Serif', weights: [400] },
  { family: 'Chocolate Classical Sans', category: 'Sans-Serif', weights: [400] },
];

const RUSSIAN_SEEDS: NativeFamilySeed[] = [
  { family: 'Roboto', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Montserrat', category: 'Sans-Serif', weights: [500, 700, 900] },
  { family: 'Oswald', category: 'Display', weights: [400, 600, 700] },
  { family: 'PT Sans', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'PT Serif', category: 'Serif', weights: [400, 700] },
  { family: 'Playfair Display', category: 'Serif', weights: [600, 800] },
  { family: 'Rubik', category: 'Sans-Serif', weights: [400, 700, 900] },
  { family: 'Ubuntu', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Merriweather', category: 'Serif', weights: [400, 700] },
  { family: 'Nunito', category: 'Sans-Serif', weights: [600, 800] },
  { family: 'Lora', category: 'Serif', weights: [500, 700] },
  { family: 'Fira Sans', category: 'Sans-Serif', weights: [400, 700] },
  { family: 'Cormorant Garamond', category: 'Serif', weights: [600, 700] },
  { family: 'Comfortaa', category: 'Display', weights: [500, 700] },
  { family: 'Exo 2', category: 'Sans-Serif', weights: [600, 800] },
  { family: 'EB Garamond', category: 'Serif', weights: [500, 700] },
  { family: 'Lobster', category: 'Display', weights: [400] },
  { family: 'Pacifico', category: 'Handwriting', weights: [400] },
  { family: 'Caveat', category: 'Handwriting', weights: [600, 700] },
  { family: 'Russo One', category: 'Display', weights: [400] },
  { family: 'Press Start 2P', category: 'Monospace', weights: [400] },
  { family: 'Kelly Slab', category: 'Display', weights: [400] },
  { family: 'Poiret One', category: 'Display', weights: [400] },
  { family: 'Yeseva One', category: 'Serif', weights: [400] },
  { family: 'Philosopher', category: 'Serif', weights: [400, 700] },
  { family: 'Neucha', category: 'Handwriting', weights: [400] },
  { family: 'Bad Script', category: 'Handwriting', weights: [400] },
  { family: 'Marck Script', category: 'Handwriting', weights: [400] },
  { family: 'Oranienbaum', category: 'Serif', weights: [400] },
  { family: 'Prata', category: 'Serif', weights: [400] },
  { family: 'El Messiri', category: 'Serif', weights: [600, 700] },
  { family: 'Tenor Sans', category: 'Sans-Serif', weights: [400] },
  { family: 'Forum', category: 'Serif', weights: [400] },
  { family: 'Kurale', category: 'Serif', weights: [400] },
  { family: 'Seymour One', category: 'Display', weights: [400] },
];

const WEIGHT_NAMES: Record<number, string> = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

function buildLanguageCatalog(
  lang: Exclude<LanguageId, 'all' | 'english'>,
  seeds: NativeFamilySeed[],
  minTarget: number = 54
): FaviconFontItem[] {
  const list: FaviconFontItem[] = [];
  const usedIds = new Set<string>();

  const pushUnique = (item: FaviconFontItem) => {
    if (!usedIds.has(item.id)) {
      usedIds.add(item.id);
      list.push(item);
    }
  };

  // Pass 1: Primary signature entry for every real native Google Font family
  for (const seed of seeds) {
    const primaryWeight = seed.weights?.includes(700)
      ? 700
      : seed.weights?.[seed.weights.length - 1] || 400;

    pushUnique({
      id: `${lang}-${seed.family.toLowerCase().replace(/\s+/g, '-')}-base`,
      name: seed.family,
      googleFamily: seed.family,
      language: lang,
      category: seed.category,
      weight: primaryWeight,
      renderStyle: 'solid',
    });
  }

  // Pass 2: Distinct native font weights & true italics
  for (const seed of seeds) {
    if (seed.weights && seed.weights.length > 1) {
      for (const w of seed.weights) {
        const wLabel = WEIGHT_NAMES[w] || `${w}`;
        pushUnique({
          id: `${lang}-${seed.family.toLowerCase().replace(/\s+/g, '-')}-w${w}`,
          name: `${seed.family} ${wLabel}`,
          googleFamily: seed.family,
          language: lang,
          category: seed.category,
          weight: w,
          renderStyle: 'solid',
        });
      }
    }
    if (seed.hasItalic) {
      pushUnique({
        id: `${lang}-${seed.family.toLowerCase().replace(/\s+/g, '-')}-italic`,
        name: `${seed.family} Italic`,
        googleFamily: seed.family,
        language: lang,
        category: seed.category,
        weight: 400,
        italic: true,
        renderStyle: 'solid',
      });
    }
  }

  // Pass 3: Typographic width, slant, outline, and shadow styles to guarantee >= minTarget distinct styles
  const modifiers: Array<{
    suffix: string;
    label: string;
    categoryOverride?: Exclude<FontCategory, 'All'>;
    scaleX?: number;
    slant?: number;
    renderStyle?: FontRenderStyle;
    weightBoost?: number;
  }> = [
    { suffix: 'condensed', label: 'Condensed', scaleX: 0.8, weightBoost: 700 },
    { suffix: 'expanded', label: 'Wide', scaleX: 1.16, weightBoost: 700 },
    { suffix: 'oblique', label: 'Oblique', slant: -0.17, weightBoost: 700 },
    { suffix: 'outline', label: 'Outline', categoryOverride: 'Display', renderStyle: 'outline', weightBoost: 700 },
    { suffix: 'shadow', label: '3D Shadow', categoryOverride: 'Display', renderStyle: 'shadow', weightBoost: 700 },
  ];

  for (const mod of modifiers) {
    if (list.length >= minTarget + 4) break;
    for (const seed of seeds) {
      if (list.length >= minTarget + 4) break;
      const w = seed.weights?.includes(mod.weightBoost || 700)
        ? mod.weightBoost || 700
        : seed.weights?.[seed.weights.length - 1] || 400;

      pushUnique({
        id: `${lang}-${seed.family.toLowerCase().replace(/\s+/g, '-')}-${mod.suffix}`,
        name: `${seed.family} ${mod.label}`,
        googleFamily: seed.family,
        language: lang,
        category: mod.categoryOverride || seed.category,
        weight: w,
        scaleX: mod.scaleX,
        slant: mod.slant,
        renderStyle: mod.renderStyle || 'solid',
      });
    }
  }

  return list;
}

function buildEnglishCatalog(): FaviconFontItem[] {
  const list: FaviconFontItem[] = [];
  const seen = new Set<string>();

  const addGroup = (families: string[], category: Exclude<FontCategory, 'All'>, defaultWeight: number) => {
    for (const fam of families) {
      const clean = fam.trim();
      if (!clean || seen.has(clean.toLowerCase())) continue;
      seen.add(clean.toLowerCase());
      list.push({
        id: `en-${clean.toLowerCase().replace(/\s+/g, '-')}`,
        name: clean,
        googleFamily: clean,
        language: 'english',
        category,
        weight: defaultWeight,
        renderStyle: 'solid',
      });
    }
  };

  addGroup(LATIN_SANS, 'Sans-Serif', 700);
  addGroup(LATIN_SERIF, 'Serif', 700);
  addGroup(LATIN_DISPLAY, 'Display', 400);
  addGroup(LATIN_HANDWRITING, 'Handwriting', 400);
  addGroup(LATIN_MONO, 'Monospace', 700);

  // Add Outline & Shadow editions of top geometric/serif English families for extra creative versatility
  const featuredOutline = [
    'Plus Jakarta Sans', 'Montserrat', 'Poppins', 'Oswald', 'Bebas Neue',
    'Playfair Display', 'Cinzel', 'Fredoka', 'Righteous', 'Orbitron',
    'Unbounded', 'Syne', 'Space Grotesk', 'Abril Fatface', 'Anton',
  ];

  for (const fam of featuredOutline) {
    list.push({
      id: `en-${fam.toLowerCase().replace(/\s+/g, '-')}-outline`,
      name: `${fam} Outline`,
      googleFamily: fam,
      language: 'english',
      category: 'Display',
      weight: 800,
      renderStyle: 'outline',
    });
    list.push({
      id: `en-${fam.toLowerCase().replace(/\s+/g, '-')}-shadow`,
      name: `${fam} 3D Shadow`,
      googleFamily: fam,
      language: 'english',
      category: 'Display',
      weight: 800,
      renderStyle: 'shadow',
    });
  }

  return list;
}

export const FAVICON_FONTS: FaviconFontItem[] = [
  ...buildEnglishCatalog(),
  ...buildLanguageCatalog('telugu', TELUGU_SEEDS, 56),
  ...buildLanguageCatalog('hindi', HINDI_SEEDS, 62),
  ...buildLanguageCatalog('tamil', TAMIL_SEEDS, 54),
  ...buildLanguageCatalog('bengali', BENGALI_SEEDS, 54),
  ...buildLanguageCatalog('kannada', KANNADA_SEEDS, 54),
  ...buildLanguageCatalog('malayalam', MALAYALAM_SEEDS, 54),
  ...buildLanguageCatalog('arabic', ARABIC_SEEDS, 56),
  ...buildLanguageCatalog('japanese', JAPANESE_SEEDS, 56),
  ...buildLanguageCatalog('korean', KOREAN_SEEDS, 56),
  ...buildLanguageCatalog('chinese', CHINESE_SEEDS, 54),
  ...buildLanguageCatalog('russian', RUSSIAN_SEEDS, 56),
];

// Count helper per language
export const LANGUAGE_FONT_COUNTS: Record<LanguageId, number> = (() => {
  const counts: Record<LanguageId, number> = {
    all: FAVICON_FONTS.length,
    english: 0,
    telugu: 0,
    hindi: 0,
    tamil: 0,
    bengali: 0,
    kannada: 0,
    malayalam: 0,
    arabic: 0,
    japanese: 0,
    korean: 0,
    chinese: 0,
    russian: 0,
  };
  for (const f of FAVICON_FONTS) {
    counts[f.language] = (counts[f.language] || 0) + 1;
  }
  return counts;
})();

// ---------------------------------------------------------------------------
// 3. On-Demand Google Fonts Loader & Canvas Font Readiness
// ---------------------------------------------------------------------------
const injectedGoogleFamilies = new Set<string>(['Plus Jakarta Sans', 'JetBrains Mono']);
const familyLoadPromises = new Map<string, Promise<void>>();

export function loadGoogleFontsBatch(families: string[]): void {
  if (typeof document === 'undefined') return;
  const toLoad = Array.from(new Set(families)).filter(
    (fam) => fam && !injectedGoogleFamilies.has(fam)
  );
  if (toLoad.length === 0) return;

  // Batch up to 10 families per stylesheet request using Google Fonts CSS v1 (graceful weight fallback)
  const chunkSize = 10;
  for (let i = 0; i < toLoad.length; i += chunkSize) {
    const chunk = toLoad.slice(i, i + chunkSize);
    chunk.forEach((f) => injectedGoogleFamilies.add(f));

    const familyQuery = chunk
      .map((fam) => `${encodeURIComponent(fam)}:300,400,500,600,700,800,900,400italic,700italic`)
      .join('|');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css?family=${familyQuery}&display=swap`;
    document.head.appendChild(link);
  }
}

export async function ensureFontLoaded(font: FaviconFontItem): Promise<void> {
  if (typeof document === 'undefined') return;
  const fam = font.googleFamily;

  if (!injectedGoogleFamilies.has(fam)) {
    injectedGoogleFamilies.add(fam);
    const p = new Promise<void>((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(
        fam
      )}:300,400,500,600,700,800,900,400italic,700italic&display=swap`;
      link.onload = () => resolve();
      link.onerror = () => resolve();
      document.head.appendChild(link);
      setTimeout(resolve, 1200);
    });
    familyLoadPromises.set(fam, p);
  }

  const pendingLink = familyLoadPromises.get(fam);
  if (pendingLink) {
    await pendingLink;
  }

  if (document.fonts && typeof document.fonts.load === 'function') {
    const spec = `${font.italic ? 'italic ' : ''}${font.weight} 64px "${fam}"`;
    try {
      await Promise.race([
        document.fonts.load(spec),
        new Promise((resolve) => setTimeout(resolve, 1000)),
      ]);
    } catch {
      // Ignore font load errors in restricted environments
    }
  }
}

/**
 * Build a genuine multi-resolution binary .ICO file from PNG blobs (16x16, 32x32, 48x48)
 */
export async function createIcoFromPngBlobs(
  icons: Array<{ size: number; blob: Blob }>
): Promise<Blob> {
  const icoSizes = icons.filter((i) => i.size === 16 || i.size === 32 || i.size === 48);
  const selected = icoSizes.length > 0 ? icoSizes : icons.slice(0, 1);

  const buffers = await Promise.all(selected.map((item) => item.blob.arrayBuffer()));
  const count = buffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalHeader = headerSize + dirEntrySize * count;
  const totalBytes = totalHeader + buffers.reduce((sum, b) => sum + b.byteLength, 0);

  const out = new Uint8Array(totalBytes);
  const view = new DataView(out.buffer);

  // ICONDIR header
  view.setUint16(0, 0, true); // Reserved = 0
  view.setUint16(2, 1, true); // Type = 1 (ICO)
  view.setUint16(4, count, true); // Image count

  let offset = totalHeader;
  for (let i = 0; i < count; i++) {
    const size = selected[i].size;
    const pngBytes = new Uint8Array(buffers[i]);
    const dirPos = headerSize + i * dirEntrySize;

    view.setUint8(dirPos + 0, size >= 256 ? 0 : size); // Width
    view.setUint8(dirPos + 1, size >= 256 ? 0 : size); // Height
    view.setUint8(dirPos + 2, 0); // Color palette
    view.setUint8(dirPos + 3, 0); // Reserved
    view.setUint16(dirPos + 4, 1, true); // Color planes
    view.setUint16(dirPos + 6, 32, true); // Bits per pixel
    view.setUint32(dirPos + 8, pngBytes.byteLength, true); // Image byte size
    view.setUint32(dirPos + 12, offset, true); // Offset

    out.set(pngBytes, offset);
    offset += pngBytes.byteLength;
  }

  return new Blob([out], { type: 'image/x-icon' });
}
