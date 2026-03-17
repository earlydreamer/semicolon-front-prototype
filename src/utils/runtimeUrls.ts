const normalizeUrl = (value: string): string => {
  const trimmed = String(value || "").trim();
  if (!trimmed || trimmed === "/") {
    return "";
  }

  return trimmed.replace(/\/+$/, "");
};

const parseHostList = (value: string): Set<string> =>
  new Set(
    String(value || "")
      .split(",")
      .map((host) => host.trim())
      .filter(Boolean),
  );

const DIRECT_API_BASE_URL = normalizeUrl(String(import.meta.env.VITE_API_BASE_URL || ""));
const DIRECT_GRAFANA_URL = normalizeUrl(String(import.meta.env.VITE_GRAFANA_URL || ""));
const PUBLIC_API_BASE_URL = normalizeUrl(String(import.meta.env.VITE_PUBLIC_API_BASE_URL || ""));
const PUBLIC_GRAFANA_URL = normalizeUrl(String(import.meta.env.VITE_PUBLIC_GRAFANA_URL || ""));
const PUBLIC_WEB_HOSTS = parseHostList(String(import.meta.env.VITE_PUBLIC_WEB_HOSTS || ""));

export const isPublicWebHost = (hostname?: string): boolean => {
  if (!hostname) {
    return false;
  }

  return PUBLIC_WEB_HOSTS.has(hostname);
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
