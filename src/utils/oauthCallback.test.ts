import { describe, expect, it } from "vitest";
import { readOAuthCallbackTokens } from "./oauthCallback";

describe("readOAuthCallbackTokens", () => {
  it("fragment에서 토큰을 읽는다", () => {
    expect(readOAuthCallbackTokens("#accessToken=a.b.c&refreshToken=r1", "")).toEqual({
      accessToken: "a.b.c",
      refreshToken: "r1",
    });
  });

  it("fragment가 없으면 구 응답의 쿼리스트링에서 읽는다", () => {
    expect(readOAuthCallbackTokens("", "?accessToken=a.b.c&refreshToken=r1")).toEqual({
      accessToken: "a.b.c",
      refreshToken: "r1",
    });
  });

  it("fragment 값을 쿼리스트링보다 우선한다", () => {
    expect(readOAuthCallbackTokens("#accessToken=from-fragment", "?accessToken=from-query").accessToken).toBe(
      "from-fragment",
    );
  });

  it("토큰이 없으면 null을 반환한다", () => {
    expect(readOAuthCallbackTokens("", "?error=social_login_failed")).toEqual({
      accessToken: null,
      refreshToken: null,
    });
  });
});
