import getConfig from "next/config";

export function getApiUrl(): string {
  if (typeof window === "undefined") {
    const { serverRuntimeConfig } = getConfig() ?? {};
    return serverRuntimeConfig?.apiUrl ?? process.env.API_URL ?? "http://localhost:4000";
  }

  const { publicRuntimeConfig } = getConfig() ?? {};
  return publicRuntimeConfig?.apiUrl ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

export function getWsUrl(): string {
  const { publicRuntimeConfig } = getConfig() ?? {};
  return publicRuntimeConfig?.wsUrl ?? process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";
}
