import { NextResponse } from 'next/server';
import { sseManager, startGlobalFetching, stopGlobalFetching } from '../../lib/sse-manager';

export async function GET() {
  try {
    const stream = new ReadableStream({
      start(controller) {
        let isClosed = false;
        
        console.log('SSE connection established');
        
        // 초기 환영 메시지 전송
        const welcomeMessage = `data: ${JSON.stringify({ 
          type: 'connected', 
          message: 'SSE connected successfully',
          timestamp: new Date().toISOString()
        })}\n\n`;
        controller.enqueue(new TextEncoder().encode(welcomeMessage));
        
        // 연결 관리자에 추가
        sseManager.addConnection(controller);
        
        // 전역 페칭 시작 (첫 번째 연결 시)
        if (sseManager.getConnectionCount() === 1) {
          startGlobalFetching();
        }

        // 연결 종료 시 정리
        const cleanup = () => {
          if (isClosed) return;
          isClosed = true;
          
          sseManager.removeConnection(controller);
          
          // 마지막 연결이 끊어지면 전역 페칭 중단
          if (sseManager.getConnectionCount() === 0) {
            stopGlobalFetching();
          }
          
          try {
            controller.close();
          } catch (error) {
            // 이미 닫힌 경우 무시
          }
        };

        // 10분 후 자동 종료
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
        'X-Accel-Buffering': 'no', // Nginx 버퍼링 비활성화
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

// OPTIONS 요청 처리
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
