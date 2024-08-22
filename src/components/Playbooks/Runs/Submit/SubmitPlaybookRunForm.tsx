import { useSubmitPlaybookRunMutation } from "@flanksource-ui/api/query-hooks/playbooks";
import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal, ModalSize } from "@flanksource-ui/ui/Modal";
import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { atom, useAtom } from "jotai";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toastError } from "../../../Toast/toast";
import PlaybookSpecModalTitle from "../../PlaybookSpecModalTitle";
import { getResourceForRun } from "../services";
import PlaybookRunParams from "./PlaybookRunParams";
import PlaybookSelectResource from "./PlaybookSelectResource";

type SubmitPlaybookRunFormModalSizes = {
  width: ModalSize;
  height: string;
};

export const submitPlaybookRunFormModalSizesAtom = atom<
  SubmitPlaybookRunFormModalSizes | undefined
>(undefined);

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
  onClose?: () => void;
  playbook: Pick<PlaybookSpec, "id" | "spec" | "name">;
  checkId?: string;
  componentId?: string;
  configId?: string;
  params?: Record<string, any>;
  isReRun?: boolean;
};

export default function SubmitPlaybookRunForm({
  isOpen,
  onClose = () => {},
  playbook,
  checkId,
  componentId,
  configId,
  isReRun = false,
  params = {}
}: Props) {
  const [modalSize, setModalSize] = useAtom(
    submitPlaybookRunFormModalSizesAtom
  );

  const navigate = useNavigate();

  const initialValues: Partial<SubmitPlaybookRunFormValues> = useMemo(() => {
    return {
      id: playbook.id,
      component_id: componentId,
      check_id: checkId,
      config_id: configId,
      params: {
        ...params
      }
    };
  }, [checkId, componentId, configId, params, playbook.id]);

  const { mutate: submitPlaybookRun, isLoading } = useSubmitPlaybookRunMutation(
    {
      onSuccess: (run) => {
        navigate(`/playbooks/runs/${run.run_id}`);
      },
      onError: (error) => {
        const message =
          ((error as AxiosError).response?.data as any)?.error ?? error.message;
        toastError(message ?? error.message);
      }
    }
  );

  const resource = getResourceForRun(initialValues);

  const isResourceRequired =
    !!playbook.spec?.configs ||
    !!playbook.spec?.components ||
    !!playbook.spec?.checks;

  return (
    <Modal
      title={
        <PlaybookSpecModalTitle
          playbookSpec={playbook}
          defaultTitle={playbook.name ?? "Run Playbook"}
        />
      }
      open={isOpen}
      onClose={() => {
        onClose();
        setModalSize(undefined);
      }}
      size={modalSize?.width ?? "medium"}
    >
      <Formik
        initialValues={initialValues}
        validateOnMount
        onSubmit={(values) => {
          submitPlaybookRun(values as SubmitPlaybookRunFormValues);
        }}
      >
        {({ values, handleSubmit, isValid }) => {
          return (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col overflow-y-auto"
            >
              <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                {resource ? (
                  <>
                    <label className="form-label mb-0 text-lg">Resource</label>
                    <div className="mb-2 flex flex-col gap-2">
                      {resource.link}
                    </div>
                  </>
                ) : (
                  // we need playbookSpec to render this, as it has filters
                  playbook.spec && (
                    <PlaybookSelectResource playbook={playbook} />
                  )
                )}
                {isResourceRequired && (
                  <div className="mb-4 mt-2 border-b border-gray-200" />
                )}
                <div className="mb-4 flex flex-col gap-2">
                  <label className="form-label mb-4 text-lg">
                    Playbook Parameters
                  </label>
                  <PlaybookRunParams
                    isResourceRequired={isResourceRequired}
                    playbook={playbook}
                    isReRun={isReRun}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 rounded-b bg-slate-50 p-4 ring-1 ring-black/5">
                <Button
                  disabled={values.id === undefined || !isValid || isLoading}
                  role="button"
                  type="submit"
                >
                  {isLoading ? "Running..." : "Run"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}
