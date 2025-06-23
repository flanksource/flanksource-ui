import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import clsx from "clsx";
import { Field, Form, Formik } from "formik";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import CanEditResource from "../Settings/CanEditResource";
import { FormikCodeEditor } from "../Forms/Formik/FormikCodeEditor";
import { Application } from "../../pages/applications/ApplicationsPage";

interface ApplicationFormProps {
  onApplicationSubmit?: (data: Application) => void;
  onApplicationDelete?: (data: Application) => void;
  className?: string;
  formValue?: Application;
  handleBack?: () => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

export function ApplicationForm({
  formValue,
  onApplicationSubmit,
  onApplicationDelete,
  className,
  handleBack = () => {},
  isSubmitting = false,
  isDeleting = false,
  ...props
}: ApplicationFormProps) {
  const handleSubmit = (value: any) => {
    onApplicationSubmit?.({
      ...value,
      namespace: value.namespace || "default",
      source: "UI"
    });
  };

  const handleDelete = () => {
    onApplicationDelete?.(formValue!);
  };

  return (
    <Formik
      initialValues={{
        name: formValue?.name || "",
        namespace: formValue?.namespace || "default",
        spec: formValue?.spec || {},
        ...formValue
      }}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex flex-1 flex-col overflow-y-auto">
          <div
            className={clsx(
              "my-2 flex h-full flex-col overflow-y-auto",
              className
            )}
            {...props}
          >
            <div
              className={clsx("mb-2 flex flex-1 flex-col overflow-y-auto px-2")}
            >
              <div className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="name"
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter application name"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Namespace
                  </label>
                  <Field
                    name="namespace"
                    type="text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="default"
                  />
                </div>

                <div className="flex flex-1 flex-col space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Spec <span className="text-red-500">*</span>
                  </label>
                  <FormikCodeEditor
                    fieldName="spec"
                    format="yaml"
                    className="flex min-h-[400px] flex-1 flex-col"
                    enableSpecUnwrap
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-4">
            <div className="flex flex-1 gap-2">
              {!formValue?.id && (
                <Button
                  text="Back"
                  onClick={handleBack}
                  className="btn-secondary"
                />
              )}

              {formValue?.id && (
                <AuthorizationAccessCheck
                  resource={tables.database}
                  action="write"
                >
                  <CanEditResource
                    id={formValue?.id}
                    namespace={formValue?.namespace}
                    name={formValue?.name}
                    resourceType={"applications"}
                    source={formValue?.source}
                    hideSourceLink
                    className="flex flex-row gap-2"
                  >
                    <Button
                      text="Delete"
                      icon={<FaTrash />}
                      onClick={handleDelete}
                      className="btn-danger"
                    />
                  </CanEditResource>
                </AuthorizationAccessCheck>
              )}

              {(formValue?.source === "UI" || !formValue?.source) && (
                <div className="flex-1" />
              )}

              <AuthorizationAccessCheck
                resource={tables.database}
                action="write"
              >
                <CanEditResource
                  id={formValue?.id}
                  namespace={formValue?.namespace}
                  name={formValue?.name}
                  resourceType={"applications"}
                  source={formValue?.source}
                  className="flex flex-row gap-2"
                >
                  <Button
                    type="submit"
                    icon={
                      isSubmitting ? (
                        <FaSpinner className="animate-spin" />
                      ) : undefined
                    }
                    text={Boolean(formValue?.id) ? "Update" : "Save"}
                    className="btn-primary"
                  />
                </CanEditResource>
              </AuthorizationAccessCheck>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ApplicationForm;
