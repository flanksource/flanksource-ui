import {
  useCreateRoleMutation,
  useRoleBindingNamesForRoleQuery,
  useUpdateRoleMutation
} from "@flanksource-ui/api/query-hooks/useRolesQuery";
import {
  RBAC_DEFAULT_NAMESPACE,
  getRbacReadOnlyReason,
  toRbacManifest
} from "@flanksource-ui/api/types/rbacResources";
import { RoleDB, RoleDisplay } from "@flanksource-ui/api/types/roles";
import FormikTextArea from "@flanksource-ui/components/Forms/Formik/FormikTextArea";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import DeleteRbacObjectButton from "@flanksource-ui/components/Permissions/Rbac/DeleteRbacObjectButton";
import {
  RbacObjectNotInEffect,
  RbacObjectStatus
} from "@flanksource-ui/components/Permissions/Rbac/RbacObjectStatus";
import { RbacObjectYaml } from "@flanksource-ui/components/Permissions/Rbac/RbacObjectYaml";
import { notifyRbacSaved } from "@flanksource-ui/components/Permissions/Rbac/notifyRbacSaved";
import CRDSource from "@flanksource-ui/components/Settings/CRDSource";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@flanksource-ui/components/ui/tabs";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import { Form, Formik, useFormikContext } from "formik";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import RoleRulesList from "../RoleRulesList";
import {
  RoleFormValues,
  formValuesToSpec,
  hasScopeReference,
  roleToFormValues,
  validateRoleForm
} from "../roleFormValues";
import RoleRulesForm from "./RoleRulesForm";

// A Role can only reference Scopes in its own namespace, so a new Role takes the namespace
// of the first Scope picked, and is free again once no rule references a Scope.
function RoleNamespace({ fixed }: { fixed?: string | null }) {
  const { values, setFieldValue } = useFormikContext<RoleFormValues>();
  const referencesScope = hasScopeReference(values);

  useEffect(() => {
    if (!fixed && !referencesScope && values.namespace) {
      setFieldValue("namespace", undefined);
    }
  }, [fixed, referencesScope, values.namespace, setFieldValue]);

  if (fixed) {
    return (
      <div className="pointer-events-none opacity-60">
        <FormikTextInput name="namespace" label="Namespace" disabled />
      </div>
    );
  }

  return (
    <p className="text-sm text-gray-500">
      {values.namespace ? (
        <>
          The role is created in the <code>{values.namespace}</code> namespace,
          where its scopes are. Only scopes in that namespace can be used.
        </>
      ) : (
        <>
          The role is created in the namespace of the scopes it uses, or{" "}
          <code>{RBAC_DEFAULT_NAMESPACE}</code>.
        </>
      )}
    </p>
  );
}

function RoleBindingsForRole({ role }: { role: RoleDisplay }) {
  const { data: bindings, isLoading } = useRoleBindingNamesForRoleQuery(
    role.namespace,
    role.name
  );

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="form-label">Granted by</label>
      {bindings && bindings.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {bindings.map((binding) => (
            <span
              key={binding.name}
              className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-gray-700"
            >
              {binding.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          No role binding grants this role, so it grants nothing yet.
        </p>
      )}
    </div>
  );
}

type RoleFormProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: RoleDisplay;
};

export default function RoleForm({ isOpen, onClose, data }: RoleFormProps) {
  const readOnlyReason = getRbacReadOnlyReason("roles", data);
  const isReadOnly = !!readOnlyReason;

  const { mutate: create, isLoading: isCreating } = useCreateRoleMutation();
  const { mutate: update, isLoading: isUpdating } = useUpdateRoleMutation();
  const isLoading = isCreating || isUpdating;

  const handleSubmit = (values: RoleFormValues) => {
    // The namespace and name of an existing role can't change
    const manifest = toRbacManifest(
      "roles",
      {
        name: data?.name ?? values.name,
        namespace: data?.namespace ?? values.namespace
      },
      formValuesToSpec(values)
    );

    const mutationOptions = (verb: "created" | "updated") => ({
      onSuccess: (saved: RoleDB) => {
        notifyRbacSaved("roles", verb, saved);
        onClose();
      },
      onError: (error: unknown) => {
        toastError(error);
      }
    });

    if (data) {
      update(manifest, mutationOptions("updated"));
    } else {
      create(manifest, mutationOptions("created"));
    }
  };

  return (
    <Modal
      title={data ? "Edit Role" : "Add Role"}
      onClose={onClose}
      open={isOpen}
      size="large"
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik<RoleFormValues>
        initialValues={roleToFormValues(data)}
        onSubmit={handleSubmit}
        validate={validateRoleForm}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          const fields = (
            <div className="flex flex-col space-y-4">
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
                  // The API identifies a role by namespace and name, so it can't be renamed
                  disabled={isReadOnly || !!data}
                />
              </div>

              <RoleNamespace fixed={data?.namespace} />

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
                <RoleRulesList rules={data?.rules ?? []} />
              ) : (
                <RoleRulesForm
                  namespace={data?.namespace ?? values.namespace}
                  onScopeChange={(scope) => {
                    if (!data && scope?.namespace && !values.namespace) {
                      setFieldValue("namespace", scope.namespace);
                    }
                  }}
                />
              )}

              {data && <RoleBindingsForRole role={data} />}
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
                        manifest={toRbacManifest("roles", data, {
                          description: data.description || undefined,
                          rules: data.rules
                        })}
                      />
                    </TabsContent>
                  </Tabs>
                ) : (
                  fields
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-100 px-5 py-4">
                {isReadOnly ? (
                  <CRDSource
                    id={data?.id}
                    source={data?.source}
                    namespace={data?.namespace ?? undefined}
                    name={data?.name}
                  />
                ) : (
                  <>
                    <div>
                      {data?.namespace && (
                        <AuthorizationAccessCheck
                          resource={tables.rbac}
                          action="write"
                        >
                          <DeleteRbacObjectButton
                            resource="roles"
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
                        text={data ? "Save" : "Create"}
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
              </div>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}
