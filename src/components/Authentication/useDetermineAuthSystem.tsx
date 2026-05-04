export const isClerkSatellite =
  process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE === "true";

export const isClerkAuthSystem =
  !!process.env.NEXT_PUBLIC_AUTH_IS_CLERK === true;

export const isBasicAuthSystem =
  process.env.NEXT_PUBLIC_AUTH_IS_BASIC === "true";

export default function useDetermineAuthSystem(): "clerk" | "kratos" | "basic" {
  if (isBasicAuthSystem) {
    return "basic";
  }
  if (isClerkAuthSystem) {
    return "clerk";
  }
  return "kratos";
}
