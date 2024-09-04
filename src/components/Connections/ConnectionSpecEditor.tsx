import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { useMemo } from "react";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { Button } from "../../ui/Buttons/Button";
import { FormikCodeEditor } from "../Forms/Formik/FormikCodeEditor";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
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
              "my-2 flex flex-1 flex-col overflow-y-auto",
              className
            )}
            {...props}
          >
            <FormikCodeEditor fieldName="values" />
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-4">
            {formValue?.id && (
              <AuthorizationAccessCheck
                resource={tables.connections}
                action="write"
              >
                <Button
                  text="Delete"
                  icon={<FaTrash />}
                  onClick={handleDelete}
                  className="btn-danger"
                />
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
              </AuthorizationAccessCheck>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
