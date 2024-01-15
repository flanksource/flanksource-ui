import { Form, Formik } from "formik";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useGetPlaybookSpecsDetails,
  useSubmitPlaybookRunMutation
} from "../../../../api/query-hooks/playbooks";
import {
  PlaybookSpec,
  RunnablePlaybook
} from "../../../../api/types/playbooks";
import { Button } from "../../../Button";
import { Modal } from "../../../Modal";
import { toastError, toastSuccess } from "../../../Toast/toast";
import PlaybookSpecModalTitle from "../../PlaybookSpecModalTitle";
import { getResourceForRun } from "../services";
import PlaybookRunParams from "./PlaybookRunParams";
import PlaybookSelectResource from "./PlaybookSelectResource";

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
  playbookSpec?: PlaybookSpec;
  checkId?: string;
  componentId?: string;
  configId?: string;
};

export default function SubmitPlaybookRunForm({
  isOpen,
  onClose,
  playbook,
  playbookSpec: playbookSpecParam,
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

  const { data } = useGetPlaybookSpecsDetails(playbook.id, {
    enabled: playbookSpecParam === undefined
  });

  const playbookSpec = playbookSpecParam ?? data;

  const { mutate: submitPlaybookRun } = useSubmitPlaybookRunMutation({
    onSuccess: (run) => {
      toastSuccess(
        <>
          <Link className="link mr-2" to={`/playbooks/runs/${run.run_id}`}>
            Playbook Run
          </Link>{" "}
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
      title={
        <PlaybookSpecModalTitle
          playbookSpec={playbookSpec}
          defaultTitle={playbook.name ?? "Run Playbook"}
        />
      }
      open={isOpen}
      onClose={onClose}
      size="medium"
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
              <div className="flex flex-col overflow-y-auto px-4 py-4">
                <label className="form-label text-lg mb-0">Resource</label>
                {resource ? (
                  <div className="flex flex-col gap-2 mb-2">
                    {resource.link}
                  </div>
                ) : (
                  // we need playbookSpec to render this, as it has filters
                  playbookSpec && (
                    <PlaybookSelectResource playbook={playbookSpec} />
                  )
                )}
                <div className="border-b border-gray-200 mb-4 mt-2" />
                <div className="flex flex-col gap-2 mb-4">
                  <label className="form-label text-lg mb-4">
                    Playbook Parameters
                  </label>
                  <PlaybookRunParams playbook={playbook} />
                </div>
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
