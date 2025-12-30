import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { Button } from "../../ui/Buttons/Button";
import { FormikCodeEditor } from "../Forms/Formik/FormikCodeEditor";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import CanEditResource from "../Settings/CanEditResource";
import { Connection } from "./ConnectionFormModal";
import { TestConnection } from "./TestConnection";

interface ConnectionSpecEditorProps {
  onConnectionSubmit?: (data: Connection) => void;
  onConnectionDelete?: (data: Connection) => void;
  className?: string;
  formValue?: Connection;
  handleBack?: () => void;
  isSubmitting?: boolean;
  isDeleting?: boolean;
}

export default function ConnectionSpecEditor({
  formValue,
  onConnectionSubmit,
  onConnectionDelete,
  className,
  handleBack = () => {},
  isSubmitting = false,
  isDeleting = false,
  ...props
}: ConnectionSpecEditorProps) {
  const handleSubmit = (value: { values: Connection }) => {
    onConnectionSubmit?.({
      ...value.values
    });
  };

  const formInitialValue = useMemo(() => {
    return {
      values: formValue
    };
  }, [formValue]);

  const handleDelete = () => {
    onConnectionDelete?.(formValue!);
  };

  if (!formValue) {
    return null;
  }

  const isReadOnly = formValue?.source === "KubernetesCRD";

  return (
    <Formik
      initialValues={
        formInitialValue as {
          values: Connection;
        }
      }
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex flex-1 flex-col overflow-y-auto">
          <div
            className={clsx(
              "my-2 flex min-h-0 flex-1 flex-col overflow-y-auto",
              className
            )}
            {...props}
          >
            {isReadOnly && (
              <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
                <p className="font-medium">
                  Read-Only Mode: This resource is managed by Kubernetes CRD and
                  cannot be edited from the UI.
                </p>
              </div>
            )}
            <FormikCodeEditor
              fieldName="values"
              className="flex min-h-0 flex-1 flex-col"
              height="100%"
              disabled={isReadOnly}
            />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-4">
            {formValue?.id && (
              <AuthorizationAccessCheck
                resource={tables.connections}
                action="write"
              >
                <CanEditResource
                  id={formValue?.id}
                  namespace={formValue?.namespace}
                  name={formValue?.name}
                  resourceType={"connections"}
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
            {!formValue?.id && (
              <button
                className={clsx("btn-secondary-base btn-secondary")}
                type="button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            <div className="flex flex-1 justify-end gap-2">
              {formValue?.id && <TestConnection connectionId={formValue.id} />}
              <AuthorizationAccessCheck
                resource={tables.connections}
                action="write"
              >
                <CanEditResource
                  id={formValue?.id}
                  namespace={formValue?.namespace}
                  name={formValue?.name}
                  resourceType={"connections"}
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
