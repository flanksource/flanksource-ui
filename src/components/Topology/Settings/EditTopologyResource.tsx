import TopologyResourceForm, {
  TopologyResource
} from "./StepsForms/TopologyResourceForm";

type EditTopologyResourceProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  topologyResource: TopologyResource;
  isModal?: boolean;
};

export default function EditTopologyResource({
  onSuccess = () => {},
  onCancel = () => {},
  topologyResource,
  isModal = false
}: EditTopologyResourceProps) {
  return (
    <div className="flex flex-col flex-1 p-2 overflow-y-clip">
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
