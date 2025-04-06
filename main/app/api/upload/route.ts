import { NextRequest, NextResponse } from 'next/server';
import { processPitchDeck } from '@/lib/mistral';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File;

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await processPitchDeck(buffer);

  return NextResponse.json(result);
}
