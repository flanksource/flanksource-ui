import { SchemaResourceI } from "@flanksource-ui/api/schemaResources";
import TopologyResourceForm from "./TopologyResourceForm";

type EditTopologyResourceProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  topologyResource: SchemaResourceI;
  isModal?: boolean;
};

export default function EditTopologyResource({
  onSuccess = () => {},
  onCancel = () => {},
  topologyResource,
  isModal = false
}: EditTopologyResourceProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-clip p-2">
      <TopologyResourceForm
        isModal={isModal}
        onCancel={onCancel}
        onSuccess={onSuccess}
        topology={topologyResource}
        footerClassName="p-4"
      />
    </div>
  );
}
