import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaSpinner } from "react-icons/fa";
import {
  useAddAgentMutations,
  useUpdateAgentMutations
} from "../../../api/query-hooks/mutations/useUpsertAgentMutations";
import { GenerateAgent, GeneratedAgent } from "../../../api/services/agents";
import { Button } from "../../Button";
import FormikKeyValueMapField from "../../Forms/Formik/FormikKeyValueMapField";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import { Modal } from "../../Modal";
import { toastError, toastSuccess } from "../../Toast/toast";
import { Agent } from "../AgentPage";
import DeleteAgentButton from "../DeleteAgentButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (agent: GeneratedAgent) => void;
  onUpdated?: (agent: Agent) => void;
  agent?: GenerateAgent & {
    id: string;
  };
};

export default function AgentForm({
  isOpen,
  onClose,
  onSuccess = () => {},
  onUpdated = () => {},
  agent
}: Props) {
  const { mutate: addAgent, isLoading: isAdding } = useAddAgentMutations({
    onSuccess: (data) => {
      toastSuccess("Agent created");
      onSuccess(data);
    },
    onError: (error) => {
      toastError(error.message);
    }
  });

  const { mutate: updateAgent, isLoading: isUpdating } =
    useUpdateAgentMutations({
      onSuccess: (data) => {
        toastSuccess("Agent updated");
        onUpdated(data);
      },
      onError: (error) => {
        toastError(error.message);
      }
    });

  const isLoading = isAdding || isUpdating;

  return (
    <Modal
      title={agent?.id ? agent.name : "Create new agent"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik<GenerateAgent>
        initialValues={{
          name: agent?.name ?? "",
          properties: agent?.properties ?? {}
        }}
        onSubmit={(value) => {
          if (agent?.id) {
            updateAgent({ ...value, id: agent.id });
            return;
          }
          addAgent(value);
        }}
      >
        {({ handleSubmit }) => (
          <Form
            className="flex flex-col flex-1 overflow-y-auto"
            onSubmit={handleSubmit}
          >
            <div className={clsx("flex flex-col h-full my-2 overflow-y-auto")}>
              <div className={clsx("flex flex-col px-2 mb-2 overflow-y-auto")}>
                <div className="flex flex-col space-y-4 overflow-y-auto p-4">
                  <FormikTextInput
                    readOnly={agent?.id !== undefined}
                    name="name"
                    label="Name"
                    required
                  />
                  <FormikKeyValueMapField
                    name="properties"
                    label="Properties"
                  />
                </div>
              </div>
            </div>
            <div
              className={clsx(
                "flex items-center py-4 px-5 bg-gray-100",
                agent?.id ? "justify-between" : "justify-end"
              )}
            >
              {agent?.id && (
                <DeleteAgentButton agentId={agent.id} onDeleted={onClose} />
              )}
              <Button
                icon={
                  isLoading ? <FaSpinner className="animate-spin" /> : undefined
                }
                type="submit"
                text={agent?.id ? "Save" : isLoading ? "Saving ..." : "Next"}
                className="btn-primary"
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
