import { buildAuthorizationHeader, refreshAccessTokenOnce, resolveApiBaseUrl } from '@/utils/api';
import { useAuthStore } from '@/stores/useAuthStore';

export interface ChatRequest {
  conversationId: string | null;
  userUuid: string;
  message: string;
}

const AI_API_BASE_URL = `${resolveApiBaseUrl()}/api/v1/ai`;

const buildChatRequestInit = (request: ChatRequest, accessToken: string | null): RequestInit => {
  const authorizationHeader = buildAuthorizationHeader(accessToken);

  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authorizationHeader ? { Authorization: authorizationHeader } : {}),
    },
    body: JSON.stringify(request),
  };
};

const performChatFetch = async (request: ChatRequest, accessToken: string | null) =>
  fetch(`${AI_API_BASE_URL}/chat`, buildChatRequestInit(request, accessToken));

export const aiApi = {
  /**
   * AI 채팅 메시지를 전송하고 응답 스트림을 수신합니다.
   */
  async chatStream(
    request: ChatRequest,
    onMessage: (chunk: string) => void,
    onError: (error: unknown) => void,
    onComplete: () => void,
  ) {
    const currentAccessToken = useAuthStore.getState().accessToken;

    try {
      let response = await performChatFetch(request, currentAccessToken);

      if (!response.ok && response.status === 401) {
        const refreshedAccessToken = await refreshAccessTokenOnce('/api/v1/ai/chat');
        if (refreshedAccessToken) {
          response = await performChatFetch(request, refreshedAccessToken);
        }
      }

      if (!response.ok) {
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
        buffer += chunkStr;

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) {
            line = line.slice(0, -1);
          }

          try {
            if (line.startsWith('data:')) {
              const data = line.slice(5);

              if (data === '[DONE]') {
                onComplete();
                return;
              }

              onMessage(data);
            } else if (line.trim() !== '') {
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
