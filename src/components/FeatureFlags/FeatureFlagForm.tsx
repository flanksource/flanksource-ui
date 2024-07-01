import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { PropertyDBObject } from "@flanksource-ui/services/permissions/permissionsService";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaTrash } from "react-icons/fa";
import FormikTextInput from "../Forms/Formik/FormikTextInput";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import { toastError } from "../Toast/toast";

type FeatureFlagFormProps = React.HTMLProps<HTMLDivElement> & {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onFeatureFlagSubmit: (data: Partial<PropertyDBObject>) => void;
  onFeatureFlagDelete: (data: Partial<PropertyDBObject>) => void;
  formValue?: Partial<PropertyDBObject>;
  source?: string;
};

export default function FeatureFlagForm({
  className,
  isOpen,
  setIsOpen,
  onFeatureFlagSubmit,
  onFeatureFlagDelete,
  formValue,
  source,
  ...props
}: FeatureFlagFormProps) {
  return (
    <Modal
      title="Add Feature Flag"
      size="very-small"
      onClose={() => {
        setIsOpen(false);
      }}
      open={isOpen}
      bodyClass=""
    >
      <Formik
        initialValues={
          formValue || {
            name: "",
            value: ""
          }
        }
        onSubmit={(value) => {
          if (!value.name || !value.value) {
            toastError(`please provide all details`);
            return;
          }
          onFeatureFlagSubmit?.(value);
        }}
      >
        <Form>
          <div
            className={clsx("flex flex-col h-full", className)}
            style={{ maxHeight: "calc(100vh - 8rem)" }}
            {...props}
          >
            <div className={clsx("flex flex-col px-2 mb-2")}>
              <div className="flex flex-row overflow-y-auto px-2 py-6 gap-4 justify-center">
                <div className="flex-1">
                  <FormikTextInput
                    name="name"
                    label="Feature flag"
                    className="flex flex-row gap-2 items-center"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <FormikTextInput
                    name="value"
                    label="Value"
                    className="flex flex-row gap-2 items-center"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center py-4 px-5 rounded-lg bg-gray-100">
            {Boolean(formValue?.created_at) && (
              <AuthorizationAccessCheck
                resource={tables.feature_flags}
                action="write"
              >
                <Button
                  text="Delete"
                  icon={<FaTrash />}
                  onClick={() => {
                    onFeatureFlagDelete?.(formValue!);
                  }}
                  className="btn-danger"
                />
              </AuthorizationAccessCheck>
            )}
            <div className="flex flex-1 justify-end">
              <button
                className="btn-secondary-base btn-secondary mr-4"
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Cancel
              </button>
              {source !== "local" && (
                <AuthorizationAccessCheck
                  resource={tables.feature_flags}
                  action="write"
                >
                  <Button
                    type="submit"
                    text={Boolean(formValue?.created_at) ? "Update" : "Save"}
                    className="btn-primary"
                  />
                </AuthorizationAccessCheck>
              )}
            </div>
          </div>
        </Form>
      </Formik>
    </Modal>
  );
}
