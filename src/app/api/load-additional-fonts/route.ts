import { NextResponse } from 'next/server';

export async function GET() {
  // This is a stub endpoint to load additional fonts when needed
  // The actual font loading will happen automatically via CSS

  // Add a small delay to reduce initial resource contention
  await new Promise(resolve => setTimeout(resolve, 100));

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}