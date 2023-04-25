import { Menu } from "../Menu";
import { Topology } from "../../context/TopologyPageContext";
import { topologyActionItems } from "../TopologySidebar/TopologyActionBar";
import { CSSProperties, useCallback, useState } from "react";
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
  updateVisibility?: (topology: Topology) => void;
}

export const TopologyDropdownMenu = ({
  topology,
  onRefresh,
  updateVisibility
}: IProps) => {
  const [dropDownMenuStyles, setDropDownMenuStyles] = useState<CSSProperties>();

  const dropdownMenuStylesCalc = useCallback((node: HTMLDivElement) => {
    console.log({ node });
    if (!node) {
      return;
    }
    const left = node.getBoundingClientRect().left;
    const top = node.getBoundingClientRect().bottom;

    if (left && top) {
      setDropDownMenuStyles({
        left: left - 200,
        top: top,
        position: "fixed"
      });
    }
  }, []);

  const [
    isDownloadComponentSnapshotModalOpen,
    setIsDownloadComponentSnapshotModalOpen
  ] = useState(false);

  const [attachAsAsset, setAttachAsAsset] = useState(false);

  return (
    <>
      <Menu>
        <div ref={dropdownMenuStylesCalc} className="">
          <Menu.VerticalIconButton />
        </div>
        <Menu.Items className={`fixed z-50`} style={dropDownMenuStyles}>
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
                  updateVisibility={updateVisibility}
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
