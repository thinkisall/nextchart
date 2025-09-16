import emailjs from '@emailjs/browser';
import type { FeatureRequest, EmailTemplate } from '../types';

/**
 * 이메일 전송 서비스
 * EmailJS를 사용하여 기능 요청을 이메일로 전송
 */
export class EmailService {
  
  // EmailJS 설정
  private static readonly SERVICE_ID = 'service_5cgxi7h';
  private static readonly TEMPLATE_ID = 'template_b48xnbm';
  private static readonly PUBLIC_KEY = 'KIVQU5JLPR3XSOSUFFGWYKSGGNXUOZQZPZME26QSHIMTAHYDPYKR6LDAGIXEWFD6';
  private static readonly USE_DUMMY_MODE = false; // 실제 이메일 전송 활성화!
  
  // Gmail 주소로 변경
  private static readonly ENCODED_EMAIL = 'dGhpbmtpc2FsbEBnbWFpbC5jb20='; // thinkisall@gmail.com
  
  private static getAdminEmail(): string {
    return atob(this.ENCODED_EMAIL);
  }

  /**
   * EmailJS 초기화
   */
  static initialize() {
    try {
      // 브라우저 환경에서만 초기화
      if (typeof window !== 'undefined' && emailjs) {
        emailjs.init(this.PUBLIC_KEY);
        console.log('EmailJS 초기화 성공');
        return true;
      } else {
        console.warn('EmailJS가 로드되지 않았거나 서버 환경입니다.');
        return false;
      }
    } catch (error) {
      console.error('EmailJS 초기화 실패:', error);
      return false;
    }
  }

  /**
   * 기능 요청을 이메일로 전송
   */
  static async sendFeatureRequest(request: FeatureRequest): Promise<boolean> {
    try {
      // 보안 검증
      if (!this.validateRequest(request)) {
        console.error('유효하지 않은 요청입니다.');
        return false;
      }

      // 더미 모드 확인
      if (this.USE_DUMMY_MODE) {
        console.log('🚀 더미 모드: 실제 이메일 전송 대신 콘솔 출력');
        console.log('📧 전송될 이메일 내용:', {
          받는사람: this.getAdminEmail(),
          보낸사람: request.userName || '익명 사용자',
          이메일: request.userEmail || '미제공',
          제목: `[${this.getTypeLabel(request.type)}] ${request.title}`,
          내용: this.formatMessage(request),
          시간: request.timestamp.toLocaleString('ko-KR')
        });
        
        // 전송 시뮬레이션 (1초 대기)
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('✅ 더미 전송 완료!');
        return true;
      }

      // 브라우저 환경 확인
      if (typeof window === 'undefined') {
        console.error('서버 환경에서는 이메일을 전송할 수 없습니다.');
        return false;
      }

      // EmailJS 로드 확인
      if (typeof emailjs === 'undefined') {
        console.error('EmailJS 라이브러리가 로드되지 않았습니다.');
        return false;
      }

      console.log('📧 기능 요청 전송 시작:', {
        type: this.getTypeLabel(request.type),
        title: request.title,
        adminEmail: this.getAdminEmail()
      });

      // EmailJS 초기화
      const initResult = this.initialize();
      if (!initResult) {
        console.error('EmailJS 초기화에 실패했습니다.');
        return false;
      }

      const templateParams = {
        to_email: this.getAdminEmail(),
        from_name: request.userName || '익명 사용자',
        from_email: request.userEmail || 'noreply@damoabom.com',
        subject: `[${this.getTypeLabel(request.type)}] ${request.title}`,
        message: this.formatMessage(request),
        request_type: this.getTypeLabel(request.type),
        priority: this.getPriorityLabel(request.priority),
        timestamp: request.timestamp.toLocaleString('ko-KR'),
        page_url: request.currentPage,
        user_agent: request.userAgent || 'Unknown'
      };

      console.log('전송할 템플릿 파라미터:', templateParams);

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      );

      console.log('이메일 전송 성공:', response);
      return response.status === 200;

    } catch (error) {
      console.error('이메일 전송 실패:', error);
      
      // 더 자세한 에러 정보 출력
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
      }
      
      return false;
    }
  }

  /**
   * 요청 타입 라벨 반환
   */
  private static getTypeLabel(type: FeatureRequest['type']): string {
    const labels = {
      feature: '🚀 새 기능 요청',
      bug: '🐛 버그 신고',
      improvement: '✨ 개선 제안',
      question: '❓ 문의사항'
    };
    return labels[type];
  }

  /**
   * 우선순위 라벨 반환
   */
  private static getPriorityLabel(priority: FeatureRequest['priority']): string {
    const labels = {
      low: '낮음',
      medium: '보통',
      high: '높음'
    };
    return labels[priority];
  }

  /**
   * 이메일 메시지 포맷팅
   */
  private static formatMessage(request: FeatureRequest): string {
    return `
🌟 다모아봄 웹사이트 사용자 피드백 🌟

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 기본 정보
🏷️ 분류: ${this.getTypeLabel(request.type)}
📌 제목: ${request.title}
⭐ 우선순위: ${this.getPriorityLabel(request.priority)}
📅 접수 시간: ${request.timestamp.toLocaleString('ko-KR')}
🌐 발생 페이지: ${request.currentPage}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 상세 내용:
${request.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 사용자 정보:
- 이름: ${request.userName || '익명 사용자'}
- 이메일: ${request.userEmail || '미제공'}
- 브라우저: ${this.extractBrowserInfo(request.userAgent)}
- 요청 ID: ${request.id}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💌 이 메시지는 다모아봄(damoabom.com)에서 자동 전송되었습니다.
사용자의 소중한 의견에 감사드립니다! 🙏

✅ 처리 상태: 접수 완료
📊 분석 후 검토하여 빠른 시일 내에 반영하겠습니다.
    `.trim();
  }

  /**
   * 브라우저 정보 추출
   */
  private static extractBrowserInfo(userAgent?: string): string {
    if (!userAgent) return 'Unknown';
    
    try {
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
      if (userAgent.includes('Edge')) return 'Edge';
      if (userAgent.includes('Opera')) return 'Opera';
      return 'Other';
    } catch {
      return 'Unknown';
    }
  }

  /**
   * 요청 유효성 검증 (보안)
   */
  private static validateRequest(request: FeatureRequest): boolean {
    // 기본 필드 검증
    if (!request.title || !request.description) {
      return false;
    }

    // XSS 공격 방지를 위한 기본 검증
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /onload=/i,
      /onclick=/i,
      /onerror=/i,
      /<iframe/i
    ];

    const textToCheck = `${request.title} ${request.description} ${request.userName || ''} ${request.userEmail || ''}`;
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(textToCheck)) {
        console.warn('잠재적으로 위험한 내용이 감지되었습니다.');
        return false;
      }
    }

    return true;
  }

  /**
   * 테스트 이메일 전송
   */
  static async sendTestEmail(): Promise<boolean> {
    const testRequest: FeatureRequest = {
      id: 'test-' + Date.now(),
      type: 'feature',
      title: '테스트 이메일',
      description: '이메일 전송 기능이 정상적으로 작동하는지 테스트합니다.',
      priority: 'medium',
      timestamp: new Date(),
      currentPage: typeof window !== 'undefined' ? window.location.href : 'http://localhost:3002',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Test Agent'
    };

    return await this.sendFeatureRequest(testRequest);
  }
}
