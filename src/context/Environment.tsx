export function IsAuthEnabled() {
  return process.env.NEXT_PUBLIC_WITHOUT_SESSION !== "true";
}

export function BaseUrl() {
  return process.env.BASE_URL;
}
