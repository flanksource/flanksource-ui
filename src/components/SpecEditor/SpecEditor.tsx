import React, { useEffect, useState } from "react";
import { Icon } from "../Icon";
import SpecEditorForm from "../Forms/Configs/SpecEditorForm";
import { SchemaResourceTypes } from "../SchemaResourcePage/resourceTypes";

export type SpecType = {
  name: string;
  icon: string;
  description: string;
  loadSpec: () => Record<string, any>;
  updateSpec: (spec: Record<string, any>) => void;
  configForm: React.FC<{ fieldName: string }>;
  /**
   *
   * the field name is the name of the field in the spec that this config editor
   * is editing (e.g. "kubernetes" or "kubernetes.0")
   *
   * #### Example
   *
   * if the spec is: `{ spec: { "kubernetes": { ... } }}` then the field name is `"spec.kubernetes"`
   * and, in this case, it returns an object
   *
   * if the spec is `{ spec: { kubernetes: [{ ... }] }}` then the field name is `"spec.kubernetes.0"`
   * and, in this case, it returns an array of one item
   *
   */
  formFieldName: string;
};

type SpecEditorProps = {
  types: SpecType[];
  format?: "json" | "yaml";
  resourceName: SchemaResourceTypes[number]["name"];
  canEdit?: boolean;
  selectedSpec?: string;
  deleteHandler?: (id: string) => void;
};

export default function SpecEditor({
  types,
  format = "yaml",
  resourceName,
  canEdit = true,
  selectedSpec,
  deleteHandler
}: SpecEditorProps) {
  const [selectedSpecItem, setSelectedSpecItem] = useState<
    SpecType | undefined
  >(() => types.find(({ name }) => name === selectedSpec));

  // if the types change, we need to update the selectedSpecItem to the new
  // item, so that the form is updated, a good example is when we toggle canEdit
  useEffect(() => {
    if (selectedSpecItem) {
      setSelectedSpecItem(
        types.find(({ name }) => name === selectedSpecItem.name)
      );
    }
    // don't add selectedSpecItem to the dependency list, because we don't want
    // to initiate a race condition
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [types]);

  return (
    <div className="flex flex-col w-full flex-1 h-full overflow-y-auto">
      {selectedSpecItem ? (
        <div className="flex flex-col space-y-2 p-4">
          <SpecEditorForm
            canEdit={canEdit}
            configForm={selectedSpecItem.configForm}
            updateSpec={selectedSpecItem.updateSpec}
            loadSpec={selectedSpecItem.loadSpec}
            specFormat={format}
            resourceName={resourceName}
            onBack={() => setSelectedSpecItem(undefined)}
            specFormFieldName={selectedSpecItem.formFieldName}
            deleteHandler={deleteHandler}
          />
        </div>
      ) : (
        <div className="flex flex-col space-y-4 p-2">
          {types.map((type) => (
            <div
              onClick={() => setSelectedSpecItem(type)}
              role={"button"}
              className="flex flex-row px-4 py-2 border border-gray-700 hover:border-blue-200 hover:bg-gray-100 rounded-md space-x-4"
              key={type.name}
            >
              <Icon name={type.icon} />
              <div className="flex flex-col">
                <div className="font-semibold">{type.name}</div>
                <div className="text-gray-500">{type.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
