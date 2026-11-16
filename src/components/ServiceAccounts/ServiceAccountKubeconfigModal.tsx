import { downloadServiceAccountKubeconfig } from "@flanksource-ui/api/services/serviceAccounts";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import FormikCheckbox from "@flanksource-ui/components/Forms/Formik/FormikCheckbox";
import FormikSelectDropdown from "@flanksource-ui/components/Forms/Formik/FormikSelectDropdown";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import { toastSuccess } from "@flanksource-ui/components/Toast/toast";
import { expiryOptions } from "@flanksource-ui/components/Tokens/Add/CreateTokenForm";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { IoMdDownload } from "react-icons/io";

type Props = {
  account: string;
  /** Whether the account holds kubernetes-proxy:read or kubernetes-proxy:write */
  canUseProxy: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export function KubernetesProxyWarning({ account }: { account: string }) {
  return (
    <p
      role="note"
      className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-900"
    >
      {account} holds neither kubernetes-proxy:read nor kubernetes-proxy:write,
      so its kubeconfig is refused on every request. Bind it to a Role that
      allows one of them first.
    </p>
  );
}

/** Downloads a kubeconfig whose credential is a new token of the service account, bound to the kubernetes-proxy Role. */
export default function ServiceAccountKubeconfigModal({
  account,
  canUseProxy,
  isOpen,
  onClose
}: Props) {
  const queryClient = useQueryClient();
  const { mutate, isLoading, error, reset } = useMutation({
    mutationFn: (values: {
      name: string;
      expiry: string;
      autoRenew: boolean;
    }) =>
      downloadServiceAccountKubeconfig(account, {
        ...values,
        name: values.name.trim()
      }),
    onSuccess: (kubeconfig) => {
      const url = URL.createObjectURL(
        new Blob([kubeconfig], { type: "application/yaml" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = `${account}-kubeconfig.yaml`;
      link.click();
      URL.revokeObjectURL(url);

      toastSuccess("Kubeconfig downloaded");
      // The download issued a token
      queryClient.invalidateQueries(["service-accounts", account, "tokens"]);
      close();
    }
  });

  const close = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={`Download kubeconfig for ${account}`}
      onClose={close}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik
        initialValues={{ name: "", expiry: "90d", autoRenew: false }}
        onSubmit={(values) => mutate(values)}
      >
        <Form className="flex flex-col">
          <div className="flex flex-col gap-4 p-4">
            {!canUseProxy && <KubernetesProxyWarning account={account} />}
            <p className="text-sm text-gray-500">
              The kubeconfig carries a new token of {account}, limited to the
              Kubernetes proxy. It&apos;s listed under Tokens, where it can be
              revoked.
            </p>
            <FormikTextInput
              name="name"
              label="Token Name"
              hint="Defaults to the time of the download"
            />
            <FormikSelectDropdown
              name="expiry"
              label="Expiry"
              options={expiryOptions}
              hint="When the token in the kubeconfig expires"
            />
            <FormikCheckbox
              name="autoRenew"
              label="Auto Renew"
              hint="Renew the expiry automatically while the token is in use"
              checkboxStyle="toggle"
            />
            {error != null && <ErrorViewer error={error} />}
          </div>
          <div className="flex items-center justify-end bg-gray-100 px-5 py-4">
            <Button
              type="submit"
              icon={<IoMdDownload />}
              text={isLoading ? "Downloading..." : "Download kubeconfig"}
              className="btn-primary"
              disabled={isLoading}
            />
          </div>
        </Form>
      </Formik>
    </Modal>
  );
}
