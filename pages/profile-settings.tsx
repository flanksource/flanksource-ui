import {
  SelfServiceSettingsFlow,
  SubmitSelfServiceSettingsFlowBody,
  UiText
} from "@ory/client";
import { AxiosError } from "axios";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

import { Head } from "../src/components/Head/Head";
import { Flow, Methods, Messages } from "../src/components/ory";
import { handleFlowError } from "../src/components/ory/errors";
import ory from "../src/components/ory/sdk";

interface Props {
  flow?: SelfServiceSettingsFlow;
  only?: Methods;
}

function SettingsCard({
  flow,
  only,
  children
}: Props & { children: ReactNode }) {
  if (!flow) {
    return null;
  }

  const nodes = only
    ? flow.ui.nodes.filter(({ group }) => group === only)
    : flow.ui.nodes;

  if (nodes.length === 0) {
    return null;
  }

  return <div className="shadow sm:overflow-hidden sm:rounded-md bg-white p-4 my-4">{children}</div>;
}

const ProfileSettings: NextPage = () => {
  const [flow, setFlow] = useState<SelfServiceSettingsFlow>();
  const [messages, setMessages] = useState<UiText[]>([]);

  // Get ?flow=... from the URL
  const router = useRouter();
  const { flow: flowId, return_to: returnTo } = router.query;

  useEffect(() => {
    // If the router is not ready yet, or we already have a flow, do nothing.
    if (!router.isReady || flow) {
      return;
    }

    // If ?flow=.. was in the URL, we fetch it
    if (flowId) {
      ory
        .getSelfServiceSettingsFlow(String(flowId))
        .then(({ data }) => {
          setFlow(data);
        })
        .catch(handleFlowError(router, "settings", setFlow));
      return;
    }

    // Otherwise we initialize it
    ory
      .initializeSelfServiceSettingsFlowForBrowsers(
        returnTo ? String(returnTo) : undefined
      )
      .then(({ data }) => {
        setFlow(data);
      })
      .catch(handleFlowError(router, "settings", setFlow));
  }, [flowId, router, router.isReady, returnTo, flow]);

  useEffect(() => {
    setMessages(flow?.ui?.messages || []);
    setTimeout(() => {
      setMessages([]);
    }, 10000);
  }, [flow?.ui]);

  const onSubmit = (values: SubmitSelfServiceSettingsFlowBody) =>
    router
      // On submission, add the flow ID to the URL but do not navigate. This prevents the user loosing
      // his data when she/he reloads the page.
      .push(`/profile-settings?flow=${flow?.id}`, undefined, { shallow: true })
      .then(() =>
        ory
          .submitSelfServiceSettingsFlow(String(flow?.id), values, undefined)
          .then(({ data }) => {
            // The settings have been saved and the flow was updated. Let's show it to the user!
            setFlow(data);
          })
          .catch(handleFlowError(router, "settings", setFlow))
          .catch(async (err: AxiosError) => {
            // If the previous handler did not catch the error it's most likely a form validation error
            if (err.response?.status === 400) {
              // Yup, it is!
              setFlow(err.response?.data);
              return;
            }

            return Promise.reject(err);
          })
      );

  return (
    <>
      <Head prefix="Profile Management and Security Settings" />
      <div className="flex min-h-screen bg-gray-50 justify-center">
        <div className="flex min-h-full flex-col justify-center pt-12 pb-28 sm:px-6 lg:px-8">
          <div>
            <div>
              <img alt="Flanksource" src="/images/logo.svg" className="p-2 h-auto m-auto rounded-8px w-48" />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Profile Management and Security Settings
              </h2>
              <div className="pb-2">
                <SettingsCard only="profile" flow={flow}>
                  <h2 className="text-lg font-medium leading-6 text-gray-900">Profile Settings</h2>
                  <Flow
                    hideGlobalMessages
                    onSubmit={onSubmit}
                    only="profile"
                    flow={flow}
                  />
                </SettingsCard>
                <SettingsCard only="password" flow={flow}>
                  <h2 className="text-lg font-medium leading-6 text-gray-900">Change Password</h2>
                  <Flow
                    hideGlobalMessages
                    onSubmit={onSubmit}
                    only="password"
                    flow={flow}
                  />
                </SettingsCard>
                <SettingsCard only="oidc" flow={flow}>
                  <h2 className="text-lg font-medium leading-6 text-gray-900">Manage Social Sign In</h2>
                  <Flow hideGlobalMessages onSubmit={onSubmit} only="oidc" flow={flow} />
                </SettingsCard>
                <SettingsCard only="lookup_secret" flow={flow}>
                  <h2 className="text-lg font-medium leading-6 text-gray-900">Manage 2FA Backup Recovery Codes</h2>
                  <p>
                    Recovery codes can be used in panic situations where you have lost
                    access to your 2FA device.
                  </p>
                  <Flow
                    hideGlobalMessages
                    onSubmit={onSubmit}
                    only="lookup_secret"
                    flow={flow}
                  />
                </SettingsCard>
                <SettingsCard only="totp" flow={flow}>
                  <h2 className="text-lg font-medium leading-6 text-gray-900">Manage 2FA TOTP Authenticator App</h2>
                  <p>
                    Add a TOTP Authenticator App to your account to improve your account
                    security. Popular Authenticator Apps are{" "}
                    <a href="https://www.lastpass.com" rel="noreferrer" target="_blank">
                      LastPass
                    </a>{" "}
                    and Google Authenticator (
                    <a
                      href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                      target="_blank"
                      rel="noreferrer"
                    >
                      iOS
                    </a>
                    ,{" "}
                    <a
                      href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Android
                    </a>
                    ).
                  </p>
                  <Flow hideGlobalMessages onSubmit={onSubmit} only="totp" flow={flow} />
                </SettingsCard>
                <SettingsCard only="webauthn" flow={flow}>
                  <h2 className="text-lg font-medium leading-6 text-gray-900">Manage Hardware Tokens and Biometrics</h2>
                  <p>
                    Use Hardware Tokens (e.g. YubiKey) or Biometrics (e.g. FaceID,
                    TouchID) to enhance your account security.
                  </p>
                  <Flow
                    hideGlobalMessages
                    onSubmit={onSubmit}
                    only="webauthn"
                    flow={flow}
                  />
                </SettingsCard>
              </div>
              <Link href="/" passHref>
                <a className="cursor-pointer font-medium text-blue-600 hover:text-blue-500">
                  Go back
                </a>
              </Link>
              <Messages messages={messages} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
