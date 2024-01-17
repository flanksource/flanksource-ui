import { Form, Formik } from "formik";
import { useMemo } from "react";
import { useSubmitPlaybookRunMutation } from "../../../../api/query-hooks/playbooks";
import { RunnablePlaybook } from "../../../../api/types/playbooks";
import { Button } from "../../../Button";
import { Modal } from "../../../Modal";
import { toastError, toastSuccess } from "../../../Toast/toast";
import { getResourceForRun } from "../services";
import PlaybookRunParams from "./PlaybookRunParams";

export type SubmitPlaybookRunFormValues = {
  // if this is present in the form, we show step to add params
  id: string;
  component_id?: string;
  config_id?: string;
  check_id?: string;
  params?: Record<string, any>;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  playbook: RunnablePlaybook;
  checkId?: string;
  componentId?: string;
  configId?: string;
};

export default function SubmitPlaybookRunForm({
  isOpen,
  onClose,
  playbook,
  checkId,
  componentId,
  configId
}: Props) {
  const initialValues: Partial<SubmitPlaybookRunFormValues> = useMemo(
    () => ({
      id: playbook.id,
      component_id: componentId,
      check_id: checkId,
      config_id: configId
    }),
    [checkId, componentId, configId, playbook.id]
  );

  const { mutate: submitPlaybookRun } = useSubmitPlaybookRunMutation({
    onSuccess: (run) => {
      toastSuccess(
        <>
          <a className="link mr-2" href={`/playbooks/runs/${run.run_id}`}>
            Playbook Run
          </a>{" "}
          submitted successfully
        </>
      );
      onClose();
    },
    onError: (error) => {
      toastError(error.message);
    }
  });

  const resource = getResourceForRun(initialValues);

  return (
    <Modal
      title={playbook.name}
      open={isOpen}
      onClose={onClose}
      size="slightly-small"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          submitPlaybookRun(values as SubmitPlaybookRunFormValues);
        }}
      >
        {({ values, handleSubmit }) => {
          return (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col overflow-y-auto"
            >
              <div className="flex flex-col gap-2 overflow-y-auto px-4">
                <PlaybookRunParams playbook={playbook} resource={resource} />
              </div>

              <div className="flex justify-end p-4 rounded-b space-x-2 bg-slate-50  ring-1 ring-black/5 ">
                <Button
                  disabled={values.id === undefined}
                  text="Run"
                  role="button"
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
