import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

function fetchImage(url: string, redirectCount = 0): Promise<NextResponse> {
  return new Promise((resolve) => {
    if (redirectCount > 5) {
      resolve(new NextResponse('Too many redirects', { status: 500 }));
      return;
    }

    https.get(url, { rejectUnauthorized: false }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        const location = res.headers.location;
        if (location) {
          resolve(fetchImage(location, redirectCount + 1));
          return;
        }
      }

      if (res.statusCode !== 200) {
        resolve(new NextResponse(`Failed to fetch image: ${res.statusCode}`, { status: res.statusCode }));
        return;
      }

      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const headers = new Headers();
        headers.set('Content-Type', res.headers['content-type'] || 'image/jpeg');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        resolve(new NextResponse(buffer, { headers }));
      });
    }).on('error', (err) => {
      resolve(new NextResponse(`Error: ${err.message}`, { status: 500 }));
    });
  });
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new NextResponse('Missing URL', { status: 400 });
  }

  try {
    return await fetchImage(url);
  } catch (error: any) {
    return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
  }
}
