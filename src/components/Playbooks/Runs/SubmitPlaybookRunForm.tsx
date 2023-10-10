import { Form, Formik } from "formik";
import { useMemo } from "react";
import { useSubmitPlaybookRunMutation } from "../../../api/query-hooks/playbooks";
import { Button } from "../../Button";
import { Modal } from "../../Modal";
import { toastError, toastSuccess } from "../../Toast/toast";
import { PlaybookSpec } from "../Settings/PlaybookSpecsTable";
import AddPlaybookToRunParams from "./AddPlaybookToRunParams";

export type SubmitPlaybookRunFormValues = {
  // if this is present in the form, we show step to add params
  id: string;
  component_id?: string;
  config_id?: string;
  params?: Record<string, any>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  playbookSpec: PlaybookSpec;
};

type SubmitPlaybookRunFormForComponentProps = {
  type: "component";
  componentId: string;
} & Props;

type SubmitPlaybookRunFormForConfigProps = {
  type: "config";
  configId: string;
} & Props;

type SubmitPlaybookRunFormForCheckProps = {
  type: "check";
  checkId: string;
} & Props;

type SubmitPlaybookRunFormProps =
  | SubmitPlaybookRunFormForComponentProps
  | SubmitPlaybookRunFormForConfigProps
  | SubmitPlaybookRunFormForCheckProps;

export default function SubmitPlaybookRunForm({
  isOpen,
  onClose,
  playbookSpec,
  ...props
}: SubmitPlaybookRunFormProps) {
  const initialValues: Partial<SubmitPlaybookRunFormValues> = useMemo(
    () => ({
      id: playbookSpec.ID,
      params: undefined,

      ...(props.type === "component"
        ? { component_id: props.componentId }
        : props.type === "check"
        ? {
            check_id: props.checkId
          }
        : {
            config_id: props.configId
          })
    }),
    [props, playbookSpec]
  );

  const { mutate: submitPlaybookRun } = useSubmitPlaybookRunMutation({
    onSuccess: () => {
      toastSuccess("Playbook run submitted successfully");
      onClose();
    },
    onError: (error) => {
      toastError(error.message);
    }
  });

  return (
    <Modal
      title={playbookSpec.name}
      open={isOpen}
      onClose={onClose}
      size="slightly-small"
      bodyClass=""
      containerClassName=""
    >
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          submitPlaybookRun(values as SubmitPlaybookRunFormValues);
        }}
      >
        {({ values, handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex p-4 flex-col gap-2">
                <AddPlaybookToRunParams playbookSpec={playbookSpec} />
              </div>
              <div className="flex flex-row p-4 justify-end bg-gray-200 rounded-b rounded-md">
                <Button
                  disabled={values.id === undefined}
                  text="Submit"
                  type="submit"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}
