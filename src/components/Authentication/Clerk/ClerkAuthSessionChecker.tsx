import { useSession } from "@clerk/nextjs";
import { isAuthEnabled } from "../../../context/Environment";

type Props = {
  children: React.ReactNode;
};

export default function CleckAuthSessionChecker({ children }: Props) {
  const { isSignedIn } = useSession();

  if (isAuthEnabled() && !isSignedIn) {
    return null;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
