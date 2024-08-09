import { useUser } from "@flanksource-ui/context";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import { Modal } from "@flanksource-ui/ui/Modal";
import StepperList from "@flanksource-ui/ui/StepperList";
import { useMemo } from "react";
import { IoMdDownload } from "react-icons/io";

const downloadKubeConfigURL = `/api/kubeconfig`;

type AddKubeConfigModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddKubeConfigModal({
  isOpen,
  onClose
}: AddKubeConfigModalProps) {
  const { backendUrl } = useUser();

  const kubeConfigFilename = useMemo(
    () =>
      backendUrl
        ?.replaceAll("https://", "")
        .replaceAll(".flanksource.com", "")
        .replaceAll("/", "") + "-kubeconfig.yaml",
    [backendUrl]
  );

  return (
    <Modal
      title={"Download and install kubeconfig"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      helpLink="/installation/saas/agent"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="flex flex-col">
          <div className="flex w-full flex-col gap-1">
            <h4 className="block font-semibold">Instructions</h4>

            <StepperList
              items={[
                <div key="step-1">
                  <Button
                    onClick={() => {
                      window.open(downloadKubeConfigURL, "_blank");
                    }}
                  >
                    <IoMdDownload className="mr-2" />
                    Download kubeconfig file
                  </Button>
                </div>,
                <div className="flex flex-col gap-1" key="step-2">
                  Apply the kubeconfig file to your kubectl configuration{" "}
                  <CodeBlock
                    code={`kubectl --kubeconfig ${kubeConfigFilename} get canaries`}
                  />
                </div>,
                <div key="key-2">
                  <a
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    href="docs.flanksource.com/reference/kubeconfig"
                  >
                    Learn more
                  </a>{" "}
                  on how to use the Kubernetes Interface to Mission Control
                </div>
              ]}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
