import {
  useCreateRoleBindingMutation,
  useUpdateRoleBindingMutation
} from "@flanksource-ui/api/query-hooks/useRoleBindingsQuery";
import { useRolesQuery } from "@flanksource-ui/api/query-hooks/useRolesQuery";
import {
  getRbacReadOnlyReason,
  toRbacManifest
} from "@flanksource-ui/api/types/rbacResources";
import {
  RoleBindingDB,
  RoleBindingDisplay
} from "@flanksource-ui/api/types/roleBindings";
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
import { Form, Formik } from "formik";
import { FaSpinner } from "react-icons/fa";
import {
  RoleBindingFormValues,
  formValuesToSpec,
  roleBindingToFormValues,
  validateRoleBindingForm
} from "../roleBindingFormValues";
import FormikBindingRoleSelect from "./FormikBindingRoleSelect";
import RoleBindingConstraintsForm from "./RoleBindingConstraintsForm";
import RoleBindingSubjectsForm from "./RoleBindingSubjectsForm";

type RoleBindingFormProps = {
  isOpen: boolean;
  onClose: () => void;
  data?: RoleBindingDisplay;
};

export default function RoleBindingForm({
  isOpen,
  onClose,
  data
}: RoleBindingFormProps) {
  const readOnlyReason = getRbacReadOnlyReason("role-bindings", data);
  const isReadOnly = !!readOnlyReason;

  const { data: roles } = useRolesQuery();
  const { mutate: create, isLoading: isCreating } =
    useCreateRoleBindingMutation();
  const { mutate: update, isLoading: isUpdating } =
    useUpdateRoleBindingMutation();
  const isLoading = isCreating || isUpdating;

  const handleSubmit = (values: RoleBindingFormValues) => {
    // The namespace and name of an existing binding can't change
    const manifest = toRbacManifest(
      "role-bindings",
      {
        name: data?.name ?? values.name,
        namespace: data?.namespace ?? values.namespace
      },
      formValuesToSpec(values)
    );

    const mutationOptions = (verb: "created" | "updated") => ({
      onSuccess: (saved: RoleBindingDB) => {
        notifyRbacSaved("role-bindings", verb, saved);
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
      title={data ? "Edit Role Binding" : "Add Role Binding"}
      onClose={onClose}
      open={isOpen}
      size="large"
      bodyClass="flex flex-col w-full flex-1 h-full overflow-y-auto"
    >
      <Formik<RoleBindingFormValues>
        initialValues={roleBindingToFormValues(data)}
        onSubmit={handleSubmit}
        validate={validateRoleBindingForm}
      >
        {({ values, setFieldValue, isSubmitting }) => {
          // A binding grants a Role in its own namespace
          const namespace = data?.namespace ?? values.namespace;
          const role = (roles ?? []).find(
            (item) => item.namespace === namespace && item.name === values.role
          );

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
                  // The API identifies a binding by namespace and name, so it can't be renamed
                  disabled={isReadOnly || !!data}
                />
              </div>

              <div
                className={
                  isReadOnly
                    ? "pointer-events-none flex flex-col gap-1 opacity-60"
                    : "flex flex-col gap-1"
                }
              >
                <FormikBindingRoleSelect
                  namespace={data?.namespace ?? undefined}
                  onRoleChange={(picked) => {
                    // Constraints name rules of the previous role
                    setFieldValue("constraints", []);
                    if (!data) {
                      setFieldValue("namespace", picked?.namespace);
                    }
                  }}
                />
                <p className="text-xs text-gray-500">
                  {namespace ? (
                    <>
                      The binding is {data ? "in" : "created in"} the{" "}
                      <code>{namespace}</code> namespace, with its role.
                    </>
                  ) : (
                    "The binding is created in the namespace of its role."
                  )}
                </p>
              </div>

              <div
                className={isReadOnly ? "pointer-events-none opacity-60" : ""}
              >
                <FormikTextArea
                  name="description"
                  label="Description"
                  disabled={isReadOnly}
                />
              </div>

              <fieldset
                disabled={isReadOnly}
                className={
                  isReadOnly
                    ? "pointer-events-none flex flex-col space-y-4 opacity-60"
                    : "flex flex-col space-y-4"
                }
              >
                <RoleBindingSubjectsForm />
                <RoleBindingConstraintsForm
                  rules={role?.rules}
                  namespace={namespace}
                />
              </fieldset>
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
                        manifest={toRbacManifest("role-bindings", data, {
                          description: data.description || undefined,
                          role: data.role,
                          subjects: data.subjects,
                          constraints:
                            data.constraints && data.constraints.length > 0
                              ? data.constraints
                              : undefined
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
                            resource="role-bindings"
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
