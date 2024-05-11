export const isClerkSatellite =
  process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE === "true";

export const isClerkAuthSystem =
  !!process.env.NEXT_PUBLIC_AUTH_IS_CLERK === true;

export default function useDetermineAuthSystem() {
  if (isClerkAuthSystem) {
    return "clerk";
  }
  return "kratos";
}
