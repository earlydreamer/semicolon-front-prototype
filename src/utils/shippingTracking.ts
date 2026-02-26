type TrackingRule = {
  key: string;
  codes: string[];
  nameKeywords: string[];
  pattern: RegExp;
  hint: string;
};

const DEFAULT_PATTERN = /^[A-Za-z0-9]{8,30}$/;

const TRACKING_RULES: TrackingRule[] = [
  {
    key: "cj",
    codes: ["cj", "kr.cjlogistics", "04"],
    nameKeywords: ["cj", "대한통운"],
    pattern: /^\d{10,12}$/,
    hint: "CJ대한통운은 숫자 10~12자리",
  },
  {
    key: "hanjin",
    codes: ["hanjin", "kr.hanjin", "05"],
    nameKeywords: ["한진"],
    pattern: /^\d{10,12}$/,
    hint: "한진택배는 숫자 10~12자리",
  },
  {
    key: "lotte",
    codes: ["lotte", "kr.lotte", "08"],
    nameKeywords: ["롯데"],
    pattern: /^\d{12}$/,
    hint: "롯데택배는 숫자 12자리",
  },
  {
    key: "epost",
    codes: ["epost", "kr.epost", "01"],
    nameKeywords: ["우체국"],
    pattern: /^\d{13}$/,
    hint: "우체국택배는 숫자 13자리",
  },
  {
    key: "logen",
    codes: ["logen", "kr.logen", "06"],
    nameKeywords: ["로젠"],
    pattern: /^\d{11,12}$/,
    hint: "로젠택배는 숫자 11~12자리",
  },
  {
    key: "gs25",
    codes: ["gs25", "kr.cvsnet", "24"],
    nameKeywords: ["gs25", "편의점"],
    pattern: /^\d{10,12}$/,
    hint: "GS25 반값택배는 숫자 10~12자리",
  },
];

function normalize(value?: string): string {
  return (value ?? "").trim();
}

function normalizeLower(value?: string): string {
  return normalize(value).toLowerCase();
}

export function sanitizeTrackingNumber(value?: string): string {
  return normalize(value).replace(/[\s-]/g, "");
}

function findRule(carrierCode?: string, carrierName?: string): TrackingRule | undefined {
  const code = normalizeLower(carrierCode);
  const name = normalizeLower(carrierName);

  return TRACKING_RULES.find(
    (rule) =>
      (code && rule.codes.includes(code)) ||
      (name && rule.nameKeywords.some((keyword) => name.includes(keyword))),
  );
}

export function validateTrackingNumber(
  carrierCode?: string,
  carrierName?: string,
  trackingNumber?: string,
): { valid: boolean; normalized: string; hint: string } {
  const normalized = sanitizeTrackingNumber(trackingNumber);
  const rule = findRule(carrierCode, carrierName);
  const pattern = rule?.pattern ?? DEFAULT_PATTERN;

  if (!normalized) {
    return { valid: false, normalized, hint: "운송장 번호를 입력해 주세요." };
  }

  if (!pattern.test(normalized)) {
    return {
      valid: false,
      normalized,
      hint: rule?.hint ?? "운송장 번호 형식이 올바르지 않습니다. (영문/숫자 8~30자)",
    };
  }

  return { valid: true, normalized, hint: "" };
}

export function openNaverTrackingSearch(
  carrierName?: string,
  trackingNumber?: string,
  carrierCode?: string,
): { opened: boolean; hint: string } {
  const carrier = normalize(carrierName);
  const validation = validateTrackingNumber(carrierCode, carrierName, trackingNumber);

  if (!carrier || !validation.valid) {
    return { opened: false, hint: validation.hint || "택배사/운송장 정보를 확인해 주세요." };
  }

  const query = `${carrier} ${validation.normalized} 택배조회`;
  window.open(
    `https://search.naver.com/search.naver?query=${encodeURIComponent(query)}`,
    "_blank",
  );
  return { opened: true, hint: "" };
}
