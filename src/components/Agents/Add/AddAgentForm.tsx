import clsx from "clsx";
import { Form, Formik } from "formik";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  useAddAgentMutations,
  useUpdateAgentMutations
} from "../../../api/query-hooks/mutations/useUpsertAgentMutations";
import { GenerateAgent, GeneratedAgent } from "../../../api/services/agents";
import { Button } from "../../Button";
import FormikAutocompleteDropdown from "../../Forms/Formik/FormikAutocompleteDropdown";
import FormikCheckbox from "../../Forms/Formik/FormikCheckbox";
import FormikConfigFormFieldsArray from "../../Forms/Formik/FormikConfigFormFieldsArray";
import FormikKeyValueMapField from "../../Forms/Formik/FormikKeyValueMapField";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import { Modal } from "../../Modal";
import { toastError, toastSuccess } from "../../Toast/toast";
import { Agent } from "../AgentPage";
import DeleteAgentButton from "../DeleteAgentButton";

export type AgentFormValues = GenerateAgent & {
  kubernetes?: Record<string, any>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (agent: GeneratedAgent, formValues: AgentFormValues) => void;
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
  const [formValues, setFormValues] = useState<AgentFormValues>();

  const { mutate: addAgent, isLoading: isAdding } = useAddAgentMutations({
    onSuccess: (data) => {
      toastSuccess("Agent created");
      onSuccess(data, formValues!);
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

  const handleSubmit = (values: AgentFormValues) => {
    const { kubernetes, ...dbValues } = values;
    const agentValues = {
      ...dbValues,
      kubernetes: kubernetes && !!kubernetes.enabled ? kubernetes : undefined
    };
    setFormValues(agentValues);
    if (agent?.id) {
      updateAgent({ ...dbValues, id: agent.id });
      return;
    }
    addAgent(dbValues);
  };

  return (
    <Modal
      title={agent?.id ? agent.name : "Create new agent"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik<AgentFormValues>
        initialValues={{
          name: agent?.name ?? "",
          properties: agent?.properties ?? {},
          kubernetes: {
            interval: "30m"
          }
        }}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleSubmit, values }) => (
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
                  <FormikCheckbox
                    name="kubernetes.enabled"
                    label="Kubernetes"
                  />
                  {Boolean(values.kubernetes?.enabled) === true && (
                    <>
                      <FormikAutocompleteDropdown
                        options={[
                          { label: "1m", value: "1m" },
                          { label: "5m", value: "5m" },
                          { label: "10m", value: "10m" },
                          {
                            label: "30m",
                            value: "30m"
                          },
                          { label: "1h", value: "1h" },
                          { label: "2h", value: "2h" },
                          { label: "6h", value: "6h" },
                          { label: "12h", value: "12h" },
                          { label: "24h", value: "24h" }
                        ]}
                        name="kubernetes.interval"
                        label="Scrape Interval"
                      />
                      <FormikConfigFormFieldsArray
                        name={`kubernetes.exclusions`}
                        label={"Exclusions"}
                        fields={[
                          {
                            fieldComponent: FormikTextInput,
                            name: `kubernetes.exclusions`
                          }
                        ]}
                      />
                    </>
                  )}
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
