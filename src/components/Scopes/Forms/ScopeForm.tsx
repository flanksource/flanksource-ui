import { Modal } from "@flanksource-ui/ui/Modal";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Formik, Form } from "formik";
import { FaSpinner } from "react-icons/fa";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import ScopeTargetsForm from "./ScopeTargetsForm";
import DeleteScope from "./DeleteScope";
import {
  useCreateScopeMutation,
  useUpdateScopeMutation
} from "@flanksource-ui/api/query-hooks/useScopesQuery";
import { ScopeDisplay, ScopeDB } from "@flanksource-ui/api/types/scopes";
import {
  toastSuccess,
  toastError
} from "@flanksource-ui/components/Toast/toast";
import CanEditResource from "@flanksource-ui/components/Settings/CanEditResource";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { useUser } from "@flanksource-ui/context";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import YAML from "yaml";

type ScopeFormProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: ScopeDisplay;
};

export default function ScopeForm({ isOpen, onClose, data }: ScopeFormProps) {
  const isReadOnly = data?.source === "KubernetesCRD";
  const { user } = useUser();

  const { mutate: create, isLoading: isCreating } = useCreateScopeMutation();
  const { mutate: update, isLoading: isUpdating } = useUpdateScopeMutation();

  const isLoading = isCreating || isUpdating;

  const handleSubmit = (values: Partial<ScopeDB>) => {
    // Convert tags object to tagSelector string for each target
    const transformedTargets = values.targets?.map((target: any) => {
      const transformTarget = (selector: any) => {
        if (!selector) return selector;

        // Convert tags object to tagSelector string
        const tagSelector = selector.tags
          ? Object.entries(selector.tags)
              .map(([key, value]) => `${key}=${value}`)
              .join(",")
          : selector.tagSelector || "";

        // Remove tags field and set tagSelector
        const { tags, ...rest } = selector;
        return { ...rest, tagSelector };
      };

      return {
        config: target.config ? transformTarget(target.config) : undefined,
        component: target.component
          ? transformTarget(target.component)
          : undefined,
        playbook: target.playbook
          ? transformTarget(target.playbook)
          : undefined,
        canary: target.canary ? transformTarget(target.canary) : undefined,
        global: target.global ? transformTarget(target.global) : undefined
      };
    });

    const payload = {
      ...values,
      targets: transformedTargets,
      source: values.source || "UI"
    };

    if (data?.id) {
      update(
        {
          id: data.id,
          data: payload
        },
        {
          onSuccess: () => {
            toastSuccess("Scope updated");
            onClose();
          },
          onError: (error: any) => {
            toastError(error.message);
          }
        }
      );
    } else {
      create(
        {
          ...payload,
          created_by: user?.id!
        },
        {
          onSuccess: () => {
            toastSuccess("Scope created");
            onClose();
          },
          onError: (error: any) => {
            toastError(error.message);
          }
        }
      );
    }
  };

  // Convert tagSelector string to tags object for form display
  const initialTargets = data?.targets
    ? data.targets.map((target: any) => {
        const convertSelector = (selector: any) => {
          if (!selector) return selector;

          // Convert tagSelector string to tags object
          const tags: Record<string, string> = {};
          if (selector.tagSelector) {
            selector.tagSelector.split(",").forEach((pair: string) => {
              const [key, value] = pair.split("=");
              if (key && value) {
                tags[key.trim()] = value.trim();
              }
            });
          }

          return { ...selector, tags };
        };

        return {
          config: target.config ? convertSelector(target.config) : undefined,
          component: target.component
            ? convertSelector(target.component)
            : undefined,
          playbook: target.playbook
            ? convertSelector(target.playbook)
            : undefined,
          canary: target.canary ? convertSelector(target.canary) : undefined,
          global: target.global ? convertSelector(target.global) : undefined
        };
      })
    : [{ config: { name: "", agent: "", tagSelector: "", tags: {} } }];

  return (
    <Modal
      title={data?.id ? "Edit Scope" : "Add Scope"}
      onClose={onClose}
      open={isOpen}
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
      helpLink="/reference/scopes"
    >
      <Formik<Partial<ScopeDB>>
        initialValues={{
          name: data?.name || "",
          namespace: data?.namespace || "",
          description: data?.description || "",
          targets: initialTargets,
          source: data?.source || "UI"
        }}
        onSubmit={handleSubmit}
        validate={(values) => {
          const errors: any = {};

          // Validate name
          if (!values.name) {
            errors.name = "Name is required";
          }

          // Validate targets
          if (!values.targets || values.targets.length === 0) {
            errors.targets = "At least one target is required";
          } else {
            // Validate each target has exactly one resource type
            values.targets.forEach((target: any, index: number) => {
              const resourceTypes = [
                target.config,
                target.component,
                target.playbook,
                target.canary,
                target.global
              ].filter(Boolean);

              if (resourceTypes.length === 0) {
                if (!errors.targets) errors.targets = [];
                errors.targets[index] =
                  "Each target must specify exactly one resource type";
              } else if (resourceTypes.length > 1) {
                if (!errors.targets) errors.targets = [];
                errors.targets[index] =
                  "Each target can only have one resource type";
              }
            });
          }

          return errors;
        }}
      >
        <Form className="flex flex-1 flex-col gap-2 overflow-y-auto">
          <div className="flex flex-1 flex-col space-y-3 overflow-y-auto p-4">
            {isReadOnly && (
              <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                <p className="font-medium">
                  Read-Only Mode: This resource is managed by Kubernetes CRD and
                  cannot be edited from the UI.
                </p>
              </div>
            )}

            <div className={isReadOnly ? "pointer-events-none opacity-60" : ""}>
              <FormikTextInput
                name="name"
                label="Name"
                required
                disabled={isReadOnly}
              />
            </div>

            {/* Only show namespace field for KubernetesCRD sources (read-only) */}
            {isReadOnly && (
              <div className="pointer-events-none opacity-60">
                <FormikTextInput
                  name="namespace"
                  label="Namespace"
                  disabled={true}
                />
              </div>
            )}

            <div className={isReadOnly ? "pointer-events-none opacity-60" : ""}>
              <FormikTextArea
                name="description"
                label="Description"
                disabled={isReadOnly}
              />
            </div>

            {isReadOnly ? (
              <div className="flex flex-col gap-2">
                <label className="form-label">Targets</label>
                <div className="rounded border border-gray-300 bg-gray-50">
                  <JSONViewer
                    code={YAML.stringify(data?.targets || [])}
                    format="yaml"
                    showLineNo={false}
                  />
                </div>
              </div>
            ) : (
              <ScopeTargetsForm disabled={isReadOnly} />
            )}
          </div>

          <CanEditResource
            id={data?.id}
            resourceType="scopes"
            source={data?.source}
            className="flex items-center justify-between bg-gray-100 px-5 py-4"
          >
            <div>
              {data?.id && data.source === "UI" && (
                <AuthorizationAccessCheck
                  resource={tables.scopes}
                  action="write"
                >
                  <DeleteScope scopeId={data.id} onDeleted={onClose} />
                </AuthorizationAccessCheck>
              )}
            </div>
            <AuthorizationAccessCheck resource={tables.scopes} action="write">
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
