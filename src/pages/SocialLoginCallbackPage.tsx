import { useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";

export default function SocialLoginCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { provider } = useParams();
  const { socialLogin } = useAuthStore();

  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const error = searchParams.get("error");

  useEffect(() => {
    const processLogin = async () => {
      if (!accessToken) {
        return;
      }

      try {
        await socialLogin(accessToken, refreshToken);
        navigate("/", { replace: true });
      } catch (e) {
        console.error("Social login failed:", e);
        navigate("/login?error=social_login_failed", { replace: true });
      }
    };

    processLogin();
  }, [accessToken, refreshToken, socialLogin, navigate]);

  if (!accessToken) {
    const providerName = provider
      ? provider.charAt(0).toUpperCase() + provider.slice(1)
      : "소셜";

    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-neutral-50/50">
        <Card className="w-full max-w-md p-8 text-center shadow-xl border-neutral-100">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            로그인 실패
          </h1>
          <p className="text-neutral-500 mb-8 leading-relaxed">
            {error
              ? `${providerName} 로그인 처리 중 오류가 발생했습니다: ${error}`
              : `${providerName} 로그인 인증 토큰을 받지 못했습니다. 다시 시도해 주세요.`}
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="w-full py-6 text-base font-semibold"
          >
            로그인 화면으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50/50">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-primary-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-neutral-900">
            {provider ? <span className="capitalize">{provider} </span> : ""}
            로그인 중
          </h2>
          <p className="text-neutral-500 font-medium">
            잠시만 기다려 주세요...
          </p>
        </div>
      </div>
    </div>
  );
}
