// Map service for fetching static map images
// Uses OpenStreetMap static tiles or fallback to cached images

interface MapImageOptions {
  lat: number;
  lng: number;
  zoom: number;
  width: number;
  height: number;
  style?: string;
}

// Cache for loaded map images to avoid repeated fetches
const mapImageCache = new Map<string, HTMLImageElement>();

/**
 * Generate a unique cache key for map parameters
 */
function getCacheKey(options: MapImageOptions): string {
  return `${options.lat}_${options.lng}_${options.zoom}_${options.width}_${options.height}_${options.style || 'default'}`;
}

/**
 * Get OpenStreetMap tile URL for given coordinates
 */
function getTileUrl(lat: number, lng: number, zoom: number): string {
  // Convert lat/lng to tile coordinates
  const n = Math.pow(2, zoom);
  const xtile = Math.floor((lng + 180) / 360 * n);
  const ytile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
  
  // Use OSM tile server
  const server = ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
  return `https://${server}.tile.openstreetmap.org/${zoom}/${xtile}/${ytile}.png`;
}

/**
 * Apply Avocado style color transformations to canvas
 */
function applyAvocadoStyle(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Convert to HSL for better color manipulation
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r / 255:
          h = ((g - b) / 255 / d + (g < b ? 6 : 0)) / 6;
          break;
        case g / 255:
          h = ((b - r) / 255 / d + 2) / 6;
          break;
        case b / 255:
          h = ((r - g) / 255 / d + 4) / 6;
          break;
      }
    }
    
    // Apply Avocado theme transformations
    // Shift hue towards green (60-120 degrees)
    h = (h * 360 + 60) % 360 / 360;
    
    // Increase saturation for greens, decrease for others
    if (h >= 60/360 && h <= 150/360) {
      s = Math.min(1, s * 1.4); // Boost green saturation
    } else {
      s = s * 0.7; // Desaturate non-greens
    }
    
    // Adjust lightness
    l = Math.min(1, l * 1.1);
    
    // Convert back to RGB
    let newR, newG, newB;
    if (s === 0) {
      newR = newG = newB = l * 255;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      newR = hue2rgb(p, q, h + 1/3) * 255;
      newG = hue2rgb(p, q, h) * 255;
      newB = hue2rgb(p, q, h - 1/3) * 255;
    }
    
    // Apply the Avocado color palette
    // Roads: yellowish (#EBF4A4, #9BBF72, #A4C67D)
    // Water: cyan-ish (#aee2e0)
    // Landscape: green (#abce83)
    // Parks: darker green (#8dab68)
    
    const brightness = (r + g + b) / 3;
    
    // Detect water (blueish areas)
    if (b > r && b > g && brightness > 150) {
      data[i] = 174;     // #aee2e0
      data[i + 1] = 226;
      data[i + 2] = 224;
    }
    // Detect roads (grayish areas)
    else if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && brightness > 200) {
      if (brightness > 240) {
        data[i] = 235;     // #EBF4A4 for highways
        data[i + 1] = 244;
        data[i + 2] = 164;
      } else if (brightness > 220) {
        data[i] = 155;     // #9BBF72 for arterial
        data[i + 1] = 191;
        data[i + 2] = 114;
      } else {
        data[i] = 164;     // #A4C67D for local
        data[i + 1] = 198;
        data[i + 2] = 125;
      }
    }
    // Detect parks (greenish areas)
    else if (g > r && g > b) {
      data[i] = 141;     // #8dab68
      data[i + 1] = 171;
      data[i + 2] = 104;
    }
    // Default landscape
    else {
      data[i] = Math.min(255, newR * 0.7 + 171 * 0.3);     // Blend with #abce83
      data[i + 1] = Math.min(255, newG * 0.7 + 206 * 0.3);
      data[i + 2] = Math.min(255, newB * 0.7 + 131 * 0.3);
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Create a static map image using canvas composition
 */
async function createStaticMapImage(options: MapImageOptions): Promise<HTMLImageElement> {
  const { lat, lng, zoom, width, height, style } = options;
  
  // Create canvas for composing the map - use exact dimensions
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Fill with background color first
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, width, height);
  
  // Calculate how many tiles we need
  const tileSize = 256;
  const tilesX = Math.ceil(width / tileSize) + 2;
  const tilesY = Math.ceil(height / tileSize) + 2;
  
  // Convert center lat/lng to pixel coordinates with exact precision
  const n = Math.pow(2, zoom);
  const latRad = lat * Math.PI / 180;
  const centerX = ((lng + 180) / 360) * n * tileSize;
  const centerY = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * tileSize;
  
  // Calculate top-left corner - ensure exact centering
  const offsetX = Math.floor(centerX - width / 2);
  const offsetY = Math.floor(centerY - height / 2);
  
  // Load and draw tiles
  const tilePromises: Promise<void>[] = [];
  
  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      const tileX = Math.floor(offsetX / tileSize) + x;
      const tileY = Math.floor(offsetY / tileSize) + y;
      
      if (tileX < 0 || tileY < 0 || tileX >= n || tileY >= n) continue;
      
      const promise = new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          const drawX = tileX * tileSize - offsetX;
          const drawY = tileY * tileSize - offsetY;
          ctx.drawImage(img, drawX, drawY);
          resolve();
        };
        
        img.onerror = () => {
          // Draw placeholder for failed tiles
          ctx.fillStyle = '#f0f0f0';
          const drawX = tileX * tileSize - offsetX;
          const drawY = tileY * tileSize - offsetY;
          ctx.fillRect(drawX, drawY, tileSize, tileSize);
          resolve();
        };
        
        // Use OSM tile URL
        const server = ['a', 'b', 'c'][Math.floor(Math.random() * 3)];
        img.src = `https://${server}.tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
      });
      
      tilePromises.push(promise);
    }
  }
  
  // Wait for all tiles to load
  await Promise.all(tilePromises);
  
  // Apply style-specific transformations
  if (style === 'avocado') {
    applyAvocadoStyle(ctx, width, height);
  }
  
  // Convert canvas to image
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = canvas.toDataURL('image/png');
  });
}

/**
 * Fetch a static map image for given coordinates
 * Uses caching to avoid repeated fetches
 */
export async function fetchStaticMapImage(options: MapImageOptions): Promise<HTMLImageElement> {
  const cacheKey = getCacheKey(options);
  
  // Check cache first - but only for same size requests
  // This ensures export gets fresh images at correct resolution
  if (mapImageCache.has(cacheKey)) {
    const cached = mapImageCache.get(cacheKey)!;
    // Verify the cached image matches the requested size
    if (cached.width === options.width && cached.height === options.height) {
      return cached;
    }
  }
  
  try {
    // Create static map image
    const mapImage = await createStaticMapImage(options);
    
    // Cache the result
    mapImageCache.set(cacheKey, mapImage);
    
    return mapImage;
  } catch (error) {
    console.error('Failed to fetch map image:', error);
    
    // Return a placeholder image
    const placeholder = new Image();
    placeholder.width = options.width;
    placeholder.height = options.height;
    
    // Create a gray placeholder
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(0, 0, options.width, options.height);
      ctx.fillStyle = '#999';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Map Loading...', options.width / 2, options.height / 2);
    }
    placeholder.src = canvas.toDataURL();
    
    return placeholder;
  }
}

/**
 * Preload map images for common cities
 */
export async function preloadMapImages(cities: Array<{lat: number, lng: number, name: string}>, zoom: number = 13): Promise<void> {
  const preloadPromises = cities.map(city => 
    fetchStaticMapImage({
      lat: city.lat,
      lng: city.lng,
      zoom,
      width: 1000,
      height: 1000
    })
  );
  
  await Promise.all(preloadPromises);
}

/**
 * Clear the map image cache
 */
export function clearMapCache(): void {
  mapImageCache.clear();
}

/**
 * Get cache size
 */
export function getMapCacheSize(): number {
  return mapImageCache.size;
}