import { NextResponse } from 'next/server';
import { sseManager, startGlobalFetching, stopGlobalFetching } from '../../lib/sse-manager';

export async function GET() {
  try {
    const stream = new ReadableStream({
      start(controller) {
        let isClosed = false;// ì´ˆê¸° ?˜ì˜ ë©”ì‹œì§€ ?„ì†¡
        const welcomeMessage = `data: ${JSON.stringify({ 
          type: 'connected', 
          message: 'SSE connected successfully',
          timestamp: new Date().toISOString()
        })}\n\n`;
        controller.enqueue(new TextEncoder().encode(welcomeMessage));
        
        // ?°ê²° ê´€ë¦¬ì??ì¶”ê?
        sseManager.addConnection(controller);
        
        // ?„ì—­ ?˜ì¹­ ?œì‘ (ì²?ë²ˆì§¸ ?°ê²° ??
        if (sseManager.getConnectionCount() === 1) {
          startGlobalFetching();
        }

        // ?°ê²° ì¢…ë£Œ ???•ë¦¬
        const cleanup = () => {
          if (isClosed) return;
          isClosed = true;
          
          sseManager.removeConnection(controller);
          
          // ë§ˆì?ë§??°ê²°???Šì–´ì§€ë©??„ì—­ ?˜ì¹­ ì¤‘ë‹¨
          if (sseManager.getConnectionCount() === 0) {
            stopGlobalFetching();
          }
          
          try {
            controller.close();
          } catch (error) {
            // ?´ë? ?«íŒ ê²½ìš° ë¬´ì‹œ
          }
        };

        // 10ë¶????ë™ ì¢…ë£Œ
        setTimeout(cleanup, 10 * 60 * 1000);
        
        return cleanup;
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control',
        'X-Accel-Buffering': 'no', // Nginx ë²„í¼ë§?ë¹„í™œ?±í™”
      },
    });
  } catch (error) {
    console.error('SSE route error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create SSE stream' }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// OPTIONS ?”ì²­ ì²˜ë¦¬
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
