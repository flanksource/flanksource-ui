import clsx from "clsx";
import { Form, Formik } from "formik";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "../../ui/Button";
import DeleteResource from "../SchemaResourcePage/Delete/DeleteResource";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "../SchemaResourcePage/resourceTypes";
import { SpecType } from "../SpecEditor/SpecEditor";
import { Tab, Tabs } from "../Tabs/Tabs";
import FormikAutocompleteDropdown from "./Formik/FormikAutocompleteDropdown";
import { FormikCodeEditor } from "./Formik/FormikCodeEditor";
import FormikIconPicker from "./Formik/FormikIconPicker";
import FormikKeyValueMapField from "./Formik/FormikKeyValueMapField";
import FormikTextInput from "./Formik/FormikTextInput";

type SpecEditorFormProps = {
  loadSpec: () => Record<string, any>;
  updateSpec: (spec: Record<string, any>) => void;
  onBack: () => void;
  specFormat: "yaml" | "json";
  selectedSpec: SpecType;
  resourceInfo: Pick<SchemaResourceType, "api" | "table" | "name">;
  canEdit?: boolean;
  cantEditMessage?: React.ReactNode;
  onDeleted: () => void;
};

export default function SpecEditorForm({
  resourceInfo,
  loadSpec = () => ({}),
  updateSpec = () => {},
  onBack = () => {},
  specFormat = "yaml",
  selectedSpec,
  canEdit = false,
  cantEditMessage,
  onDeleted = () => {}
}: SpecEditorFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTabs, setActiveTabs] = useState<"Form" | "Code">(
    selectedSpec.type !== "form" ? "Code" : "Form"
  );

  const currentResourceFormFields: Readonly<
    {
      name: string;
      hidden?: boolean;
    }[]
  > = useMemo(() => {
    const resourceType = schemaResourceTypes.find(
      (item) => item.name === resourceInfo.name
    );
    if (!resourceType) {
      return [];
    }
    return resourceType.fields;
  }, [resourceInfo.name]);

  const isFieldSupportedByResourceType = useCallback(
    (fieldName: string) =>
      !!currentResourceFormFields.find(
        (item) =>
          item.name === fieldName &&
          (item.hidden !== true || selectedSpec.type !== "form")
      ),
    [currentResourceFormFields, selectedSpec.type]
  );

  const initialValues: Record<string, any> = {
    name: undefined,
    ...(isFieldSupportedByResourceType("namespace") && {
      namespace: "default"
    }),
    ...(isFieldSupportedByResourceType("source") && {
      source: "UI"
    }),
    spec: {},
    ...(loadSpec ? loadSpec() : {})
  };

  const touchAllFormFields = (
    setFieldTouched: (
      field: string,
      isTouched?: boolean | undefined,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    [...(formRef.current?.elements || [])].forEach((element) => {
      setFieldTouched(element.getAttribute("name")!, true, true);
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        updateSpec(values);
      }}
      validateOnBlur
      validateOnChange
    >
      {({ handleSubmit, handleReset, setFieldTouched }) => (
        <Form
          onSubmit={(e) => {
            handleSubmit(e);
            touchAllFormFields(setFieldTouched);
          }}
          onReset={handleReset}
          className="flex flex-col flex-1 overflow-y-auto space-y-4"
          ref={formRef}
        >
          <div className="flex flex-col flex-1 overflow-y-auto space-y-4 px-4 py-4">
            <div className="flex flex-col space-y-2">
              {isFieldSupportedByResourceType("name") && (
                <FormikTextInput name="name" label="Name" required />
              )}
              {isFieldSupportedByResourceType("icon") && (
                <FormikIconPicker name="icon" label="Icon" />
              )}
              {isFieldSupportedByResourceType("labels") && (
                <FormikKeyValueMapField name="labels" label="Labels" />
              )}
              {isFieldSupportedByResourceType("source") && (
                <FormikTextInput
                  name="source"
                  label="Source"
                  required
                  readOnly
                />
              )}
              {isFieldSupportedByResourceType("schedule") && (
                <FormikAutocompleteDropdown
                  name="schedule"
                  label="Schedule"
                  options={[
                    {
                      label: "@every 30s",
                      value: "@every 30s"
                    },
                    {
                      label: "@every 1m",
                      value: "@every 1m"
                    },
                    {
                      label: "@every 5m",
                      value: "@every 5m"
                    },
                    {
                      label: "@every 30m",
                      value: "@every 30m"
                    },
                    {
                      label: "@hourly",
                      value: "@hourly"
                    },
                    {
                      label: "@every 6h",
                      value: "@every 6h"
                    },
                    {
                      label: "@daily",
                      value: "@daily"
                    },
                    {
                      label: "@weekly",
                      value: "@weekly"
                    }
                  ]}
                />
              )}
            </div>
            <div className="flex flex-col py-2">
              {selectedSpec.type !== "form" ? (
                <>
                  <label className="form-label">Specs</label>
                  <FormikCodeEditor
                    format={specFormat}
                    fieldName={
                      selectedSpec.type === "code"
                        ? `spec.${selectedSpec.specsMapField}`
                        : // if it's a custom spec, then the field name is `spec`
                          `spec`
                    }
                    schemaFileName={selectedSpec.schemaFileName}
                  />
                </>
              ) : (
                <Tabs
                  activeTab={activeTabs}
                  onSelectTab={(v) => setActiveTabs(v as "Code" | "Form")}
                >
                  <Tab label="Form" value="Form">
                    <div className="flex flex-col space-y-4 p-4">
                      <selectedSpec.configForm
                        fieldName="spec"
                        specsMapField={selectedSpec.specsMapField}
                      />
                    </div>
                  </Tab>
                  <Tab label="Code" value="Code">
                    <FormikCodeEditor
                      format={specFormat}
                      fieldName="spec"
                      schemaFileName={selectedSpec.schemaFileName}
                    />
                  </Tab>
                </Tabs>
              )}
            </div>
          </div>
          <div className="flex flex-row  bg-gray-100 p-4">
            <div className="flex flex-1 flex-row items-center space-x-4 justify-end">
              {!!cantEditMessage && !canEdit && !!initialValues.id && (
                <div className="flex items-center px-4 space-x-2 flex-1">
                  <span>{cantEditMessage}</span>
                </div>
              )}
              {!initialValues.id && (
                <div className="flex flex-1 flex-row">
                  <Button
                    type="button"
                    text="Back"
                    className="btn-default btn-btn-secondary-base btn-secondary"
                    onClick={onBack}
                  />{" "}
                </div>
              )}
              {canEdit && !!initialValues.id && (
                <DeleteResource
                  resourceId={initialValues.id}
                  resourceInfo={resourceInfo}
                  onDeleted={onDeleted}
                />
              )}

              {canEdit && (
                <Button
                  type="submit"
                  text={!!initialValues.id ? "Update" : "Save"}
                  className={clsx(
                    canEdit ? "btn-primary" : "btn-disabled cursor-no-drop"
                  )}
                />
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
