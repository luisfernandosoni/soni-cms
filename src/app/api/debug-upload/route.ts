import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    console.log('[DEBUG_UPLOAD] Request received');
    const contentType = req.headers.get('content-type') || '';
    console.log('[DEBUG_UPLOAD] Content-Type:', contentType);

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      console.log('[DEBUG_UPLOAD] No file found');
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    if (file instanceof File) {
      console.log(`[DEBUG_UPLOAD] File received: ${file.name}, size: ${file.size}, type: ${file.type}`);
      return NextResponse.json({ 
        success: true, 
        name: file.name, 
        size: file.size, 
        type: file.type 
      });
    }

    return NextResponse.json({ error: 'Not a file' }, { status: 400 });
  } catch (error: any) {
    console.error('[DEBUG_UPLOAD] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
