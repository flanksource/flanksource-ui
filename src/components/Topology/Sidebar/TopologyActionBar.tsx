import { EvidenceType } from "@flanksource-ui/api/types/evidence";
import { Topology } from "@flanksource-ui/api/types/topology";
import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import { features } from "@flanksource-ui/services/permissions/features";
import { ActionLink } from "@flanksource-ui/ui/Buttons/ActionLink";
import React, { useMemo, useState } from "react";
import { IconType } from "react-icons";
import { BiLink, BiZoomIn } from "react-icons/bi";
import { ImTree } from "react-icons/im";
import { MdAlarmAdd, MdTableRows } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AttachEvidenceDialog } from "../../Incidents/AttachEvidenceDialog";
import PlaybooksDropdownMenu from "../../Playbooks/Runs/Submit/PlaybooksDropdownMenu";
import TopologySnapshotModal from "../TopologyCard/TopologySnapshotModal";
import { TopologyConfigLinkModal } from "../TopologyConfigLinkModal/TopologyConfigLinkModal";

type TopologyActionItem = {
  label: string;
  icon: IconType;
  isShown: (
    topology: Topology,
    displayPoint: "TopologyCard" | "TopologySidebar"
  ) => boolean;
  /**
   *
   * A headless component that wraps the child component and provides the onClick handler
   * and icon and text props.
   *
   * The onclick handler is unique to each action item, and the icon and text
   * and hence the need to create them in the container component and pass them
   * to child component.
   *
   */
  ContainerComponent: React.FC<{
    child: React.FC<{
      onClick: () => void;
      icon: React.ReactNode;
      text: React.ReactNode;
    }>;
    topology: Topology;
    onRefresh?: () => void;
    icon: React.ReactNode;
    text: React.ReactNode;
    /**
     *
     * A callback that is called to open a modal such as the attach evidence
     * dialog or the topology snapshot modal.
     *
     * This modals can not be created within the container component because
     * they will get unmounted when the Menu dropdown is closed.
     *
     */
    openModalAction?: () => void;
  }>;
};

export const topologyActionItems: Readonly<TopologyActionItem>[] = [
  {
    label: "View Logs",
    icon: MdTableRows,
    isShown: (topology) => !!topology.external_id,
    ContainerComponent: function Container({
      child: ChildComponent,
      topology,
      icon,
      text
    }) {
      const navigate = useNavigate();

      return (
        <ChildComponent
          onClick={() => navigate(`/logs?topologyId=${topology.id}`)}
          icon={icon}
          text={text}
        />
      );
    }
  },
  {
    label: "Zoom In",
    icon: BiZoomIn,
    isShown: (topology, displayPoint) => displayPoint === "TopologyCard",
    ContainerComponent: function Container({
      child: ChildComponent,
      topology,
      icon,
      text
    }) {
      const navigate = useNavigate();

      return (
        <ChildComponent
          onClick={() => navigate(`/topology/${topology.id}`)}
          icon={icon}
          text={text}
        />
      );
    }
  },
  {
    label: "Link to Incident",
    icon: MdAlarmAdd,
    isShown: () => true,
    ContainerComponent: function Container({
      child: ChildComponent,
      topology,
      icon,
      text,
      openModalAction: onModalOpen = () => {}
    }) {
      return (
        <ChildComponent onClick={() => onModalOpen()} icon={icon} text={text} />
      );
    }
  },
  // {
  //   label: "Hide",
  //   icon: BiHide,
  //   isShown: (topology) => topology.hidden !== false,
  //   ContainerComponent: function Container({
  //     child: ChildComponent,
  //     topology,
  //     onRefresh,
  //     icon,
  //     text
  //   }) {
  //     const { mutate: updateVisibility } =
  //       useUpdateComponentMutation(onRefresh);

  //     return (
  //       <ChildComponent
  //         onClick={() =>
  //           updateVisibility({
  //             id: topology.id,
  //             hidden: true
  //           })
  //         }
  //         icon={icon}
  //         text={text}
  //       />
  //     );
  //   }
  // },
  // {
  //   label: "Show",
  //   icon: BiShow,
  //   isShown: (topology) => topology.hidden === false,
  //   ContainerComponent: function Container({
  //     child: ChildComponent,
  //     topology,
  //     onRefresh,
  //     icon,
  //     text
  //   }) {
  //     const { mutate: updateVisibility } =
  //       useUpdateComponentMutation(onRefresh);
  //     return (
  //       <ChildComponent
  //         onClick={() =>
  //           updateVisibility({
  //             id: topology.id,
  //             hidden: false
  //           })
  //         }
  //         icon={icon}
  //         text={text}
  //       />
  //     );
  //   }
  // },
  {
    label: "Snapshot",
    icon: ImTree,
    isShown: () => true,
    ContainerComponent: function Container({
      child: ChildComponent,
      topology,
      icon,
      text,
      openModalAction: onModalOpen = () => {}
    }) {
      return (
        <ChildComponent onClick={() => onModalOpen()} icon={icon} text={text} />
      );
    }
  },
  {
    label: "Link to catalog",
    icon: BiLink,
    isShown: () => true,
    ContainerComponent: function Container({
      child: ChildComponent,
      topology,
      icon,
      text,
      openModalAction: onModalOpen = () => {}
    }) {
      return (
        <ChildComponent onClick={() => onModalOpen()} icon={icon} text={text} />
      );
    }
  }
];

type TopologyActionBarProps = {
  topology?: Topology;
  onRefresh?: () => void;
};

export default function TopologyActionBar({
  topology,
  onRefresh
}: TopologyActionBarProps) {
  const [
    isDownloadComponentSnapshotModalOpen,
    setIsDownloadComponentSnapshotModalOpen
  ] = useState(false);

  const { isFeatureDisabled } = useFeatureFlagsContext();

  const isIncidentManagementFeatureDisabled = useMemo(
    () => isFeatureDisabled(features.incidents),
    [isFeatureDisabled]
  );

  const isLogsFeatureDisabled = useMemo(
    () => isFeatureDisabled(features.logs),
    [isFeatureDisabled]
  );

  const [attachAsAsset, setAttachAsAsset] = useState(false);
  const [linkToConfig, setLinkToConfig] = useState(false);

  const onOpenModal = (label: string) => {
    switch (label) {
      case "Snapshot":
        return setIsDownloadComponentSnapshotModalOpen(true);
      case "Link to Incident":
        return setAttachAsAsset(true);
      case "Link to catalog":
        return setLinkToConfig(true);
      default:
        break;
    }
  };

  if (!topology) {
    return null;
  }

  return (
    <>
      <div className="flex flex-wrap py-4" data-collapsible="false">
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
          .map(({ icon: Icon, isShown, label, ContainerComponent }, index) => {
            if (isShown(topology, "TopologySidebar")) {
              return (
                <div key={label} className="px-1 py-1">
                  <ContainerComponent
                    onRefresh={onRefresh}
                    topology={topology}
                    child={ActionLink}
                    icon={<Icon />}
                    text={label}
                    openModalAction={() => onOpenModal(label)}
                  />
                </div>
              );
            }
            return null;
          })}
        <PlaybooksDropdownMenu component_id={topology.id} />
      </div>

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

      {linkToConfig && (
        <TopologyConfigLinkModal
          onCloseModal={() => setLinkToConfig(false)}
          openModal={linkToConfig}
          topology={topology}
        />
      )}
    </>
  );
}
