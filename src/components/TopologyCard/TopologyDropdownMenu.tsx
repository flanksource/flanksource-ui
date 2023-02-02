import { Menu } from "../Menu";
import { Topology } from "../../context/TopologyPageContext";
import { topologyActionItems } from "../TopologySidebar/TopologyActionBar";
import { useState } from "react";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import TopologySnapshotModal from "./TopologySnapshotModal";
import { EvidenceType } from "../../api/services/evidence";

type TopologyMenuItemProps = {
  onClick?: () => void;
  icon: React.ReactNode;
  text: React.ReactNode;
};

function TopologyMenuItem({
  onClick = () => {},
  icon,
  text
}: TopologyMenuItemProps) {
  return (
    <Menu.Item as="button" onClick={onClick}>
      {icon}
      <span className="pl-1 text-sm block">{text}</span>
    </Menu.Item>
  );
}

interface IProps {
  topology: Topology;
  onRefresh?: () => void;
}

export const TopologyDropdownMenu = ({ topology, onRefresh }: IProps) => {
  const [
    isDownloadComponentSnapshotModalOpen,
    setIsDownloadComponentSnapshotModalOpen
  ] = useState(false);

  const [attachAsAsset, setAttachAsAsset] = useState(false);

  return (
    <>
      <Menu>
        <Menu.VerticalIconButton />
        <Menu.Items>
          {topologyActionItems.map(
            ({ isShown, ContainerComponent: Container, icon: Icon, label }) => {
              if (!isShown(topology, "TopologyCard")) {
                return null;
              }

              return (
                <Container
                  child={TopologyMenuItem}
                  topology={topology}
                  key={label}
                  onRefresh={onRefresh}
                  icon={<Icon />}
                  text={label}
                  openModalAction={
                    label === "Snapshot"
                      ? () => setIsDownloadComponentSnapshotModalOpen(true)
                      : label === "Link to Incident"
                      ? () => setAttachAsAsset(true)
                      : undefined
                  }
                />
              );
            }
          )}
        </Menu.Items>
      </Menu>

      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        onClose={() => setAttachAsAsset(false)}
        type={EvidenceType.Topology}
        component_id={topology.id}
      />

      <TopologySnapshotModal
        onCloseModal={() => setIsDownloadComponentSnapshotModalOpen(false)}
        isModalOpen={isDownloadComponentSnapshotModalOpen}
        topology={topology}
      />
    </>
  );
};
