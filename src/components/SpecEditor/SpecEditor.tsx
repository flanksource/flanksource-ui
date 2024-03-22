import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { modalHelpLinkAtom } from "../../ui/Modal";
import SpecEditorForm from "../Forms/SpecEditorForm";
import { Icon } from "../Icon";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";

export type SpecTypeCommonFields = {
  name: string;
  label?: string;
  description?: string;
  icon: string | React.FC;
  loadSpec: () => Record<string, any>;
  updateSpec: (spec: Record<string, any>) => void;
  schemaFileName: string | undefined;
  docsLink?: string;
};

export type SpecTypeInputForm = SpecTypeCommonFields & {
  type: "form";
  configForm: React.FC<{ fieldName: string; specsMapField: string }>;
  /**
   *
   * the field name is the name of the field in the spec that this config editor
   * is editing (e.g. "kubernetes" or "kubernetes.0")
   *
   * #### Example
   *
   * if the spec is: `{ spec: { "kubernetes": { ... } }}` then the field name is `"kubernetes"`
   * and, in this case, it returns an object
   *
   * if the spec is `{ { kubernetes: [{ ... }] }}` then the field name is `"kubernetes.0"`
   * and, in this case, it returns an array of one item
   *
   */
  specsMapField: string;
};

export type SpecTypeCode = SpecTypeCommonFields & {
  type: "code";
  specsMapField: string;
};

export type SpecTypeCustom = SpecTypeCommonFields & {
  type: "custom";
};

export type SpecType = SpecTypeInputForm | SpecTypeCode | SpecTypeCustom;

type SpecEditorProps = {
  types: SpecType[];
  format?: "json" | "yaml";
  resourceInfo: SchemaResourceType;
  selectedSpec?: string;
  canEdit?: boolean;
  cantEditMessage?: React.ReactNode;
};

export default function SpecEditor({
  types,
  format = "yaml",
  resourceInfo,
  selectedSpec,
  canEdit = false,
  cantEditMessage
}: SpecEditorProps) {
  const [, setModalHelpLink] = useAtom(modalHelpLinkAtom);

  const [selectedSpecItem, setSelectedSpecItem] = useState<
    SpecType | undefined
  >(() => {
    if (selectedSpec) {
      const selectedType = types.find(({ name }) => name === selectedSpec);
      if (selectedType) {
        return selectedType;
      }
      return types.find(({ name }) => name === "custom");
    }
    return undefined;
  });

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
        <div className="flex flex-col space-y-2 flex-1 overflow-y-auto">
          <SpecEditorForm
            selectedSpec={selectedSpecItem}
            updateSpec={selectedSpecItem.updateSpec}
            onBack={() => {
              setSelectedSpecItem(undefined);
            }}
            loadSpec={selectedSpecItem.loadSpec}
            specFormat={format}
            resourceInfo={resourceInfo}
            canEdit={canEdit}
            cantEditMessage={cantEditMessage}
          />
        </div>
      ) : (
        <div className="flex flex-wrap p-2">
          {types.map((type) => (
            <div key={type.name} className="flex flex-col w-1/5 p-2">
              <div
                onClick={() => {
                  setSelectedSpecItem(type);
                  setModalHelpLink(type.docsLink);
                }}
                role={"button"}
                className="flex flex-col items-center space-y-2 justify-center p-2 border border-gray-300 hover:border-blue-200 hover:bg-gray-100 rounded-md text-center h-20"
                key={type.name}
              >
                {typeof type.icon === "string" ? (
                  <Icon name={type.icon} className="w-5 h-5" />
                ) : (
                  <type.icon />
                )}
                <span>{type.label ?? type.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
