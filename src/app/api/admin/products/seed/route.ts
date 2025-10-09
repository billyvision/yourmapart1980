import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgProducts, mpgProductSizes, mpgProductVariations } from '@/lib/schema';
import { requireSuperAdmin } from '@/lib/admin';

// POST /api/admin/products/seed - Seed initial product data (SuperAdmin only)
export async function POST(req: NextRequest) {
  try {
    await requireSuperAdmin(req.headers);

    console.log('Starting product seed...');

    // 1. Digital Download
    const [digitalProduct] = await db.insert(mpgProducts).values({
      productType: 'digital',
      name: 'Digital Download',
      description: 'Instant high-resolution PNG + PDF',
      icon: 'FileImage',
      basePrice: 9.99,
      isActive: true,
      displayOrder: 1,
      features: ['300 DPI PNG + PDF', 'Print-ready files', 'Instant download', 'No watermark'],
    }).returning();

    await db.insert(mpgProductSizes).values([
      { productId: digitalProduct.id, sizeValue: '8x10', sizeLabel: '8×10"', dimensions: '8×10"', isPopular: true, displayOrder: 1 },
      { productId: digitalProduct.id, sizeValue: '11x14', sizeLabel: '11×14"', dimensions: '11×14"', isPopular: true, displayOrder: 2 },
      { productId: digitalProduct.id, sizeValue: '12x16', sizeLabel: '12×16"', dimensions: '12×16"', displayOrder: 3 },
      { productId: digitalProduct.id, sizeValue: '16x20', sizeLabel: '16×20"', dimensions: '16×20"', isPopular: true, displayOrder: 4 },
      { productId: digitalProduct.id, sizeValue: '18x24', sizeLabel: '18×24"', dimensions: '18×24"', displayOrder: 5 },
      { productId: digitalProduct.id, sizeValue: '24x36', sizeLabel: '24×36"', dimensions: '24×36"', displayOrder: 6 },
    ]);

    // 2. Paper Poster
    const [posterProduct] = await db.insert(mpgProducts).values({
      productType: 'poster',
      name: 'Paper Poster',
      description: 'Premium matte or semi-gloss finish',
      icon: 'Package',
      image: '/mpg/product-types/poster.png',
      isActive: true,
      displayOrder: 2,
      features: ['Museum-quality paper (170-250 GSM)', 'Acid-free, pH above 7', 'Matte or semi-gloss finish', 'FSC-certified sustainable paper'],
    }).returning();

    await db.insert(mpgProductSizes).values([
      { productId: posterProduct.id, sizeValue: '8x10', sizeLabel: '8×10"', price: 24.99, displayOrder: 1 },
      { productId: posterProduct.id, sizeValue: '11x14', sizeLabel: '11×14"', price: 34.99, isPopular: true, displayOrder: 2 },
      { productId: posterProduct.id, sizeValue: '12x16', sizeLabel: '12×16"', price: 39.99, displayOrder: 3 },
      { productId: posterProduct.id, sizeValue: '16x20', sizeLabel: '16×20"', price: 49.99, isPopular: true, displayOrder: 4 },
      { productId: posterProduct.id, sizeValue: '18x24', sizeLabel: '18×24"', price: 59.99, displayOrder: 5 },
      { productId: posterProduct.id, sizeValue: '24x36', sizeLabel: '24×36"', price: 79.99, displayOrder: 6 },
    ]);

    await db.insert(mpgProductVariations).values([
      { productId: posterProduct.id, variationType: 'posterFinish', variationValue: 'matte', variationLabel: 'Matte', variationDescription: 'Natural, uncoated finish', priceModifier: 0, displayOrder: 1 },
      { productId: posterProduct.id, variationType: 'posterFinish', variationValue: 'semi-gloss', variationLabel: 'Semi-Gloss', variationDescription: 'Subtle silk shine', priceModifier: 2, displayOrder: 2 },
      { productId: posterProduct.id, variationType: 'paperWeight', variationValue: '170gsm', variationLabel: '170 GSM', variationDescription: 'Classic', priceModifier: -5, displayOrder: 1 },
      { productId: posterProduct.id, variationType: 'paperWeight', variationValue: '200gsm', variationLabel: '200 GSM', variationDescription: 'Premium', priceModifier: 0, displayOrder: 2 },
      { productId: posterProduct.id, variationType: 'paperWeight', variationValue: '250gsm', variationLabel: '250 GSM', variationDescription: 'Museum', priceModifier: 8, displayOrder: 3 },
    ]);

    // 3. Canvas Wrap
    const [canvasProduct] = await db.insert(mpgProducts).values({
      productType: 'canvas-wrap',
      name: 'Canvas Print',
      description: 'Gallery-wrapped, ready to hang',
      icon: 'Package',
      image: '/mpg/product-types/canvas.png',
      isActive: true,
      displayOrder: 3,
      features: ['FSC-certified wood stretcher bars', 'Cotton-polyester blend (300-350gsm)', 'Slim (2cm) or Thick (4cm) options', 'Hanging kit included'],
    }).returning();

    await db.insert(mpgProductSizes).values([
      { productId: canvasProduct.id, sizeValue: '12x16', sizeLabel: '12×16"', price: 74.99, displayOrder: 1 },
      { productId: canvasProduct.id, sizeValue: '16x20', sizeLabel: '16×20"', price: 89.99, isPopular: true, displayOrder: 2 },
      { productId: canvasProduct.id, sizeValue: '18x24', sizeLabel: '18×24"', price: 109.99, isPopular: true, displayOrder: 3 },
      { productId: canvasProduct.id, sizeValue: '20x24', sizeLabel: '20×24"', price: 129.99, displayOrder: 4 },
      { productId: canvasProduct.id, sizeValue: '24x36', sizeLabel: '24×36"', price: 159.99, displayOrder: 5 },
    ]);

    await db.insert(mpgProductVariations).values([
      { productId: canvasProduct.id, variationType: 'canvasThickness', variationValue: 'slim', variationLabel: 'Slim (2cm)', variationDescription: 'Modern, lightweight profile', priceModifier: -10, displayOrder: 1 },
      { productId: canvasProduct.id, variationType: 'canvasThickness', variationValue: 'thick', variationLabel: 'Thick (4cm)', variationDescription: 'Gallery depth, bold presence', priceModifier: 0, displayOrder: 2 },
    ]);

    // 4. Framed Print
    const [framedProduct] = await db.insert(mpgProducts).values({
      productType: 'framed',
      name: 'Framed Print',
      description: 'Premium wooden frame included',
      icon: 'Package',
      image: '/mpg/product-types/framed.png',
      image2: '/mpg/product-types/framed-2.webp',
      isActive: true,
      displayOrder: 4,
      features: ['Responsibly sourced oak/ash wood', '20mm thick frame (wider profile)', 'Shatterproof plexiglass protection', 'Ready-to-hang kit included'],
    }).returning();

    await db.insert(mpgProductSizes).values([
      { productId: framedProduct.id, sizeValue: '8x10', sizeLabel: '8×10"', price: 69.99, displayOrder: 1 },
      { productId: framedProduct.id, sizeValue: '11x14', sizeLabel: '11×14"', price: 89.99, displayOrder: 2 },
      { productId: framedProduct.id, sizeValue: '12x16', sizeLabel: '12×16"', price: 99.99, displayOrder: 3 },
      { productId: framedProduct.id, sizeValue: '16x20', sizeLabel: '16×20"', price: 119.99, isPopular: true, displayOrder: 4 },
      { productId: framedProduct.id, sizeValue: '18x24', sizeLabel: '18×24"', price: 149.99, displayOrder: 5 },
    ]);

    await db.insert(mpgProductVariations).values([
      { productId: framedProduct.id, variationType: 'frameColor', variationValue: 'black', variationLabel: 'Black', priceModifier: 0, metadata: { color: '#1a1a1a' }, displayOrder: 1 },
      { productId: framedProduct.id, variationType: 'frameColor', variationValue: 'natural', variationLabel: 'Natural Wood', priceModifier: 0, metadata: { color: '#d4a574' }, displayOrder: 2 },
      { productId: framedProduct.id, variationType: 'frameColor', variationValue: 'dark-brown', variationLabel: 'Dark Brown', priceModifier: 0, metadata: { color: '#3e2723' }, displayOrder: 3 },
      { productId: framedProduct.id, variationType: 'frameColor', variationValue: 'oak', variationLabel: 'Oak', priceModifier: 5, metadata: { color: '#c19a6b' }, displayOrder: 4 },
      { productId: framedProduct.id, variationType: 'frameColor', variationValue: 'ash', variationLabel: 'Ash', priceModifier: 5, metadata: { color: '#e8d5c4' }, displayOrder: 5 },
    ]);

    // 5. Acrylic Print
    const [acrylicProduct] = await db.insert(mpgProducts).values({
      productType: 'acrylic',
      name: 'Acrylic Print',
      description: 'Crystal-clear acrylic with glossy finish',
      icon: 'Sparkles',
      image: '/mpg/product-types/acrylic.png',
      isActive: true,
      displayOrder: 5,
      features: ['4mm crystal-clear acrylic', 'Glossy glass-like finish', 'Straight-cut corners', 'Corner mounting hardware included'],
    }).returning();

    await db.insert(mpgProductSizes).values([
      { productId: acrylicProduct.id, sizeValue: '8x10', sizeLabel: '8×10"', price: 79.99, displayOrder: 1 },
      { productId: acrylicProduct.id, sizeValue: '11x14', sizeLabel: '11×14"', price: 99.99, displayOrder: 2 },
      { productId: acrylicProduct.id, sizeValue: '12x16', sizeLabel: '12×16"', price: 119.99, displayOrder: 3 },
      { productId: acrylicProduct.id, sizeValue: '16x20', sizeLabel: '16×20"', price: 149.99, isPopular: true, displayOrder: 4 },
      { productId: acrylicProduct.id, sizeValue: '18x24', sizeLabel: '18×24"', price: 179.99, displayOrder: 5 },
      { productId: acrylicProduct.id, sizeValue: '20x30', sizeLabel: '20×30"', price: 219.99, displayOrder: 6 },
    ]);

    // 6. Metal Print
    const [metalProduct] = await db.insert(mpgProducts).values({
      productType: 'metal',
      name: 'Metal Print',
      description: 'Aluminum DIBOND® with matte finish',
      icon: 'Package',
      image: '/mpg/product-types/metal.png',
      isActive: true,
      displayOrder: 6,
      features: ['Aluminum DIBOND® (3mm thick)', 'Matte glare-free finish', 'Two aluminum layers + black core', 'Mounting kit included'],
    }).returning();

    await db.insert(mpgProductSizes).values([
      { productId: metalProduct.id, sizeValue: '8x10', sizeLabel: '8×10"', price: 69.99, displayOrder: 1 },
      { productId: metalProduct.id, sizeValue: '11x14', sizeLabel: '11×14"', price: 89.99, displayOrder: 2 },
      { productId: metalProduct.id, sizeValue: '12x16', sizeLabel: '12×16"', price: 109.99, displayOrder: 3 },
      { productId: metalProduct.id, sizeValue: '16x20', sizeLabel: '16×20"', price: 139.99, isPopular: true, displayOrder: 4 },
      { productId: metalProduct.id, sizeValue: '18x24', sizeLabel: '18×24"', price: 169.99, displayOrder: 5 },
      { productId: metalProduct.id, sizeValue: '24x36', sizeLabel: '24×36"', price: 229.99, displayOrder: 6 },
    ]);

    return NextResponse.json({
      success: true,
      message: 'Products seeded successfully',
      products: [
        { id: digitalProduct.id, name: 'Digital Download' },
        { id: posterProduct.id, name: 'Paper Poster' },
        { id: canvasProduct.id, name: 'Canvas Print' },
        { id: framedProduct.id, name: 'Framed Print' },
        { id: acrylicProduct.id, name: 'Acrylic Print' },
        { id: metalProduct.id, name: 'Metal Print' },
      ],
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') || message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
