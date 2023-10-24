import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaTrash } from "react-icons/fa";
import {
  createPlaybookSpec,
  deletePlaybookSpec,
  updatePlaybookSpec
} from "../../../api/services/playbooks";
import { useUser } from "../../../context";
import { Button } from "../../Button";
import { FormikCodeEditor } from "../../Forms/Formik/FormikCodeEditor";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import { Modal } from "../../Modal";
import { toastSuccess } from "../../Toast/toast";
import {
  NewPlaybookSpec,
  PlaybookSpec,
  UpdatePlaybookSpec
} from "../../../api/types/playbooks";

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
    mutationFn: async ({ id, name, source, spec }: PlaybookSpec) => {
      // let's avoid updating fields that are not editable
      const newPayload: UpdatePlaybookSpec = {
        id,
        name,
        source,
        spec
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
      toastSuccess("Unable to delete playbook spec: " + err.message);
    }
  });

  return (
    <Modal
      title={
        playbook
          ? `Edit Playbook Spec: ${playbook.name}`
          : "Create Playbook Spec"
      }
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik
        initialValues={
          playbook || {
            name: "",
            source: "UI",
            spec: "",
            created_by: user?.id
          }
        }
        onSubmit={(value) => {
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
              <div className={clsx("flex flex-col px-2 mb-2 overflow-y-auto")}>
                <div className="flex flex-col space-y-4 overflow-y-auto p-4">
                  <FormikTextInput name="name" label="Name" required />
                  <FormikCodeEditor
                    fieldName="spec"
                    label="Spec"
                    format="yaml"
                    className="flex flex-col h-[400px]"
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
                className="btn-primary"
              />
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
