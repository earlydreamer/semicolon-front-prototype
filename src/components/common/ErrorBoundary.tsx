/**
 * 전역 에러 경계 컴포넌트
 * 
 * 런타임 에러 발생 시 전체 앱 크래시를 방지하고
 * 사용자 친화적인 Fallback UI를 제공합니다.
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  /** 자식 컴포넌트 */
  children: ReactNode;
  /** 커스텀 Fallback UI (선택사항) */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 경계 컴포넌트
 * 
 * React의 에러 경계는 클래스 컴포넌트에서만 구현 가능합니다.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 에러 로깅 (프로덕션에서는 외부 서비스로 전송 권장)
    console.error('[ErrorBoundary] 에러 발생:', error);
    console.error('[ErrorBoundary] 컴포넌트 스택:', errorInfo.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 커스텀 fallback이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 Fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* 아이콘 */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* 메시지 */}
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              문제가 발생했습니다
            </h2>
            <p className="text-neutral-600 mb-6">
              예기치 않은 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </p>

            {/* 에러 상세 (개발 환경에서만) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-neutral-500 cursor-pointer hover:text-neutral-700">
                  에러 상세 보기
                </summary>
                <pre className="mt-2 p-3 bg-neutral-100 rounded-lg text-xs text-red-600 overflow-auto max-h-40">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* 액션 버튼 */}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-6 py-2.5 bg-primary-500 text-white font-medium rounded-lg
                           hover:bg-primary-600 transition-colors active:scale-[0.98]"
              >
                다시 시도
              </button>
              <button
                type="button"
                onClick={() => window.location.href = '/'}
                className="px-6 py-2.5 bg-neutral-200 text-neutral-700 font-medium rounded-lg
                           hover:bg-neutral-300 transition-colors active:scale-[0.98]"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
