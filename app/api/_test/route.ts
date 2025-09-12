import { NextResponse } from 'next/server';

// 간단한 테스트 엔드포인트
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'SSE test endpoint is working',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 'unknown'
  });
}
