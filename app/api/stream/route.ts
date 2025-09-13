import { NextResponse } from 'next/server';
import { sseManager, startGlobalFetching, stopGlobalFetching } from '../../lib/sse-manager';

export async function GET() {
  console.log('🔗 SSE connection requested at:', new Date().toLocaleTimeString());
  
  try {
    const stream = new ReadableStream({
      start(controller) {
        let isClosed = false;
        
        console.log('📡 SSE stream started');
        
        // 초기 연결 메시지 전송
        const welcomeMessage = `data: ${JSON.stringify({ 
          type: 'connected', 
          message: 'SSE connected successfully',
          timestamp: new Date().toISOString()
        })}\n\n`;
        controller.enqueue(new TextEncoder().encode(welcomeMessage));
        
        // 연결 관리자에 추가
        sseManager.addConnection(controller);
        
        console.log('👥 Connection count:', sseManager.getConnectionCount());
        
        // 글로벌 페칭 시작 (첫번째 연결 시)
        if (sseManager.getConnectionCount() === 1) {
          console.log('🚀 Starting global fetching...');
          startGlobalFetching();
        }

        // 연결 종료 시 처리
        const cleanup = () => {
          if (isClosed) return;
          isClosed = true;
          
          sseManager.removeConnection(controller);
          
          // 마�?�??�결???�어지�??�역 ?�칭 중단
          if (sseManager.getConnectionCount() === 0) {
            stopGlobalFetching();
          }
          
          try {
            controller.close();
          } catch (error) {
            // ?��? ?�힌 경우 무시
          }
        };

        // 10�????�동 종료
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
        'X-Accel-Buffering': 'no', // Nginx 버퍼�?비활?�화
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

// OPTIONS ?�청 처리
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
