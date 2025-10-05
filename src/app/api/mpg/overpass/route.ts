import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy endpoint for Overpass API to avoid CORS issues
 * Used by MPG to fetch OpenStreetMap data for map rendering
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: `data=${encodeURIComponent(query)}`
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Overpass proxy error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch map data',
        message: error.message
      },
      { status: 500 }
    );
  }
}
