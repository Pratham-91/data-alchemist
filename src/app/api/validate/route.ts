import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest) {
  // Placeholder: handle data validation
  return NextResponse.json({ message: 'Data validation endpoint' });
} 