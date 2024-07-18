import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { modalHelpLinkAtom } from "@flanksource-ui/ui/Modal";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Icon } from "../../ui/Icons/Icon";
import SpecEditorForm from "../Forms/SpecEditorForm";
import { integrationsModalSubTitle } from "../Integrations/Add/AddIntegrationModal";
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
  resourceInfo: Pick<SchemaResourceType, "api" | "table" | "name">;
  selectedSpec?: string;
  onBack?: () => void;
  onDeleted?: () => void;
};

export default function SpecEditor({
  types,
  format = "yaml",
  resourceInfo,
  selectedSpec,
  onBack,
  onDeleted = () => {}
}: SpecEditorProps) {
  const [, setModalHelpLink] = useAtom(modalHelpLinkAtom);
  const [, setIntegrationsModalSubTitle] = useAtom(integrationsModalSubTitle);

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
    <div className="flex h-full w-full flex-1 flex-col overflow-y-auto">
      {selectedSpecItem ? (
        <div className="flex flex-1 flex-col space-y-2 overflow-y-auto">
          <SpecEditorForm
            selectedSpec={selectedSpecItem}
            updateSpec={selectedSpecItem.updateSpec}
            onBack={() => {
              setModalHelpLink(undefined);
              setSelectedSpecItem(undefined);
            }}
            loadSpec={selectedSpecItem.loadSpec}
            specFormat={format}
            resourceInfo={resourceInfo}
            onDeleted={onDeleted}
          />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap p-2">
              {types.map((type) => (
                <div key={type.name} className="flex w-1/5 flex-col p-2">
                  <div
                    onClick={() => {
                      setSelectedSpecItem(type);
                      setModalHelpLink(type.docsLink);
                      setIntegrationsModalSubTitle(type.label ?? type.name);
                    }}
                    role={"button"}
                    className="flex h-20 flex-col items-center justify-center space-y-2 rounded-md border border-gray-300 p-2 text-center hover:border-blue-200 hover:bg-gray-100"
                    key={type.name}
                  >
                    {typeof type.icon === "string" ? (
                      <Icon name={type.icon} className="h-5 w-5" />
                    ) : (
                      <type.icon />
                    )}
                    <span>{type.label ?? type.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {onBack && (
            <div className={`flex flex-row bg-gray-100 p-4`}>
              <Button
                type="button"
                text="Back"
                className="btn-default btn-btn-secondary-base btn-secondary"
                onClick={onBack}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
