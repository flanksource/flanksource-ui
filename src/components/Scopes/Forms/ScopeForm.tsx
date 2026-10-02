import { Modal } from "@flanksource-ui/ui/Modal";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Formik, Form } from "formik";
import { FaSpinner } from "react-icons/fa";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import ScopeTargetsForm from "./ScopeTargetsForm";
import DeleteRbacObjectButton from "@flanksource-ui/components/Permissions/Rbac/DeleteRbacObjectButton";
import {
  RbacObjectNotInEffect,
  RbacObjectStatus
} from "@flanksource-ui/components/Permissions/Rbac/RbacObjectStatus";
import { RbacObjectYaml } from "@flanksource-ui/components/Permissions/Rbac/RbacObjectYaml";
import { notifyRbacSaved } from "@flanksource-ui/components/Permissions/Rbac/notifyRbacSaved";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@flanksource-ui/components/ui/tabs";
import {
  useCreateScopeMutation,
  useUpdateScopeMutation
} from "@flanksource-ui/api/query-hooks/useScopesQuery";
import {
  ScopeDisplay,
  ScopeDB,
  ScopeTargetForm,
  ScopeResourceSelectorForm,
  ScopeTarget
} from "@flanksource-ui/api/types/scopes";
import {
  RBAC_DEFAULT_NAMESPACE,
  getRbacReadOnlyReason,
  toRbacManifest
} from "@flanksource-ui/api/types/rbacResources";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import CanEditResource from "@flanksource-ui/components/Settings/CanEditResource";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import YAML from "yaml";

type ScopeFormProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: ScopeDisplay;
};

export default function ScopeForm({ isOpen, onClose, data }: ScopeFormProps) {
  const readOnlyReason = getRbacReadOnlyReason("scopes", data);
  const isReadOnly = !!readOnlyReason;

  const { mutate: create, isLoading: isCreating } = useCreateScopeMutation();
  const { mutate: update, isLoading: isUpdating } = useUpdateScopeMutation();

  const isLoading = isCreating || isUpdating;

  const handleSubmit = (values: Partial<ScopeDB>) => {
    // Convert tags object to tagSelector string for each target
    const transformedTargets = values.targets?.map(
      (target: ScopeTargetForm) => {
        const transformTarget = (selector: ScopeResourceSelectorForm) => {
          if (!selector) return selector;

          // If wildcard is enabled, only send {name: "*"}
          if (selector.wildcard) {
            return { name: "*" };
          }

          // Convert tags object to tagSelector string
          const tagSelector = selector.tags
            ? Object.entries(selector.tags)
                .map(([key, value]) => `${key}=${value}`)
                .join(",")
            : selector.tagSelector || "";

          // Remove tags and wildcard fields
          const { tags, wildcard, ...rest } = selector;

          // Add tagSelector if it's not empty
          const result = tagSelector ? { ...rest, tagSelector } : rest;

          // Remove all empty strings
          return Object.fromEntries(
            Object.entries(result).filter(([_, value]) => value !== "")
          );
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
          view: target.view ? transformTarget(target.view) : undefined,
          global: target.global ? transformTarget(target.global) : undefined
        };
      }
    );

    // New scopes go to the default namespace; the namespace and name of an existing one can't change
    const manifest = toRbacManifest(
      "scopes",
      { name: data?.name ?? values.name!, namespace: data?.namespace },
      {
        description: values.description || undefined,
        targets: (transformedTargets ?? []) as ScopeTarget[]
      }
    );

    const mutationOptions = (verb: "created" | "updated") => ({
      onSuccess: (saved: ScopeDB) => {
        notifyRbacSaved("scopes", verb, saved);
        onClose();
      },
      onError: (error: unknown) => {
        toastError(error);
      }
    });

    if (data?.id) {
      update(manifest, mutationOptions("updated"));
    } else {
      create(manifest, mutationOptions("created"));
    }
  };

  // Convert tagSelector string to tags object for form display
  const initialTargets = data?.targets
    ? data.targets.map((target: any) => {
        const convertSelector = (selector: any) => {
          if (!selector) return selector;

          // Check if this is a wildcard selector (name: "*" and no other fields)
          const isWildcard =
            selector.name === "*" && !selector.agent && !selector.tagSelector;

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

          return { ...selector, tags, wildcard: isWildcard };
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
          view: target.view ? convertSelector(target.view) : undefined,
          global: target.global ? convertSelector(target.global) : undefined
        };
      })
    : [
        {
          config: {
            name: "",
            agent: "",
            tagSelector: "",
            tags: {},
            wildcard: false
          }
        }
      ];

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
                target.view,
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
              } else {
                // Validate that the target is not empty
                const selectedResource = resourceTypes[0];
                const name = selectedResource.name || "";
                const agent = selectedResource.agent || "";
                const tags = selectedResource.tags || {};
                const wildcard = selectedResource.wildcard || false;
                const tagsLength = Object.keys(tags).length;

                // If wildcard is enabled, validation passes
                const isEmpty =
                  !wildcard && tagsLength === 0 && name === "" && agent === "";

                if (isEmpty) {
                  if (!errors.targets) errors.targets = [];
                  errors.targets[index] =
                    "Target cannot be empty. Please specify at least one of: name, agent, tags, or enable wildcard";
                }
              }
            });
          }

          return errors;
        }}
      >
        {({ isSubmitting, submitCount }) => {
          const fields = (
            <div className="flex flex-col space-y-3">
              {readOnlyReason && (
                <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                  <p className="font-medium">{readOnlyReason}</p>
                </div>
              )}

              {data && <RbacObjectNotInEffect {...data} />}

              <div
                className={isReadOnly ? "pointer-events-none opacity-60" : ""}
              >
                <FormikTextInput
                  name="name"
                  label="Name"
                  required
                  // The API identifies a scope by namespace and name, so it can't be renamed
                  disabled={isReadOnly || !!data}
                />
              </div>

              {data ? (
                <div className="pointer-events-none opacity-60">
                  <FormikTextInput
                    name="namespace"
                    label="Namespace"
                    disabled={true}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  The scope is created in the{" "}
                  <code>{RBAC_DEFAULT_NAMESPACE}</code> namespace.
                </p>
              )}

              <div
                className={isReadOnly ? "pointer-events-none opacity-60" : ""}
              >
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
                <ScopeTargetsForm
                  disabled={isReadOnly}
                  submitCount={submitCount}
                />
              )}
            </div>
          );

          return (
            <Form className="flex flex-1 flex-col gap-2 overflow-y-auto">
              <div className="flex flex-1 flex-col overflow-y-auto p-4">
                {data ? (
                  <Tabs defaultValue="form" className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <TabsList>
                        <TabsTrigger value="form">Form</TabsTrigger>
                        <TabsTrigger value="yaml">YAML</TabsTrigger>
                      </TabsList>
                      <RbacObjectStatus {...data} />
                    </div>
                    <TabsContent value="form">{fields}</TabsContent>
                    <TabsContent value="yaml">
                      <RbacObjectYaml
                        manifest={toRbacManifest("scopes", data, {
                          description: data.description || undefined,
                          targets: data.targets
                        })}
                      />
                    </TabsContent>
                  </Tabs>
                ) : (
                  fields
                )}
              </div>

              <CanEditResource
                id={data?.id}
                resourceType="scopes"
                source={data?.source}
                namespace={data?.namespace ?? undefined}
                name={data?.name}
                className="flex items-center justify-between bg-gray-100 px-5 py-4"
              >
                {isReadOnly ? (
                  <div />
                ) : (
                  <>
                    <div>
                      {data?.namespace && (
                        <AuthorizationAccessCheck
                          resource={tables.rbac}
                          action="write"
                        >
                          <DeleteRbacObjectButton
                            resource="scopes"
                            namespace={data.namespace}
                            name={data.name}
                            onDeleted={onClose}
                          />
                        </AuthorizationAccessCheck>
                      )}
                    </div>
                    <AuthorizationAccessCheck
                      resource={tables.rbac}
                      action="write"
                    >
                      <Button
                        type="submit"
                        text={data?.id ? "Save" : "Create"}
                        className="btn-primary"
                        icon={
                          isLoading ? (
                            <FaSpinner className="animate-spin" />
                          ) : undefined
                        }
                        disabled={isLoading || isSubmitting}
                      />
                    </AuthorizationAccessCheck>
                  </>
                )}
              </CanEditResource>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}
