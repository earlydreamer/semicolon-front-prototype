// 백엔드는 소셜 로그인 토큰을 fragment(#accessToken=...)로 전달한다.
// 백엔드 배포 전 구 응답(쿼리스트링)도 받을 수 있도록 쿼리스트링을 보조로 읽는다.
export function readOAuthCallbackTokens(hash: string, search: string) {
  const fragmentParams = new URLSearchParams(hash.replace(/^#/, ""));
  const queryParams = new URLSearchParams(search);
  return {
    accessToken: fragmentParams.get("accessToken") ?? queryParams.get("accessToken"),
    refreshToken: fragmentParams.get("refreshToken") ?? queryParams.get("refreshToken"),
  };
}
