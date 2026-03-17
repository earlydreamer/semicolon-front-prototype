import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

type LegacyDomainRedirectProps = {
  targetUrl: string;
};

export function LegacyDomainRedirect({
  targetUrl,
}: LegacyDomainRedirectProps) {
  const targetHost = (() => {
    try {
      return new URL(targetUrl).host;
    } catch {
      return targetUrl;
    }
  })();

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-neutral-50/50 px-3 py-8 min-[360px]:px-4 min-[360px]:py-12">
      <Card className="w-full max-w-lg border-neutral-100 p-6 shadow-xl shadow-neutral-200/40 min-[360px]:p-8">
        <div className="text-center space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-xl text-primary-600">
            ↗
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-neutral-900 min-[360px]:text-3xl">
              새 도메인으로 이동합니다
            </h1>
            <p className="text-neutral-600">
              서비스 주소가 변경되어 잠시 후 새 도메인으로 자동 이동합니다.
              현재 경로는 그대로 유지됩니다.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              이동 대상
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-neutral-900">
              {targetHost}
            </p>
            <p className="mt-1 break-all text-xs text-neutral-500">{targetUrl}</p>
          </div>

          <div className="space-y-3">
            <div className="mx-auto h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-primary-500" />
            </div>
            <p className="text-sm text-neutral-500">
              새 도메인으로 이동 중입니다...
            </p>
          </div>

          <Button
            asChild
            className="w-full min-[360px]:w-auto min-[360px]:px-8"
          >
            <a href={targetUrl}>바로 이동</a>
          </Button>
        </div>
      </Card>
    </main>
  );
}
