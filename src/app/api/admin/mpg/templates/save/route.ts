import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/admin';
import fs from 'fs';
import path from 'path';

// Paths for templates
const TEMPLATES_DIR = path.join(process.cwd(), 'public/templates');
const JSON_DIR = path.join(TEMPLATES_DIR, 'json');
const IMAGES_DIR = path.join(process.cwd(), 'public/template-previews');

// Ensure directories exist
[TEMPLATES_DIR, JSON_DIR, IMAGES_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// POST /api/admin/mpg/templates/save - Save or update template (Super Admin only)
export async function POST(req: NextRequest) {
  try {
    // Only super admins can save templates
    await requireSuperAdmin(req.headers);

    const body = await req.json();
    const { template, imageData } = body;

    if (!template) {
      return NextResponse.json(
        { error: 'Missing template data' },
        { status: 400 }
      );
    }

    console.log('Saving template:', template.id);

    // Save image if provided
    if (imageData) {
      const base64Data = imageData.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      const imagePath = path.join(IMAGES_DIR, `${template.id}.jpg`);
      fs.writeFileSync(imagePath, buffer);
      console.log('Saved image to:', imagePath);
    }

    // Save JSON data to separate file
    const jsonPath = path.join(JSON_DIR, `${template.id}.json`);
    const templateData = {
      id: template.id,
      name: template.name,
      city: template.city,
      style: template.style,
      hidden: template.hidden || false,
      thumbnail: `/template-previews/${template.id}.jpg`,
      jsonData: template.jsonData,
    };

    fs.writeFileSync(jsonPath, JSON.stringify(templateData, null, 2));
    console.log('Saved JSON to:', jsonPath);

    return NextResponse.json({
      success: true,
      message: 'Template saved successfully',
      templateId: template.id,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json(
      {
        error: message,
        details: error instanceof Error ? error.message : 'Failed to save template'
      },
      { status }
    );
  }
}
