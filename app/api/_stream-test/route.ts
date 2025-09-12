import { NextResponse } from 'next/server';

// 간단??SSE ?�스???�트�?
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {// 즉시 ?�스??메시지 ?�송
      const testMessage = `data: ${JSON.stringify({
        type: 'test',
        message: 'Hello from SSE test!',
        timestamp: new Date().toISOString()
      })}\n\n`;
      
      controller.enqueue(new TextEncoder().encode(testMessage));
      
      // 3�????�트�?종료
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
