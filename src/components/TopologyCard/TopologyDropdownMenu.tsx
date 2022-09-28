import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiHide, BiZoomIn } from "react-icons/bi";
import { MdAlarmAdd, MdTableRows } from "react-icons/md";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";
import { Menu } from "../Menu";

interface IProps {
  topology: any;
}

export const TopologyDropdownMenu = ({ topology }: IProps) => {
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

          <Menu.Item>
            <Link
              to={`/topology/${topology.id}`}
              className="flex items-center w-full"
            >
              <BiHide />
              <span className="pl-1 text-sm block">Hide</span>
            </Link>
          </Menu.Item>
        </Menu.Items>
      </Menu>

      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        onClose={() => setAttachAsAsset(false)}
        type={EvidenceType.Topology}
        evidence={{ id: topology.id }}
      />
    </>
  );
};
