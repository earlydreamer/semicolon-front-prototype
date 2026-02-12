import { AxiosError } from 'axios';

type ApiErrorPayload = {
  message?: string;
  details?: string;
};

export function parseHttpError(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof AxiosError)) {
    return fallbackMessage;
  }

  if (error.code === 'ECONNABORTED') {
    return '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
  }

  if (!error.response) {
    return '네트워크 연결에 실패했습니다. 인터넷 또는 서버 상태를 확인해주세요.';
  }

  if (error.response.status >= 500) {
    return '서버 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  const data = error.response.data as ApiErrorPayload | undefined;
  return data?.details || data?.message || fallbackMessage;
}
