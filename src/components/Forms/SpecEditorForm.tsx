import { Form, Formik } from "formik";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "../Button";
import { Tabs, Tab } from "../Tabs/Tabs";
import { FormikCodeEditor } from "./Formik/FormikCodeEditor";
import {
  SchemaResourceType,
  schemaResourceTypes
} from "../SchemaResourcePage/resourceTypes";
import FormikTextInput from "./Formik/FormikTextInput";
import FormikAutocompleteDropdown from "./Formik/FormikAutocompleteDropdown";
import FormikIconPicker from "./Formik/FormikIconPicker";
import DeleteResource from "../SchemaResourcePage/Delete/DeleteResource";
import clsx from "clsx";
import { Icon } from "../Icon";

type SpecEditorFormProps = {
  loadSpec: () => Record<string, any>;
  updateSpec: (spec: Record<string, any>) => void;
  onBack?: () => void;
  specFormat: "yaml" | "json";
  // if you want to pass in any props to the config form, you can use a wrapper
  // component around the config form
  configForm: React.FC<{ fieldName: string; specsMapField?: string }> | null;
  specsMapField?: string;
  rawSpecInput?: boolean;
  schemaFilePrefix?: "component" | "canary" | "system" | "scrape_config";
  resourceInfo: SchemaResourceType;
  canEdit?: boolean;
  cantEditMessage?: string;
};

export default function SpecEditorForm({
  resourceInfo,
  loadSpec = () => ({}),
  updateSpec = () => {},
  onBack = () => {},
  specFormat = "yaml",
  configForm: ConfigForm,
  specsMapField: specFieldMapField,
  rawSpecInput: showCodeEditorOnly = false,
  schemaFilePrefix,
  canEdit = false,
  cantEditMessage
}: SpecEditorFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [activeTabs, setActiveTabs] = useState<"Form" | "Code">(
    showCodeEditorOnly ? "Code" : "Form"
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
        (item) => item.name === fieldName && item.hidden !== true
      ),
    [currentResourceFormFields]
  );

  const initialValues: Record<string, any> = {
    name: undefined,
    ...(isFieldSupportedByResourceType("namespace") && {
      namespace: "default"
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
          <div className="flex flex-col flex-1 overflow-y-auto space-y-4 p-4">
            <div className="flex flex-col space-y-2">
              {isFieldSupportedByResourceType("name") && (
                <FormikTextInput name="name" label="Name" required />
              )}
              {isFieldSupportedByResourceType("icon") && (
                <FormikIconPicker name="icon" label="Icon" />
              )}
              {isFieldSupportedByResourceType("labels") && (
                <div className="flex flex-col space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Labels
                  </label>
                  <FormikCodeEditor
                    fieldName="labels"
                    format="json"
                    className="h-[100px]"
                  />
                </div>
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
              {showCodeEditorOnly ? (
                <>
                  <label className="block text-sm font-bold text-gray-700">
                    Specs
                  </label>
                  <FormikCodeEditor
                    format={specFormat}
                    // map to the spec field to the spec field in the resource
                    fieldName={`spec${
                      specFieldMapField ? `.${specFieldMapField}` : ""
                    }`}
                    schemaFilePrefix={schemaFilePrefix}
                  />
                </>
              ) : (
                <Tabs
                  activeTab={activeTabs}
                  onSelectTab={(v) => setActiveTabs(v as "Code" | "Form")}
                  contentClassName="flex flex-col flex-1 bg-white border border-t-0 border-gray-300"
                >
                  <Tab label="Form" value="Form">
                    <div className="flex flex-col space-y-4 p-4">
                      {ConfigForm && (
                        <ConfigForm
                          fieldName="spec"
                          specsMapField={`spec${
                            specFieldMapField ? `.${specFieldMapField}` : ""
                          }`}
                        />
                      )}
                    </div>
                  </Tab>
                  <Tab label="Code" value="Code">
                    {/* confirm about this */}
                    <FormikCodeEditor format={specFormat} fieldName="spec" />
                  </Tab>
                </Tabs>
              )}
            </div>
          </div>
          <div className="flex flex-row bg-gray-100 p-4">
            <div className="flex flex-1 flex-row space-x-4 justify-end">
              {!!cantEditMessage && !canEdit && !!initialValues.id && (
                <div className="flex items-center px-4 space-x-2 flex-1">
                  <Icon name="k8s" />
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
