import { NextResponse } from 'next/server';

// ê°„ë‹¨??SSE ?ŒìŠ¤???¤íŠ¸ë¦?
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {// ì¦‰ì‹œ ?ŒìŠ¤??ë©”ì‹œì§€ ?„ì†¡
      const testMessage = `data: ${JSON.stringify({
        type: 'test',
        message: 'Hello from SSE test!',
        timestamp: new Date().toISOString()
      })}\n\n`;
      
      controller.enqueue(new TextEncoder().encode(testMessage));
      
      // 3ì´????¤íŠ¸ë¦?ì¢…ë£Œ
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
