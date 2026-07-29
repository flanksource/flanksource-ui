import {
  createPlaybookSpec,
  deletePlaybookSpec,
  updatePlaybookSpec
} from "@flanksource-ui/api/services/playbooks";
import {
  NewPlaybookSpec,
  PlaybookSpec,
  UpdatePlaybookSpec
} from "@flanksource-ui/api/types/playbooks";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaTrash } from "react-icons/fa";
import { FormikCodeEditor } from "../../Forms/Formik/FormikCodeEditor";
import FormikTextInput from "../../Forms/Formik/FormikTextInput";
import { AuthorizationAccessCheck } from "../../Permissions/AuthorizationAccessCheck";
import CanEditResource from "../../Settings/CanEditResource";
import { toastError, toastSuccess } from "../../Toast/toast";

type PlaybookSpecsFormProps = {
  playbook?: PlaybookSpec;
  onClose: () => void;
  refresh?: () => void;
};

export default function PlaybookSpecsForm({
  playbook,
  onClose,
  refresh = () => {}
}: PlaybookSpecsFormProps) {
  const { user } = useUser();

  // Only playbooks created in the UI are editable. Everything else is
  // reconciled from its source, so an edit here would be reverted.
  const isReadOnly = !!playbook && playbook.source !== "UI";

  const readOnlyOwner =
    playbook?.source === "ConfigFile"
      ? "a local file"
      : playbook?.source === "KubernetesCRD"
        ? "Kubernetes CRD"
        : "an external source";

  const { mutate: createPlaybook } = useMutation({
    mutationFn: async (payload: NewPlaybookSpec) => {
      const res = await createPlaybookSpec({
        ...payload,
        // we sync the title with the name field
        name: payload.title,
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
      title,
      source,
      spec,
      description,
      icon
    }: UpdatePlaybookSpec) => {
      // let's avoid updating fields that are not editable
      const newPayload: UpdatePlaybookSpec = {
        id,
        source,
        title,
        spec,
        // temporary fix for updating category
        category: spec?.category,
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
    <Formik<NewPlaybookSpec | UpdatePlaybookSpec>
      initialValues={
        playbook ||
        ({
          title: "",
          name: "",
          source: "UI",
          category: undefined,
          spec: undefined,
          created_by: user?.id
        } satisfies NewPlaybookSpec)
      }
      onSubmit={(value) => {
        if (playbook?.id) {
          updatePlaybook({
            ...value,
            // // we sync the title with the name field
            // name: playbook.title,
            id: playbook.id
          });
        } else {
          createPlaybook({
            ...value,
            // we sync the title with the name field
            name: value.title
          });
        }
      }}
    >
      {({ handleSubmit }) => (
        <Form
          className="flex flex-1 flex-col overflow-y-auto"
          onSubmit={handleSubmit}
        >
          <div className={clsx("my-2 flex h-full flex-col overflow-y-auto")}>
            <div
              className={clsx("mb-2 flex flex-1 flex-col overflow-y-auto px-2")}
            >
              <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4">
                {isReadOnly && (
                  <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                    <p className="font-medium">
                      Read-Only Mode: This playbook is managed by{" "}
                      {readOnlyOwner} and cannot be edited from the UI.
                    </p>
                  </div>
                )}
                <FormikTextInput
                  name="title"
                  label="Title"
                  required
                  disabled={isReadOnly}
                />
                <FormikCodeEditor
                  fieldName="spec"
                  label="Spec"
                  format="yaml"
                  className="flex flex-1 flex-col"
                  jsonSchemaUrl="/api/schemas/playbook-spec.schema.json"
                  required
                  enableSpecUnwrap
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between bg-gray-100 px-5 py-4">
            {playbook?.id && (
              <AuthorizationAccessCheck
                resource={tables.playbooks}
                action="write"
              >
                <CanEditResource
                  id={playbook.id}
                  namespace={playbook.namespace}
                  name={playbook.name}
                  resourceType="playbooks"
                  source={playbook.source}
                  hideSourceLink
                  className="flex flex-row gap-2"
                >
                  <Button
                    type="button"
                    text={isDeleting ? "Deleting..." : "Delete"}
                    icon={<FaTrash />}
                    onClick={() => {
                      deletePlaybook(playbook.id);
                    }}
                    className="btn-danger"
                  />
                </CanEditResource>
              </AuthorizationAccessCheck>
            )}

            <AuthorizationAccessCheck
              resource={tables.playbooks}
              action="write"
            >
              <CanEditResource
                id={playbook?.id}
                namespace={playbook?.namespace}
                name={playbook?.name}
                resourceType="playbooks"
                source={playbook?.source}
                className="ml-auto flex flex-row gap-2"
              >
                <Button
                  type="submit"
                  text={playbook?.id ? "Update" : "Save"}
                  className="btn-primary"
                />
              </CanEditResource>
            </AuthorizationAccessCheck>
          </div>
        </Form>
      )}
    </Formik>
  );
}
