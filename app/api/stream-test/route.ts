import { NextResponse } from 'next/server';

// 간단한 SSE 테스트 스트림 
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      console.log('Simple SSE test stream started');
      
      // 즉시 테스트 메시지 전송
      const testMessage = `data: ${JSON.stringify({
        type: 'test',
        message: 'Hello from SSE test!',
        timestamp: new Date().toISOString()
      })}\n\n`;
      
      controller.enqueue(new TextEncoder().encode(testMessage));
      
      // 3초 후 스트림 종료
      setTimeout(() => {
        const closeMessage = `data: ${JSON.stringify({
          type: 'close',
          message: 'Test stream closing...'
        })}\n\n`;
        
        controller.enqueue(new TextEncoder().encode(closeMessage));
        controller.close();
      }, 3000);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
