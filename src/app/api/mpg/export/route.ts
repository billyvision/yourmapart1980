import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mpgExportHistory } from '@/lib/schema';
import { auth } from '@/lib/auth';

// POST /api/mpg/export - Track export
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      templateId,
      exportFormat,
      exportSize,
      exportQuality,
      exportDpi,
      fileName,
      fileUrl,
      fileSize,
      isPremiumExport,
      paymentId,
    } = body;

    if (!exportFormat || !exportSize || !exportQuality || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: exportFormat, exportSize, exportQuality, fileName' },
        { status: 400 }
      );
    }

    // Get IP and user agent from request
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;
    const userAgent = req.headers.get('user-agent') || null;

    const [exportRecord] = await db
      .insert(mpgExportHistory)
      .values({
        userId: session.user.id,
        templateId: templateId || null,
        exportFormat,
        exportSize,
        exportQuality,
        exportDpi: exportDpi || 96,
        fileName,
        fileUrl: fileUrl || null,
        fileSize: fileSize || null,
        isPremiumExport: isPremiumExport || false,
        paymentId: paymentId || null,
        ipAddress,
        userAgent,
      })
      .returning();

    return NextResponse.json(exportRecord, { status: 201 });
  } catch (error) {
    console.error('Error tracking export:', error);
    return NextResponse.json(
      { error: 'Failed to track export', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
