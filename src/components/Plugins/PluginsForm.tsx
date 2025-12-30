import { ScrapePlugin } from "@flanksource-ui/api/services/scrapePlugins";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Form, Formik } from "formik";
import { useState } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { FormikCodeEditor } from "../Forms/Formik/FormikCodeEditor";
import FormikTextInput from "../Forms/Formik/FormikTextInput";

type PluginsFormProps = {
  formValue?: ScrapePlugin;
  onSubmit?: (values: { name: string; spec: Record<string, any> }) => void;
  onDelete?: (plugin: ScrapePlugin) => void;
  handleBack?: () => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  className?: string;
};

export default function PluginsForm({
  formValue,
  onSubmit = () => {},
  onDelete = () => {},
  handleBack = () => {},
  isSubmitting = false,
  isDeleting = false,
  className
}: PluginsFormProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const isReadOnly = formValue?.source === "KubernetesCRD";

  return (
    <Formik
      initialValues={{
        name: formValue?.name ?? "",
        spec: formValue?.spec
      }}
      onSubmit={(values) => {
        onSubmit({
          name: values.name,
          spec: values.spec ?? {}
        });
      }}
    >
      {({ handleSubmit }) => (
        <Form
          onSubmit={(e) => handleSubmit(e)}
          className={`flex flex-1 flex-col overflow-y-auto ${className || ""}`}
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {isReadOnly && (
              <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                <p className="font-medium">
                  Read-Only Mode: This resource is managed by Kubernetes CRD and
                  cannot be edited from the UI.
                </p>
              </div>
            )}
            <div className={`flex flex-1 flex-col gap-4`}>
              <FormikTextInput
                name="name"
                label="Name"
                required
                disabled={isReadOnly}
              />
              <FormikCodeEditor
                fieldName="spec"
                format="yaml"
                label="Spec"
                jsonSchemaUrl="https://raw.githubusercontent.com/flanksource/config-db/242c60fe51b3e8f8d82e8c6d3201cbd52645679d/config/schemas/scrape_plugin_spec.schema.json"
                className="flex min-h-[400px] flex-1 flex-col"
                enableSpecUnwrap
                required
                disabled={isReadOnly}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-4">
            {!formValue?.id && (
              <Button
                onClick={handleBack}
                className="btn-secondary"
                type="button"
              >
                Close
              </Button>
            )}
            {formValue?.id && !isReadOnly && (
              <AuthorizationAccessCheck
                resource={tables.database}
                action="write"
              >
                <Button
                  text="Delete"
                  icon={
                    !isDeleting ? (
                      <FaTrash />
                    ) : (
                      <FaSpinner className="animate-spin" />
                    )
                  }
                  disabled={isDeleting}
                  onClick={() => setIsConfirmDialogOpen(true)}
                  className="btn-danger"
                  type="button"
                />
              </AuthorizationAccessCheck>
            )}
            <div className="flex flex-1 justify-end gap-2">
              {!isReadOnly && (
                <AuthorizationAccessCheck
                  resource={tables.database}
                  action="write"
                >
                  <Button
                    type="submit"
                    icon={
                      isSubmitting ? (
                        <FaSpinner className="animate-spin" />
                      ) : undefined
                    }
                    text={formValue?.id ? "Update" : "Save"}
                    className="btn-primary"
                    disabled={isSubmitting}
                  />
                </AuthorizationAccessCheck>
              )}
            </div>
          </div>
          {isConfirmDialogOpen && formValue?.id && (
            <ConfirmationPromptDialog
              title="Delete plugin"
              description="Are you sure you want to delete this plugin?"
              onConfirm={() => {
                setIsConfirmDialogOpen(false);
                onDelete(formValue);
              }}
              isOpen={isConfirmDialogOpen}
              onClose={() => setIsConfirmDialogOpen(false)}
              className="z-[9999]"
            />
          )}
        </Form>
      )}
    </Formik>
  );
}
