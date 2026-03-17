const normalizeUrl = (value: string): string => {
  const trimmed = String(value || "").trim();
  if (!trimmed || trimmed === "/") {
    return "";
  }

  return trimmed.replace(/\/+$/, "");
};

const normalizeHostname = (value?: string): string => String(value || "").trim().toLowerCase();

const parseHostList = (value: string): Set<string> =>
  new Set(
    String(value || "")
      .split(",")
      .map((host) => normalizeHostname(host))
      .filter(Boolean),
  );

const DEFAULT_PUBLIC_WEB_HOSTS = "dukku.earlydreamer.dev,www.dukku.earlydreamer.dev";
const DEFAULT_LEGACY_WEB_HOSTS = "dukku.shop,www.dukku.shop";
const DEFAULT_LEGACY_REDIRECT_BASE_URL = "https://dukku.earlydreamer.dev";

const DIRECT_API_BASE_URL = normalizeUrl(String(import.meta.env.VITE_API_BASE_URL || ""));
const DIRECT_GRAFANA_URL = normalizeUrl(String(import.meta.env.VITE_GRAFANA_URL || ""));
const PUBLIC_API_BASE_URL = normalizeUrl(String(import.meta.env.VITE_PUBLIC_API_BASE_URL || ""));
const PUBLIC_GRAFANA_URL = normalizeUrl(String(import.meta.env.VITE_PUBLIC_GRAFANA_URL || ""));
const PUBLIC_WEB_HOSTS = parseHostList(
  String(import.meta.env.VITE_PUBLIC_WEB_HOSTS || DEFAULT_PUBLIC_WEB_HOSTS),
);
const LEGACY_WEB_HOSTS = parseHostList(
  String(import.meta.env.VITE_LEGACY_WEB_HOSTS || DEFAULT_LEGACY_WEB_HOSTS),
);
const LEGACY_REDIRECT_BASE_URL = normalizeUrl(
  String(import.meta.env.VITE_LEGACY_REDIRECT_BASE_URL || DEFAULT_LEGACY_REDIRECT_BASE_URL),
);

export const isPublicWebHost = (hostname?: string): boolean => {
  const normalizedHostname = normalizeHostname(hostname);
  if (!normalizedHostname) {
    return false;
  }

  return PUBLIC_WEB_HOSTS.has(normalizedHostname);
};

export const isLegacyWebHost = (hostname?: string): boolean => {
  const normalizedHostname = normalizeHostname(hostname);
  if (!normalizedHostname) {
    return false;
  }

  return LEGACY_WEB_HOSTS.has(normalizedHostname);
};

export const resolveLegacyRedirectTarget = (): string => {
  if (
    typeof window === "undefined" ||
    !LEGACY_REDIRECT_BASE_URL ||
    !isLegacyWebHost(window.location.hostname)
  ) {
    return "";
  }

  const target = new URL(LEGACY_REDIRECT_BASE_URL);
  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  target.pathname = window.location.pathname;
  target.search = window.location.search;
  target.hash = window.location.hash;

  const resolvedCurrent = `${window.location.origin}${currentPath}`;
  const resolvedTarget = target.toString();

  return resolvedCurrent === resolvedTarget ? "" : resolvedTarget;
};

export const resolveApiBaseUrl = (): string => {
  if (DIRECT_API_BASE_URL) {
    return DIRECT_API_BASE_URL;
  }

  if (typeof window !== "undefined" && isPublicWebHost(window.location.hostname)) {
    return PUBLIC_API_BASE_URL;
  }

  return DIRECT_API_BASE_URL;
};

export const resolveGrafanaUrl = (): string => {
  if (DIRECT_GRAFANA_URL) {
    return DIRECT_GRAFANA_URL;
  }

  if (typeof window !== "undefined" && isPublicWebHost(window.location.hostname)) {
    return PUBLIC_GRAFANA_URL;
  }

  return typeof window !== "undefined"
    ? `${window.location.origin}/admin/grafana`
    : "/admin/grafana";
};
