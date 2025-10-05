import { NextRequest, NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/lib/admin';
import fs from 'fs';
import path from 'path';

const JSON_DIR = path.join(process.cwd(), 'public/templates/json');
const IMAGES_DIR = path.join(process.cwd(), 'public/template-previews');

// DELETE /api/admin/mpg/templates/delete - Delete template (Super Admin only)
export async function DELETE(req: NextRequest) {
  try {
    // Only super admins can delete templates
    await requireSuperAdmin(req.headers);

    const body = await req.json();
    const { templateId } = body;

    if (!templateId) {
      return NextResponse.json(
        { error: 'Missing template ID' },
        { status: 400 }
      );
    }

    console.log('Deleting template:', templateId);

    // Delete JSON file
    const jsonPath = path.join(JSON_DIR, `${templateId}.json`);
    if (fs.existsSync(jsonPath)) {
      fs.unlinkSync(jsonPath);
      console.log('Deleted JSON:', jsonPath);
    }

    // Delete image file
    const imagePath = path.join(IMAGES_DIR, `${templateId}.jpg`);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log('Deleted image:', imagePath);
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
      templateId,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('Unauthorized') ? 401 : message.includes('Forbidden') ? 403 : 500;
    return NextResponse.json(
      {
        error: message,
        details: error instanceof Error ? error.message : 'Failed to delete template'
      },
      { status }
    );
  }
}
