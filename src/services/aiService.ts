import { useAuthStore } from '@/stores/useAuthStore';

// AI API 통신을 위한 인터페이스 정의
export interface ChatRequest {
    conversationId: string | null;
    userUuid: string;
    message: string;
}

// AI API 엔드포인트 URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const AI_API_BASE_URL = `${BASE_URL}/api/v1/ai`;

export const aiApi = {
    /**
     * AI 채팅 메시지를 전송하고 응답 스트림을 받습니다.
     * Server-Sent Events (SSE) 형식이지만, 여기서는 fetch를 사용하여 수동으로 스트림을 읽습니다.
     */
    async chatStream(
        request: ChatRequest,
        onMessage: (chunk: string) => void,
        onError: (error: any) => void,
        onComplete: () => void
    ) {
        const accessToken = useAuthStore.getState().accessToken;

        try {
            const response = await fetch(`${AI_API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    useAuthStore.getState().logout();
                    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
                        window.location.href = `/login?error=expired&returnUrl=${encodeURIComponent(window.location.pathname)}`;
                    }
                    throw new Error('401_UNAUTHORIZED');
                }
                throw new Error(`API 오류: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder('utf-8');

            if (!reader) {
                throw new Error('스트림을 읽을 수 없습니다.');
            }

            let buffer = '';
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    onComplete();
                    break;
                }

                const chunkStr = decoder.decode(value, { stream: true });
                console.log("RAW CHUNK =>", JSON.stringify(chunkStr));
                buffer += chunkStr;

                let newlineIndex;
                while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
                    const line = buffer.slice(0, newlineIndex);
                    buffer = buffer.slice(newlineIndex + 1);

                    try {
                        if (line.startsWith('data:')) {
                            // SSE 표준: 'data:' 직후의 공백 하나만 제거하고 나머지는 보존
                            let data = line.slice(5);
                            if (data.startsWith(' ')) {
                                data = data.slice(1);
                            }

                            // 백엔드에서 DONE 신호가 올 경우 종료 처리
                            if (data === '[DONE]') {
                                onComplete();
                                return;
                            }
                            // 공백만 있는 토큰도 렌더링을 위해 전달합니다
                            onMessage(data);
                        } else if (line.trim() !== '') {
                            // 그냥 평문 스트림일 경우를 대비한 Fallback
                            if (!line.startsWith('event:') && !line.startsWith('id:') && !line.startsWith('retry:')) {
                                onMessage(line);
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to parse stream chunk:', line, e);
                    }
                }
            }
        } catch (error) {
            console.error('aiService stream failed:', error);
            onError(error);
        }
    },
};
