import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaTrash } from "react-icons/fa";
import {
  createPlaybookSpec,
  deletePlaybookSpec,
  updatePlaybookSpec
} from "../../../api/services/playbooks";
import {
  NewPlaybookSpec,
  PlaybookSpec,
  UpdatePlaybookSpec
} from "../../../api/types/playbooks";
import { useUser } from "../../../context";
import { Button } from "../../../ui/Button";
import { Modal } from "../../../ui/Modal";
import { FormikCodeEditor } from "../../Forms/Formik/FormikCodeEditor";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import { toastError, toastSuccess } from "../../Toast/toast";
import PlaybookSpecModalTitle from "../PlaybookSpecModalTitle";

type PlaybookSpecsFormProps = {
  playbook?: PlaybookSpec;
  isOpen: boolean;
  onClose: () => void;
  refresh?: () => void;
};

export default function PlaybookSpecsForm({
  playbook,
  isOpen,
  onClose,
  refresh = () => {}
}: PlaybookSpecsFormProps) {
  const { user } = useUser();

  const { mutate: createPlaybook } = useMutation({
    mutationFn: async (payload: NewPlaybookSpec) => {
      const res = await createPlaybookSpec({
        ...payload,
        created_by: user?.id
      });
      return res;
    },
    onSuccess: () => {
      toastSuccess("Playbook Spec created successfully");
      refresh();
      onClose();
    }
  });

  const { mutate: updatePlaybook } = useMutation({
    mutationFn: async ({
      id,
      name,
      source,
      spec,
      description,
      icon
    }: PlaybookSpec) => {
      // let's avoid updating fields that are not editable
      const newPayload: UpdatePlaybookSpec = {
        id,
        name,
        source,
        spec,
        // temporary fix for updating category
        category: spec.category,
        description,
        icon
      };
      const res = await updatePlaybookSpec(newPayload);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Playbook Spec updated successfully");
      refresh();
      onClose();
    },
    onError: (err: Error) => {
      toastSuccess("Unable to update playbook spec: " + err.message);
    }
  });

  const { mutate: deletePlaybook, isLoading: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const res = await deletePlaybookSpec(id);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Playbook Spec updated successfully");
      onClose();
    },
    onError: (err: Error) => {
      toastError("Unable to delete playbook spec: " + err.message);
    }
  });

  return (
    <Modal
      title={
        <PlaybookSpecModalTitle
          playbookSpec={playbook}
          defaultTitle="Create Playbook Spec"
        />
      }
      onClose={onClose}
      open={isOpen}
      size="full"
      containerClassName="h-full overflow-auto"
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik
        initialValues={
          playbook || {
            name: undefined,
            source: "UI",
            category: undefined,
            spec: undefined,
            created_by: user?.id
          }
        }
        onSubmit={(value) => {
          console.log(value);
          if (playbook?.id) {
            updatePlaybook(value as PlaybookSpec);
          } else {
            createPlaybook(value as NewPlaybookSpec);
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form
            className="flex flex-col flex-1 overflow-y-auto"
            onSubmit={handleSubmit}
          >
            <div className={clsx("flex flex-col h-full my-2 overflow-y-auto")}>
              <div
                className={clsx(
                  "flex flex-col flex-1 px-2 mb-2 overflow-y-auto"
                )}
              >
                <div className="flex flex-col flex-1 space-y-4 overflow-y-auto p-4">
                  <FormikTextInput name="name" label="Name" required />
                  <FormikCodeEditor
                    fieldName="spec"
                    label="Spec"
                    format="yaml"
                    className="flex flex-col flex-1"
                    jsonSchemaUrl="/api/schemas/playbook-spec.schema.json"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-4 px-5 bg-gray-100">
              {playbook?.id && (
                <Button
                  type="button"
                  text={isDeleting ? "Deleting..." : "Delete"}
                  icon={<FaTrash />}
                  onClick={() => {
                    deletePlaybook(playbook.id);
                  }}
                  className="btn-danger"
                />
              )}

              <Button
                type="submit"
                text={playbook?.id ? "Update" : "Save"}
                className="btn-primary ml-auto"
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
