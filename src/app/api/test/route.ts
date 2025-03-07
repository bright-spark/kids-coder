
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString() 
  });
}
import { NextResponse } from 'next/server';

// Simple test endpoint to verify API routing is working
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}
