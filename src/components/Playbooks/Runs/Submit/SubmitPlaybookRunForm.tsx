import { useSubmitPlaybookRunMutation } from "@flanksource-ui/api/query-hooks/playbooks";
import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal, ModalSize } from "@flanksource-ui/ui/Modal";
import { AxiosError } from "axios";
import { Form, Formik } from "formik";
import { atom, useAtom } from "jotai";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { toastError, toastSuccess } from "../../../Toast/toast";
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
  onClose: () => void;
  playbook: PlaybookSpec;
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
  const [modalSize, setModalSize] = useAtom(
    submitPlaybookRunFormModalSizesAtom
  );

  const initialValues: Partial<SubmitPlaybookRunFormValues> = useMemo(() => {
    return {
      id: playbook.id,
      component_id: componentId,
      check_id: checkId,
      config_id: configId,
      params: {}
    };
  }, [checkId, componentId, configId, playbook.id]);

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
              className="flex flex-col flex-1 overflow-y-auto"
            >
              <div className="flex flex-col overflow-y-auto px-4 py-4 flex-1">
                {resource ? (
                  <>
                    <label className="form-label text-lg mb-0">Resource</label>
                    <div className="flex flex-col gap-2 mb-2">
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
                  <div className="border-b border-gray-200 mb-4 mt-2" />
                )}
                <div className="flex flex-col gap-2 mb-4">
                  <label className="form-label text-lg mb-4">
                    Playbook Parameters
                  </label>
                  <PlaybookRunParams
                    isResourceRequired={isResourceRequired}
                    playbook={playbook}
                  />
                </div>
              </div>

              <div className="flex justify-end p-4 rounded-b space-x-2 bg-slate-50  ring-1 ring-black/5 ">
                <Button
                  disabled={values.id === undefined || !isValid}
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
