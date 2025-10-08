import { Modal } from "@flanksource-ui/ui/Modal";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Formik, Form } from "formik";
import { FaSpinner } from "react-icons/fa";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import AccessScopeSubjectControls from "./AccessScopeSubjectControls";
import AccessScopeResourcesSelect from "./AccessScopeResourcesSelect";
import AccessScopeCriteriaForm from "./AccessScopeCriteriaForm";
import DeleteAccessScope from "./DeleteAccessScope";
import {
  useCreateAccessScopeMutation,
  useUpdateAccessScopeMutation
} from "@flanksource-ui/api/query-hooks/useAccessScopesQuery";
import {
  AccessScopeDisplay,
  AccessScopeDB,
  AccessScopeScope
} from "@flanksource-ui/api/types/accessScopes";
import {
  toastSuccess,
  toastError
} from "@flanksource-ui/components/Toast/toast";
import CanEditResource from "@flanksource-ui/components/Settings/CanEditResource";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";

// Form values type - names is string for textarea input
type AccessScopeFormScope = Omit<AccessScopeScope, "names"> & {
  names?: string;
};

type AccessScopeFormValues = Omit<Partial<AccessScopeDB>, "scopes"> & {
  scopes?: AccessScopeFormScope[];
};

type AccessScopeFormProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: AccessScopeDisplay;
};

export default function AccessScopeForm({
  isOpen,
  onClose,
  data
}: AccessScopeFormProps) {
  const isReadOnly = data?.source === "KubernetesCRD";

  const { mutate: create, isLoading: isCreating } =
    useCreateAccessScopeMutation();
  const { mutate: update, isLoading: isUpdating } =
    useUpdateAccessScopeMutation();

  const isLoading = isCreating || isUpdating;

  const handleSubmit = (values: AccessScopeFormValues) => {
    // Transform names from textarea string to array
    const transformedScopes = values.scopes?.map((scope: any) => ({
      ...scope,
      names:
        typeof scope.names === "string"
          ? scope.names
              .split("\n")
              .map((n: string) => n.trim())
              .filter(Boolean)
          : scope.names
    }));

    const payload = {
      ...values,
      scopes: transformedScopes,
      source: values.source || "UI"
    };

    if (data?.id) {
      update(
        { id: data.id, data: payload },
        {
          onSuccess: () => {
            toastSuccess("Access Scope updated");
            onClose();
          },
          onError: (error: any) => {
            toastError(error.message);
          }
        }
      );
    } else {
      create(payload, {
        onSuccess: () => {
          toastSuccess("Access Scope created");
          onClose();
        },
        onError: (error: any) => {
          toastError(error.message);
        }
      });
    }
  };

  // Transform names array to textarea string for editing
  const initialScopes = data?.scopes?.map((scope) => ({
    ...scope,
    names: Array.isArray(scope.names) ? scope.names.join("\n") : scope.names
  }));

  return (
    <Modal
      title={data?.id ? "Edit Access Scope" : "Add Access Scope"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      helpLink="/reference/access-scopes"
    >
      <Formik<AccessScopeFormValues>
        initialValues={{
          name: data?.name || "",
          namespace: data?.namespace || "",
          description: data?.description || "",
          person_id: data?.person_id,
          team_id: data?.team_id,
          resources: data?.resources || [],
          scopes: initialScopes || [{ tags: {}, agents: [], names: "" }],
          source: data?.source || "UI"
        }}
        onSubmit={handleSubmit}
        validate={(values) => {
          const errors: any = {};

          // Validate subject
          if (!values.person_id && !values.team_id) {
            errors.person_id = "Either Person or Team must be selected";
          }

          // Validate resources
          if (!values.resources || values.resources.length === 0) {
            errors.resources = "At least one resource type is required";
          }

          // Validate scopes
          if (!values.scopes || values.scopes.length === 0) {
            errors.scopes = "At least one scope is required";
          } else {
            values.scopes.forEach((scope: any, index: number) => {
              const hasAnyField =
                (scope.tags && Object.keys(scope.tags).length > 0) ||
                (scope.agents && scope.agents.length > 0) ||
                (scope.names && scope.names.trim().length > 0);

              if (!hasAnyField) {
                if (!errors.scopes) errors.scopes = [];
                errors.scopes[index] =
                  "Each scope must have at least one of: tags, agents, or names";
              }
            });
          }

          return errors;
        }}
      >
        <Form className="flex flex-1 flex-col gap-2 overflow-y-auto">
          <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4">
            <FormikTextInput
              name="name"
              label="Name"
              required
              disabled={isReadOnly}
            />

            <FormikTextInput
              name="namespace"
              label="Namespace"
              disabled={isReadOnly}
            />

            <FormikTextArea
              name="description"
              label="Description"
              disabled={isReadOnly}
            />

            <AccessScopeSubjectControls />

            <AccessScopeResourcesSelect />

            <AccessScopeCriteriaForm />
          </div>

          <CanEditResource
            id={data?.id}
            resourceType="access_scopes"
            source={data?.source}
            className="flex items-center justify-between bg-gray-100 px-5 py-4"
          >
            <div>
              {data?.id && data.source === "UI" && (
                <AuthorizationAccessCheck
                  resource={tables.access_scopes}
                  action="write"
                >
                  <DeleteAccessScope
                    accessScopeId={data.id}
                    onDeleted={onClose}
                  />
                </AuthorizationAccessCheck>
              )}
            </div>
            <AuthorizationAccessCheck
              resource={tables.access_scopes}
              action="write"
            >
              <Button
                type="submit"
                text={data?.id ? "Save" : "Create"}
                className="btn-primary"
                icon={
                  isLoading ? <FaSpinner className="animate-spin" /> : undefined
                }
                disabled={isLoading}
              />
            </AuthorizationAccessCheck>
          </CanEditResource>
        </Form>
      </Formik>
    </Modal>
  );
}
