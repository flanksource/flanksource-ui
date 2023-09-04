import { CSSProperties, useCallback, useMemo, useState } from "react";
import { EvidenceType } from "../../api/services/evidence";
import { useFeatureFlagsContext } from "../../context/FeatureFlagsContext";
import { Topology } from "../../context/TopologyPageContext";
import { features } from "../../services/permissions/features";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { Menu } from "../Menu";
import { TopologyConfigLinkModal } from "../TopologyConfigLinkModal/TopologyConfigLinkModal";
import { topologyActionItems } from "../TopologySidebar/TopologyActionBar";
import TopologySnapshotModal from "./TopologySnapshotModal";

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
  isTopologyPage?: boolean;
}

export const TopologyDropdownMenu = ({
  topology,
  onRefresh,
  isTopologyPage = false
}: IProps) => {
  const [dropDownMenuStyles, setDropDownMenuStyles] = useState<CSSProperties>();

  const { isFeatureDisabled } = useFeatureFlagsContext();

  const isIncidentManagementFeatureDisabled = useMemo(
    () => isFeatureDisabled(features.incidents),
    [isFeatureDisabled]
  );

  const isLogsFeatureDisabled = useMemo(
    () => isFeatureDisabled(features.logs),
    [isFeatureDisabled]
  );

  const dropdownMenuStylesCalc = useCallback(
    (node: HTMLDivElement) => {
      if (!node) {
        return;
      }
      const left = node.getBoundingClientRect().left;
      const top = node.getBoundingClientRect().bottom;

      if (left && top) {
        if (isTopologyPage) {
          setDropDownMenuStyles({
            right: 0,
            top: "1.5rem",
            position: "absolute"
          });
        } else {
          setDropDownMenuStyles({
            left: left - 200,
            top: top,
            position: "fixed"
          });
        }
      }
    },
    [isTopologyPage]
  );

  const [
    isDownloadComponentSnapshotModalOpen,
    setIsDownloadComponentSnapshotModalOpen
  ] = useState(false);
  const [attachAsAsset, setAttachAsAsset] = useState(false);
  const [linkToConfig, setLinkToConfig] = useState(false);

  return (
    <>
      <Menu>
        <div ref={dropdownMenuStylesCalc} className="">
          <Menu.VerticalIconButton />
        </div>
        <Menu.Items className={`z-50`} style={dropDownMenuStyles}>
          {topologyActionItems
            .filter((item) => {
              if (item.label === "Link to Incident") {
                return !isIncidentManagementFeatureDisabled;
              }
              if (item.label === "View Logs") {
                return !isLogsFeatureDisabled;
              }
              return true;
            })
            .map(
              ({
                isShown,
                ContainerComponent: Container,
                icon: Icon,
                label
              }) => {
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
                        : label === "Link to config"
                        ? () => setLinkToConfig(true)
                        : undefined
                    }
                  />
                );
              }
            )}
        </Menu.Items>
      </Menu>

      {!isIncidentManagementFeatureDisabled && (
        <AttachEvidenceDialog
          isOpen={attachAsAsset}
          onClose={() => setAttachAsAsset(false)}
          type={EvidenceType.Topology}
          component_id={topology.id}
        />
      )}

      <TopologySnapshotModal
        onCloseModal={() => setIsDownloadComponentSnapshotModalOpen(false)}
        isModalOpen={isDownloadComponentSnapshotModalOpen}
        topology={topology}
      />

      {linkToConfig && (
        <TopologyConfigLinkModal
          onCloseModal={() => setLinkToConfig(false)}
          openModal={linkToConfig}
          topology={topology}
        />
      )}
    </>
  );
};
