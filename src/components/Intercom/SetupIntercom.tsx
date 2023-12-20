import { IntercomProvider } from "react-use-intercom";

const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID;

function ProvideIntercom({ children }: Props) {
  return (
    <IntercomProvider appId={INTERCOM_APP_ID!}>{children}S</IntercomProvider>
  );
}

type Props = {
  children: React.ReactNode;
};

export default function SetupIntercom({ children }: Props) {
  const isIntercomAppIDset = Boolean(INTERCOM_APP_ID);

  if (!isIntercomAppIDset) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return <ProvideIntercom>{children}</ProvideIntercom>;
}
