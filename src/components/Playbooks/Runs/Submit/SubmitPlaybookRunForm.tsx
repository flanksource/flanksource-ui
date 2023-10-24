import { Form, Formik } from "formik";
import { useMemo } from "react";
import { useSubmitPlaybookRunMutation } from "../../../../api/query-hooks/playbooks";
import { Button } from "../../../Button";
import { Modal } from "../../../Modal";
import { toastError, toastSuccess } from "../../../Toast/toast";
import AddPlaybookToRunParams from "./AddPlaybookToRunParams";
import { PlaybookSpec } from "../../../../api/types/playbooks";

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
  checkId?: string;
  componentId?: string;
  configId?: string;
};

export default function SubmitPlaybookRunForm({
  isOpen,
  onClose,
  playbookSpec,
  componentId,
  checkId,
  configId
}: Props) {
  const initialValues: Partial<SubmitPlaybookRunFormValues> = useMemo(
    () => ({
      id: playbookSpec.id,
      params: undefined,
      component_id: componentId,
      check_id: checkId,
      config_id: configId
    }),
    [checkId, componentId, configId, playbookSpec.id]
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
