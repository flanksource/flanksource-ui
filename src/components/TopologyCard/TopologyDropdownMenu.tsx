import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiHide, BiShow, BiZoomIn } from "react-icons/bi";
import { MdAlarmAdd, MdTableRows } from "react-icons/md";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { Menu } from "../Menu";
import { ImTree } from "react-icons/im";
import TopologySnapshotModal from "./TopologySnapshotModal";
import { Topology } from "../../context/TopologyPageContext";

interface IProps {
  topology: Topology;
  updateVisibility: (
    topologyId: string | undefined,
    updatedVisibility: boolean
  ) => void;
}

export const TopologyDropdownMenu = ({
  topology,
  updateVisibility
}: IProps) => {
  const [attachAsAsset, setAttachAsAsset] = useState(false);
  const [
    isDownloadComponentSnapshotModalOpen,
    setIsDownloadComponentSnapshotModalOpen
  ] = useState(false);

  const navigate = useNavigate();
  const viewLogs = () => {
    navigate(`/logs?topologyId=${topology.id}`);
  };

  return (
    <>
      <Menu>
        <Menu.VerticalIconButton />
        <Menu.Items>
          {topology.external_id && (
            <Menu.Item as="button" onClick={viewLogs}>
              <MdTableRows />
              <span className="pl-1 text-sm block">View Logs</span>
            </Menu.Item>
          )}

          <Menu.Item as="button" onClick={() => setAttachAsAsset(true)}>
            <MdAlarmAdd />
            <span className="pl-1 text-sm block">Link to Incident</span>
          </Menu.Item>

          <Menu.Item>
            <Link
              to={`/topology/${topology.id}`}
              className="flex items-center w-full"
            >
              <BiZoomIn />
              <span className="pl-1 text-sm block">Zoom In</span>
            </Link>
          </Menu.Item>

          {updateVisibility && (
            <Menu.Item
              as="button"
              onClick={() => updateVisibility(topology.id, !topology.hidden)}
            >
              {topology.hidden ? (
                <>
                  <BiShow />
                  <span className="pl-1 text-sm block">Unhide</span>
                </>
              ) : (
                <>
                  <BiHide />
                  <span className="pl-1 text-sm block">Hide</span>
                </>
              )}
            </Menu.Item>
          )}

          <Menu.Item>
            <button
              onClick={() => setIsDownloadComponentSnapshotModalOpen(true)}
              className="flex space-x-1 items-center w-full"
            >
              <ImTree />
              <span className="text-sm block">Snapshot</span>
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>

      <TopologySnapshotModal
        onCloseModal={() => setIsDownloadComponentSnapshotModalOpen(false)}
        isModalOpen={isDownloadComponentSnapshotModalOpen}
        topology={topology}
      />

      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        onClose={() => setAttachAsAsset(false)}
        type={EvidenceType.Topology}
        component_id={topology.id}
      />
    </>
  );
};
