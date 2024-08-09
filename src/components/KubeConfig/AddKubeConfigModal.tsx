import { Button } from "@flanksource-ui/ui/Buttons/Button";
import CodeBlock from "@flanksource-ui/ui/Code/CodeBlock";
import { Modal } from "@flanksource-ui/ui/Modal";

const downloadKubeConfigURL = `/api/kubeconfig`;

type AddKubeConfigModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddKubeConfigModal({
  isOpen,
  onClose
}: AddKubeConfigModalProps) {
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
          <div className="flex flex-col gap-1 py-2">
            <h4 className="font-semibold">Instructions</h4>
            <div className="flex flex-col gap-2">
              <p>1. Download the kubeconfig file using the above button</p>
              <div>
                <Button
                  onClick={() => {
                    window.open(downloadKubeConfigURL, "_blank");
                  }}
                >
                  Download kubeconfig
                </Button>
              </div>
              <p>2. Copy the kubeconfig file to your local machine</p>
              <CodeBlock code="mv <Path to download location>/kubeconfig.yaml ~/.kube/config" />
              <p>
                3. Set the KUBECONFIG environment variable to the path of the
                kubeconfig file
              </p>
              <CodeBlock code="export KUBECONFIG=~/.kube/config" />
              <p>
                4. Run the following command to verify the kubeconfig file is
                working
              </p>
              <CodeBlock code="kubectl get pods" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-end gap-4 p-4">
        <Button text="Close" onClick={onClose} />
      </div>
    </Modal>
  );
}
