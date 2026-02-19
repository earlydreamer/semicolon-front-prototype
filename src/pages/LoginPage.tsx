import { Link, useSearchParams } from "react-router-dom";
import { Card } from "@/components/common/Card";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { SocialLoginButtons } from "@/components/features/auth/SocialLoginButtons";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 min-[360px]:py-12 bg-neutral-50/50">
      <div className="w-full max-w-md space-y-6 px-3 min-[360px]:space-y-8 min-[360px]:px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 min-[360px]:text-4xl">
            로그인
          </h1>
          <p className="text-neutral-500">
            반갑습니다! 서비스를 이용하기 위해 로그인해 주세요.
          </p>
          {error ? (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm text-red-600 font-medium">
                {error === "social_login_failed"
                  ? "소셜 로그인에 실패했습니다. 다시 시도해 주세요."
                  : `로그인 실패: ${error}`}
              </p>
            </div>
          ) : null}
        </div>

        <Card className="p-6 md:p-8 shadow-xl shadow-neutral-200/50 border-neutral-100">
          <LoginForm />

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-neutral-200" />
            <span className="px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              간편 로그인
            </span>
            <div className="flex-1 border-t border-neutral-200" />
          </div>

          <SocialLoginButtons />
        </Card>

        <p className="text-center text-sm text-neutral-500">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup"
            className="font-bold text-primary-600 hover:text-primary-700 transition-colors underline-offset-4 hover:underline"
          >
            회원가입하기
          </Link>
        </p>
      </div>
    </div>
  );
}
