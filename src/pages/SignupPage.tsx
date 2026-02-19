import { Link } from "react-router-dom";
import { Card } from "@/components/common/Card";
import { SignupForm } from "@/components/features/auth/SignupForm";
import { SocialLoginButtons } from "@/components/features/auth/SocialLoginButtons";

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8 min-[360px]:py-12 bg-neutral-50/50">
      <div className="w-full max-w-md space-y-6 px-3 min-[360px]:space-y-8 min-[360px]:px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 min-[360px]:text-4xl">
            회원가입
          </h1>
          <p className="text-neutral-500">
            덕쿠의 회원이 되어 다양한 혜택을 누려보세요.
          </p>
        </div>

        <Card className="p-6 md:p-8 shadow-xl shadow-neutral-200/50 border-neutral-100">
          <SignupForm />

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-neutral-200" />
            <span className="px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              간편 가입
            </span>
            <div className="flex-1 border-t border-neutral-200" />
          </div>

          <SocialLoginButtons />
        </Card>

        <p className="text-center text-sm text-neutral-500">
          이미 계정이 있으신가요?{" "}
          <Link
            to="/login"
            className="font-bold text-primary-600 hover:text-primary-700 transition-colors underline-offset-4 hover:underline"
          >
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}
