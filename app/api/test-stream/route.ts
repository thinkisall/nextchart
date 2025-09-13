// SSE 연결 테스트용 간단한 API
export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      let counter = 0;
      
      const interval = setInterval(() => {
        const data = {
          timestamp: new Date().toISOString(),
          counter: ++counter,
          message: 'Test message'
        };
        
        const sseData = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(sseData));
        
        console.log('Test SSE sent:', counter);
        
        if (counter > 100) { // 100번 후 종료
          clearInterval(interval);
          controller.close();
        }
      }, 1000); // 1초마다
      
      // 정리 함수
      return () => {
        clearInterval(interval);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
