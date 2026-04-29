import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  DebugProperty,
  PropertyDBObject,
  PropertyType
} from "@flanksource-ui/services/permissions/permissionsService";
import { nanosecondsToHuman } from "@flanksource-ui/utils/date";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Modal } from "@flanksource-ui/ui/Modal";
import clsx from "clsx";
import { Form, Formik, useFormikContext } from "formik";
import { useMemo } from "react";
import { FaTrash } from "react-icons/fa";
import Select from "react-select";
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
  /** Passed when editing; derived dynamically from selection when adding */
  propertyType?: PropertyType;
  defaultValue?: string;
  debugProperties?: Record<string, DebugProperty>;
};

type PropertyOption = {
  value: string;
  label: string;
  type: PropertyType;
  defaultValue: string;
};

type FormValues = {
  name: string;
  value: string;
  created_at?: string;
  [key: string]: unknown;
};

/**
 * Resolves the property type for a given name, preferring the external type
 * (set when editing) over the debug-properties-derived type (set when adding).
 */
function resolvePropertyType(
  name: string,
  isEditing: boolean,
  externalType: PropertyType | undefined,
  debugProperties: Record<string, DebugProperty> | undefined
): PropertyType | undefined {
  if (isEditing) return externalType;
  return debugProperties?.[name]?.type as PropertyType | undefined;
}

/** Inner component so we can use useFormikContext for reactive type derivation */
function FormFields({
  isEditing,
  source,
  propertyType: externalPropertyType,
  defaultValue: externalDefaultValue,
  debugProperties,
  options
}: {
  isEditing: boolean;
  source?: string;
  propertyType?: PropertyType;
  defaultValue?: string;
  debugProperties?: Record<string, DebugProperty>;
  options: PropertyOption[];
}) {
  const { values, setFieldValue } = useFormikContext<FormValues>();

  const currentType = resolvePropertyType(
    values.name,
    isEditing,
    externalPropertyType,
    debugProperties
  );

  const debugEntry = values.name ? debugProperties?.[values.name] : undefined;
  const currentDefault = isEditing
    ? externalDefaultValue
    : debugEntry !== undefined
      ? String(debugEntry.default)
      : undefined;

  const hint =
    currentDefault !== undefined
      ? `Default: ${
          currentType === "duration"
            ? nanosecondsToHuman(currentDefault) || currentDefault
            : currentDefault
        }`
      : undefined;

  const selectedOption = useMemo(
    () => options.find((o) => o.value === values.name) ?? null,
    [options, values.name]
  );

  return (
    <div className="flex flex-col gap-4 overflow-y-auto px-2 py-6">
      {isEditing ? (
        <FormikTextInput
          name="name"
          label="Property"
          readOnly
          className="flex flex-col gap-1"
        />
      ) : (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Property</label>
          <Select<PropertyOption>
            options={options}
            value={selectedOption}
            placeholder="Search properties…"
            onChange={(selected) => {
              setFieldValue("name", selected?.value ?? "");
              setFieldValue("value", "");
            }}
            isClearable
            isSearchable
            menuPortalTarget={
              typeof document !== "undefined" ? document.body : undefined
            }
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              option: (base, state) => ({
                ...base,
                fontFamily: "monospace",
                fontSize: "0.8rem",
                backgroundColor: state.isSelected
                  ? "var(--color-blue-600, #2563eb)"
                  : state.isFocused
                    ? "var(--color-blue-50, #eff6ff)"
                    : "white"
              }),
              singleValue: (base) => ({
                ...base,
                fontFamily: "monospace",
                fontSize: "0.8rem"
              })
            }}
            menuPosition="fixed"
            menuShouldBlockScroll
          />
        </div>
      )}
      <PropertyValueInput
        name="value"
        label="Value"
        propertyType={currentType}
        disabled={source === "local"}
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

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
  debugProperties,
  ...props
}: FeatureFlagFormProps) {
  const isEditing = Boolean(formValue?.created_at);
  const title = isEditing ? "Edit Property" : "Add Property";

  const initialValues: FormValues = {
    ...formValue,
    name: formValue?.name ?? "",
    value: getInitialValue(formValue, defaultValue)
  };

  const options = useMemo<PropertyOption[]>(
    () =>
      Object.entries(debugProperties ?? {})
        .map(([key, val]) => ({
          value: key,
          label: key,
          type: val.type as PropertyType,
          defaultValue: String(val.default)
        }))
        .sort((a, b) => a.value.localeCompare(b.value)),
    [debugProperties]
  );

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
          const resolvedType = resolvePropertyType(
            value.name,
            isEditing,
            propertyType,
            debugProperties
          );
          if (
            resolvedType !== "bool" &&
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
              <FormFields
                isEditing={isEditing}
                source={source}
                propertyType={propertyType}
                defaultValue={defaultValue}
                debugProperties={debugProperties}
                options={options}
              />
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
