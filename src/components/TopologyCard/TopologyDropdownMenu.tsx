import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiHide, BiShow, BiZoomIn } from "react-icons/bi";
import { MdAlarmAdd, MdTableRows } from "react-icons/md";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { Menu } from "../Menu";

interface IProps {
  topology: any;
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
        </Menu.Items>
      </Menu>

      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        onClose={() => setAttachAsAsset(false)}
        type={EvidenceType.Topology}
        component_id={topology.id}
      />
    </>
  );
};
