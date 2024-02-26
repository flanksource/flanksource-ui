import { useSubmitPlaybookRunMutation } from "@flanksource-ui/api/query-hooks/playbooks";
import { RunnablePlaybook } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import { Link } from "react-router-dom";
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
  playbook: RunnablePlaybook & {
    spec: any;
  };
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
  const initialValues: Partial<SubmitPlaybookRunFormValues> = useMemo(() => {
    const paramsDefaultValues = playbook.parameters?.reduce((acc, param) => {
      if (param.default !== undefined) {
        acc[param.name] = param.default;
        return acc;
      }
      return acc;
    }, {} as Record<string, any>);

    return {
      id: playbook.id,
      component_id: componentId,
      check_id: checkId,
      config_id: configId,
      params: paramsDefaultValues
    };
  }, [checkId, componentId, configId, playbook.id, playbook.parameters]);

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
      const message =
        ((error as AxiosError).response?.data as any)?.error ?? error.message;
      toastError(message ?? error.message);
    }
  });

  const resource = getResourceForRun(initialValues);

  return (
    <Modal
      title={
        <PlaybookSpecModalTitle
          playbookSpec={playbook}
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
                  playbook.spec && (
                    <PlaybookSelectResource playbook={playbook} />
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
