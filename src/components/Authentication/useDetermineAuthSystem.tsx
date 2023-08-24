export default function useDetermineAuthSystem() {
  const isClerkAuthSystem = !!process.env.NEXT_PUBLIC_AUTH_IS_CLERK === true;
  if (isClerkAuthSystem) {
    return "clerk";
  }
  return "kratos";
}
