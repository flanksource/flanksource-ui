import { Form, Formik } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../Button";
import { Tabs, Tab } from "../Tabs/Tabs";
import { FormikCodeEditor } from "./Formik/FormikCodeEditor";
import { FaSave, FaTrash } from "react-icons/fa";
import { schemaResourceTypes } from "../SchemaResourcePage/resourceTypes";
import FormikTextInput from "./Formik/FormikTextInput";
import FormikSelectDropdown from "./Formik/FormikAutomcompletDropdown";

type SpecEditorFormProps = {
  resourceName: string;
  deleteHandler?: (id: string) => void;
  loadSpec: () => Record<string, any>;
  updateSpec: (spec: Record<string, any>) => void;
  specFormat: "yaml" | "json";
  // if you want to pass in any props to the config form, you can use a wrapper
  // component around the config form
  configForm: React.FC<{ fieldName: string }> | null;
  specFormFieldName: string;
  rawSpecInput?: boolean;
};

export default function SpecEditorForm({
  resourceName,
  deleteHandler,
  loadSpec = () => ({}),
  updateSpec = () => {},
  specFormat = "yaml",
  configForm: ConfigForm,
  specFormFieldName,
  rawSpecInput: showCodeEditorOnly = false
}: SpecEditorFormProps) {
  const [activeTabs, setActiveTabs] = useState<"Form" | "Code">(
    showCodeEditorOnly ? "Code" : "Form"
  );

  const currentResourceFormFields: Readonly<Record<"name", string>[]> =
    useMemo(() => {
      const resourceType = schemaResourceTypes.find(
        (item) => item.name === resourceName
      );
      if (!resourceType) {
        return [];
      }
      return resourceType.fields;
    }, [resourceName]);

  const isFieldSupportedByResourceType = useCallback(
    (fieldName: string) => {
      return !!currentResourceFormFields.find(
        (item) => item.name === fieldName
      );
    },
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

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        updateSpec(values);
      }}
    >
      {({ handleSubmit, handleReset, values, setFieldValue }) => (
        <Form
          onSubmit={handleSubmit}
          onReset={handleReset}
          className="flex flex-col space-y-4"
        >
          <div className="flex flex-col space-y-4 p-4">
            <div className="flex flex-col space-y-2">
              <FormikTextInput name="name" label="Name" required />
              {isFieldSupportedByResourceType("icon") && (
                <FormikTextInput name="icon" label="Icon" />
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
                <FormikSelectDropdown
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
                    fieldName={specFormFieldName}
                  />
                </>
              ) : (
                <Tabs
                  activeTab={activeTabs}
                  onSelectTab={(v) => setActiveTabs(v as "Code" | "Form")}
                >
                  <Tab label="Form" value="Form">
                    <div className="flex flex-col space-y-4 p-4">
                      {ConfigForm && (
                        <ConfigForm fieldName={specFormFieldName} />
                      )}
                    </div>
                  </Tab>
                  <Tab label="Code" value="Code">
                    {/* confirm about this */}
                    <FormikCodeEditor
                      format={specFormat}
                      fieldName={specFormFieldName}
                    />
                  </Tab>
                </Tabs>
              )}
            </div>
          </div>
          <div className="flex flex-row space-x-4 justify-end bg-gray-200 p-4">
            {deleteHandler && (
              <Button
                text="Delete"
                icon={<FaTrash />}
                onClick={() => deleteHandler(values.id)}
                className="btn-danger"
              />
            )}
            <Button
              type="submit"
              text={deleteHandler ? "Update" : "Add"}
              className="btn-primary"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
