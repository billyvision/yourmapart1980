// Map Poster Generator Constants

export const MPG_CANVAS_SIZES = {
  A4: { width: 2480, height: 3508, label: 'A4 (210×297mm)', aspectRatio: 0.707 },
  Letter: { width: 2550, height: 3300, label: 'Letter (8.5×11")', aspectRatio: 0.773 },
  Square: { width: 3000, height: 3000, label: 'Square (12×12")', aspectRatio: 1 },
  Portrait: { width: 2400, height: 3200, label: 'Portrait (3:4)', aspectRatio: 0.75 },
  Landscape: { width: 3200, height: 2400, label: 'Landscape (4:3)', aspectRatio: 1.333 },
};

export const MPG_PREVIEW_SIZES = {
  desktop: { width: 500, height: 667 }, // 3:4 ratio
  mobile: { width: 320, height: 427 },
  miniPreview: { width: 128, height: 171, scale: 0.4 }
};

// Map styles are now handled by Snazzy Maps integration
// This is kept for backwards compatibility but points to Snazzy styles
export const MPG_MAP_STYLES = [
  {
    id: 'midnight',
    name: 'Midnight',
    filter: 'none',
    tileProvider: 'osm',
    preview: { bg: '#08304b', border: '#021019', water: '#021019' }
  },
  {
    id: 'avocado',
    name: 'Avocado',
    filter: 'none',
    tileProvider: 'osm',
    preview: { bg: '#abce83', border: '#8dab68', water: '#aee2e0' }
  },
  {
    id: 'cleanGray',
    name: 'Clean Gray',
    filter: 'none',
    tileProvider: 'osm',
    preview: { bg: '#f2f2f2', border: '#eeeeee', water: '#c8d7d4' }
  },
  {
    id: 'maritime',
    name: 'Maritime',
    filter: 'none',
    tileProvider: 'osm',
    preview: { bg: '#1e3a5f', border: '#ffffff', water: '#87ceeb' }
  },
  {
    id: 'forest',
    name: 'Forest',
    filter: 'none',
    tileProvider: 'osm',
    preview: { bg: '#4a7c4a', border: '#f5f1e6', water: '#5a8c5a' }
  },
  {
    id: 'storm',
    name: 'Urban Shadow',
    filter: 'none',
    tileProvider: 'osm',
    preview: { bg: '#2d2d2d', border: '#d4c4a0', water: '#3a3a3a' }
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    filter: 'none',
    tileProvider: 'osm',
    preview: { bg: '#ffffff', border: '#4a90e2', water: '#b3d4fc' }
  }
];

export const MPG_TILE_PROVIDERS = {
  'osm': {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  'cartodb-light': {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution: '© CartoDB'
  },
  'cartodb-dark': {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    attribution: '© CartoDB'
  },
  'stamen-toner': {
    url: 'https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
    attribution: '© Stamen Design'
  },
  'stamen-watercolor': {
    url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    attribution: '© Stamen Design'
  }
};

export const MPG_PRESET_CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.0060, country: 'United States' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'United Kingdom' },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia' },
  { name: 'Barcelona', lat: 41.3851, lng: 2.1734, country: 'Spain' },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore' },
  { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
  { name: 'Rome', lat: 41.9028, lng: 12.4964, country: 'Italy' },
  { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany' },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada' }
];

export const MPG_HEADLINE_FONTS = [
  // Modern Sans-Serif (Clean & Professional)
  { id: 'montserrat', name: 'Montserrat', family: 'Montserrat', type: 'modern' },
  { id: 'raleway', name: 'Raleway', family: 'Raleway', type: 'modern' },
  { id: 'roboto', name: 'Roboto', family: 'Roboto', type: 'modern' },
  { id: 'lato', name: 'Lato', family: 'Lato', type: 'modern' },
  { id: 'oswald', name: 'Oswald', family: 'Oswald', type: 'modern' },
  
  // Display & Impact (Bold Statements)
  { id: 'bebas-neue', name: 'Bebas Neue', family: 'Bebas Neue', type: 'display' },
  { id: 'anton', name: 'Anton', family: 'Anton', type: 'display' },
  { id: 'archivo-black', name: 'Archivo Black', family: 'Archivo Black', type: 'display' },
  { id: 'ultra', name: 'Ultra', family: 'Ultra', type: 'display' },
  { id: 'titan-one', name: 'Titan One', family: 'Titan One', type: 'display' },
  { id: 'fredoka-one', name: 'Fredoka One', family: 'Fredoka One', type: 'display' },
  { id: 'righteous', name: 'Righteous', family: 'Righteous', type: 'display' },
  { id: 'bungee', name: 'Bungee', family: 'Bungee', type: 'display' },
  { id: 'black-ops-one', name: 'Black Ops One', family: 'Black Ops One', type: 'display' },
  
  // Tech & Gaming (Modern Digital)
  { id: 'orbitron', name: 'Orbitron', family: 'Orbitron', type: 'tech' },
  { id: 'russo-one', name: 'Russo One', family: 'Russo One', type: 'tech' },
  { id: 'press-start-2p', name: 'Press Start 2P', family: 'Press Start 2P', type: 'tech' },
  
  // Elegant Serif (Classic & Sophisticated)
  { id: 'playfair-display', name: 'Playfair Display', family: 'Playfair Display', type: 'serif' },
  
  // Script & Handwritten (Personal Touch)
  { id: 'pacifico', name: 'Pacifico', family: 'Pacifico', type: 'script' },
  { id: 'lobster', name: 'Lobster', family: 'Lobster', type: 'script' },
  { id: 'dancing-script', name: 'Dancing Script', family: 'Dancing Script', type: 'script' },
  { id: 'kaushan-script', name: 'Kaushan Script', family: 'Kaushan Script', type: 'script' },
  { id: 'satisfy', name: 'Satisfy', family: 'Satisfy', type: 'script' },
  { id: 'caveat', name: 'Caveat', family: 'Caveat', type: 'script' },
  { id: 'courgette', name: 'Courgette', family: 'Courgette', type: 'script' },
  { id: 'yellowtail', name: 'Yellowtail', family: 'Yellowtail', type: 'script' },
  { id: 'alex-brush', name: 'Alex Brush', family: 'Alex Brush', type: 'script' },
  { id: 'sacramento', name: 'Sacramento', family: 'Sacramento', type: 'script' },
  { id: 'cookie', name: 'Cookie', family: 'Cookie', type: 'script' },
  { id: 'tangerine', name: 'Tangerine', family: 'Tangerine', type: 'script' },
  { id: 'pinyon-script', name: 'Pinyon Script', family: 'Pinyon Script', type: 'script' },
  { id: 'great-vibes', name: 'Great Vibes', family: 'Great Vibes', type: 'script' },
  { id: 'allura', name: 'Allura', family: 'Allura', type: 'script' },
  
  // Fun & Playful (Creative)
  { id: 'amatic-sc', name: 'Amatic SC', family: 'Amatic SC', type: 'playful' },
  { id: 'kalam', name: 'Kalam', family: 'Kalam', type: 'playful' }
];

export const MPG_FONTS = {
  title: [
    { id: 'playfair', name: 'Playfair Display', family: 'Playfair Display' },
    { id: 'montserrat', name: 'Montserrat', family: 'Montserrat' },
    { id: 'bebas', name: 'Bebas Neue', family: 'Bebas Neue' },
    { id: 'roboto', name: 'Roboto', family: 'Roboto' },
    { id: 'lato', name: 'Lato', family: 'Lato' },
    { id: 'oswald', name: 'Oswald', family: 'Oswald' }
  ],
  subtitle: [
    { id: 'roboto', name: 'Roboto', family: 'Roboto' },
    { id: 'montserrat', name: 'Montserrat', family: 'Montserrat' },
    { id: 'lato', name: 'Lato', family: 'Lato' },
    { id: 'opensans', name: 'Open Sans', family: 'Open Sans' }
  ]
};

export const MPG_FRAME_STYLES = [
  { id: 'square', name: 'Square', className: 'rounded-none' },
  { id: 'circle', name: 'Circle', className: 'rounded-full' },
  { id: 'heart', name: 'Heart', className: 'rounded-none' },
  { id: 'house', name: 'House', className: 'rounded-none' }
];

export const MPG_DEFAULT_CONFIG = {
  city: 'New York',
  lat: 40.7128,
  lng: -74.0060,
  country: 'United States',
  zoom: 13,
  style: 'blueprint2',  // Default to Blueprint 2
  frameStyle: 'square' as 'square' | 'circle' | 'heart' | 'house',
  showCoordinates: true,
  showCountry: true,
  customText: '',
  customTextFont: 'Montserrat',
  customTextSize: 'M' as 'S' | 'M' | 'L',
  customTextFontWeight: '400' as '400' | '700',
  titleFont: 'playfair',
  subtitleFont: 'roboto',
  letterSpacing: 8,
  textSpacing: 1.2,
  exportFormat: 'png' as 'png' | 'jpg' | 'pdf',
  exportSize: 'A4',
  exportQuality: 0.95
};

export const MPG_ZOOM_LEVELS = {
  min: 10,
  max: 18,
  default: 13,
  cityView: 12,
  neighborhoodView: 14,
  streetView: 16
};

export const MPG_EXPORT_FORMATS = [
  { id: 'png', name: 'PNG', mimeType: 'image/png', extension: '.png' },
  { id: 'jpg', name: 'JPG', mimeType: 'image/jpeg', extension: '.jpg' },
  { id: 'pdf', name: 'PDF', mimeType: 'application/pdf', extension: '.pdf' }
];

export const MPG_PIN_STYLES = [
  { id: 'basic', name: 'Basic', description: 'Classic location pin' },
  { id: 'fave', name: 'Fave', description: 'Heart-shaped pin' },
  { id: 'lolli', name: 'Lolli', description: 'Lollipop style pin' },
  { id: 'heart', name: 'Heart', description: 'Solid heart marker' },
  { id: 'home', name: 'Home', description: 'House-shaped marker' }
];

export const MPG_PIN_COLORS = [
  { id: 'coral', name: 'Coral', color: '#FF6B6B' },
  { id: 'sage', name: 'Sage', color: '#8FBC8F' },
  { id: 'navy', name: 'Navy', color: '#2C3E50' },
  { id: 'gold', name: 'Gold', color: '#FFD700' },
  { id: 'pink', name: 'Pink', color: '#FFB6C1' },
  { id: 'teal', name: 'Teal', color: '#008B8B' },
  { id: 'purple', name: 'Purple', color: '#9B59B6' },
  { id: 'black', name: 'Black', color: '#2C2C2C' }
];

export const MPG_TEXT_STYLES = {
  title: {
    fontSize: 36,
    fontWeight: 300,
    letterSpacing: 8,
    textTransform: 'uppercase' as const,
    color: '#333333'
  },
  coordinates: {
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 2,
    color: '#888888'
  },
  country: {
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 4,
    textTransform: 'uppercase' as const,
    color: '#666666'
  },
  customText: {
    fontSize: 18,
    fontWeight: 400,
    fontStyle: 'italic',
    color: '#666666'
  }
};