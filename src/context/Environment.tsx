export function isAuthEnabled() {
  return process.env.NEXT_PUBLIC_WITHOUT_SESSION !== "true";
}

export function BaseUrl() {
  return process.env.BASE_URL;
}

export const isCanaryUI =
  process.env.NEXT_PUBLIC_APP_DEPLOYMENT === "CANARY_CHECKER";
