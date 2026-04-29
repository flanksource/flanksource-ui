import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  PropertyDBObject,
  PropertyType
} from "@flanksource-ui/services/permissions/permissionsService";
import { nanosecondsToHuman } from "@flanksource-ui/utils/date";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import clsx from "clsx";
import { Form, Formik } from "formik";
import { FaTrash } from "react-icons/fa";
import FormikTextInput from "../Forms/Formik/FormikTextInput";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import { toastError } from "../Toast/toast";
import PropertyValueInput from "./PropertyValueInput";

type FeatureFlagFormProps = React.HTMLProps<HTMLDivElement> & {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onFeatureFlagSubmit: (data: Partial<PropertyDBObject>) => void;
  onFeatureFlagDelete: (data: Partial<PropertyDBObject>) => void;
  formValue?: Partial<PropertyDBObject>;
  source?: string;
  propertyType?: PropertyType;
  defaultValue?: string;
};

function getInitialValue(
  formValue: Partial<PropertyDBObject> | undefined,
  defaultValue: string | undefined
): string {
  if (formValue?.value !== undefined && formValue.value !== "") {
    return formValue.value;
  }
  return defaultValue ?? "";
}

export default function FeatureFlagForm({
  className,
  isOpen,
  setIsOpen,
  onFeatureFlagSubmit,
  onFeatureFlagDelete,
  formValue,
  source,
  propertyType,
  defaultValue,
  ...props
}: FeatureFlagFormProps) {
  const isEditing = Boolean(formValue?.created_at);
  const title = isEditing ? "Edit Property" : "Add Property";

  const initialValues = {
    ...formValue,
    name: formValue?.name ?? "",
    value: getInitialValue(formValue, defaultValue)
  };

  const hint =
    defaultValue !== undefined
      ? `Default: ${
          propertyType === "duration"
            ? nanosecondsToHuman(defaultValue) || defaultValue
            : defaultValue
        }`
      : undefined;

  return (
    <Modal
      title={title}
      size="very-small"
      onClose={() => {
        setIsOpen(false);
      }}
      open={isOpen}
      bodyClass=""
    >
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(value) => {
          if (!value.name) {
            toastError(`Please provide the property name`);
            return;
          }
          if (
            propertyType !== "bool" &&
            (value.value === "" || value.value == null)
          ) {
            toastError(`Please provide a value`);
            return;
          }
          onFeatureFlagSubmit?.(value);
        }}
      >
        <Form>
          <div
            className={clsx("flex h-full flex-col", className)}
            style={{ maxHeight: "calc(100vh - 8rem)" }}
            {...props}
          >
            <div className={clsx("mb-2 flex flex-col px-2")}>
              <div className="flex flex-col gap-4 overflow-y-auto px-2 py-6">
                <FormikTextInput
                  name="name"
                  label="Property"
                  readOnly={isEditing}
                  className="flex flex-col gap-1"
                />
                <PropertyValueInput
                  name="value"
                  label="Value"
                  propertyType={propertyType}
                  disabled={source === "local"}
                />
                {hint && <p className="text-xs text-gray-500">{hint}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center rounded-lg bg-gray-100 px-5 py-4">
            {isEditing && (
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
                    text={isEditing ? "Update" : "Save"}
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
