import { Form, Formik } from "formik";
import React, { useCallback, useMemo, useState } from "react";
import { Button } from "../../Button";
import { Tabs, Tab } from "../../Tabs/Tabs";
import { FormikCodeEditor } from "../Formik/FormikCodeEditor";
import { FaChevronCircleLeft, FaSave, FaTrash } from "react-icons/fa";
import { schemaResourceTypes } from "../../SchemaResourcePage/resourceTypes";
import FormikTextInput from "../Formik/FormikTextInput";

type SpecEditorFormProps = {
  resourceName: string;
  canEdit: boolean;
  deleteHandler?: (id: string) => void;
  loadSpec: () => Record<string, any>;
  updateSpec: (spec: Record<string, any>) => void;
  specFormat: "yaml" | "json";
  onBack: () => void;
  // if you want to pass in any props to the config form, you can use a wrapper
  // component around the config form
  configForm: React.FC<{ fieldName: string }>;
  specFormFieldName: string;
};

export default function SpecEditorForm({
  resourceName,
  deleteHandler,
  canEdit = true,
  loadSpec = () => ({}),
  updateSpec = () => {},
  specFormat = "yaml",
  onBack = () => {},
  configForm: ConfigForm,
  specFormFieldName
}: SpecEditorFormProps) {
  const [activeTabs, setActiveTabs] = useState<"Form" | "Code">("Form");

  const initialValues: Record<string, any> = loadSpec() ?? {
    name: undefined,
    spec: {}
  };

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
          <div className="flex flex-col space-y-2">
            <FormikTextInput name="name" label="Name" required />
            {isFieldSupportedByResourceType("namespace") && (
              <FormikTextInput name="namespace" label="Namespace" />
            )}
            {isFieldSupportedByResourceType("icon") && (
              <FormikTextInput name="icon" label="Icon" />
            )}
          </div>
          <div className="flex flex-col">
            <Tabs
              activeTab={activeTabs}
              onSelectTab={(v) => setActiveTabs(v as "Code" | "Form")}
            >
              <Tab label="Form" value="Form">
                <div className="flex flex-col space-y-4 p-4">
                  <ConfigForm fieldName={specFormFieldName} />
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
          </div>
          <div className="flex flex-row space-x-4 justify-end">
            {!canEdit && (
              <Button
                text="Back"
                icon={<FaChevronCircleLeft />}
                onClick={() => {
                  // reset the config form to empty
                  setFieldValue("spec", {});
                  onBack();
                }}
                className="btn-danger"
              />
            )}
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
              icon={<FaSave />}
              text="Save"
              className="btn-primary"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
