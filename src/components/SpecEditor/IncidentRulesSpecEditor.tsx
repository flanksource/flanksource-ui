import IncidentRulesForm from "../Forms/IncidentRulesForm";
import SpecEditorForm from "../Forms/SpecEditorForm";
import { SchemaResourceType } from "../SchemaResourcePage/resourceTypes";

type IncidentsRulesSpecEditorProps = {
  resourceValue?: {
    id?: string;
    name?: string;
    namespace?: string;
    spec?: Record<string, any>;
    [key: string]: any;
  };
  onSubmit?: (spec: Record<string, any>) => void;
  resourceInfo: SchemaResourceType;
};

export default function IncidentsRulesSpecEditor({
  resourceValue,
  onSubmit = () => {},
  resourceInfo
}: IncidentsRulesSpecEditorProps) {
  return (
    <div className="flex flex-col space-y-2 flex-1 overflow-y-auto">
      <SpecEditorForm
        configForm={IncidentRulesForm}
        updateSpec={(value: Record<string, any>) => {
          onSubmit(value);
        }}
        loadSpec={() => {
          return (
            resourceValue ?? {
              spec: {
                components: [{}]
              }
            }
          );
        }}
        specFormat={"yaml"}
        resourceInfo={resourceInfo}
        canEdit
      />
    </div>
  );
}
