import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/admin';
import fs from 'fs';
import path from 'path';

const JSON_DIR = path.join(process.cwd(), 'public/templates/json');

// POST /api/admin/mpg/templates/toggle-visibility - Toggle template visibility (Super Admin only)
export async function POST(req: NextRequest) {
  try {
    // Only super admins can toggle visibility
    await requireSuperAdmin(req.headers);

    const body = await req.json();
    const { templateId, hidden } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Missing template ID' },
        { status: 400 }
      );
    }

    console.log('Toggling visibility for:', templateId, 'to:', hidden);

    // Read the JSON file
    const jsonPath = path.join(JSON_DIR, `${templateId}.json`);

    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const templateData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    templateData.hidden = hidden;

    // Save updated JSON
    fs.writeFileSync(jsonPath, JSON.stringify(templateData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Template visibility updated',
      templateId,
      hidden,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json(
      {
        error: message,
        details: error instanceof Error ? error.message : 'Failed to toggle template visibility'
      },
      { status }
    );
  }
}
