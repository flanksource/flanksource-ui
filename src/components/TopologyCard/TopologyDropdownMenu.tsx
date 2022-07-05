import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BiHide, BiZoomIn } from "react-icons/bi";
import { MdAdd, MdAlarmAdd, MdTableRows } from "react-icons/md";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../AttachEvidenceDialog";

interface IProps {
  topology: any;
}

export const TopologyDropdownMenu = ({ topology }: IProps) => {
  const location = useLocation();
  const [attachAsAsset, setAttachAsAsset] = useState(false);

  const navigate = useNavigate();
  const viewLogs = () => {
    navigate(
      `/logs?topologyId=${topology.system_id}&externalId=${topology.external_id}&type=${topology.type}`
    );
  };

  return (
    <>
      <Menu as="div" className="relative inline-block flex flex-initial">
        <Menu.Button className="p-0.5 min-w-7 rounded-full text-gray-400 hover:text-gray-500">
          <DotsVerticalIcon className="h-6 w-6" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 top-full w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-card  focus:outline-none ">
            {topology.system_id && topology.external_id && (
              <Menu.Item>
                <button
                  onClick={viewLogs}
                  type="button"
                  className="flex items-center w-full text-gray-700 hover:bg-gray-200"
                >
                  <MdTableRows className="ml-3" />
                  <span className="py-3 pl-2 pr-3 text-sm block">
                    View Logs
                  </span>
                </button>
              </Menu.Item>
            )}

            <Menu.Item>
              <button
                onClick={() => setAttachAsAsset(true)}
                type="button"
                className="flex items-center w-full text-gray-700 hover:bg-gray-200"
              >
                <MdAlarmAdd className="ml-3" />
                <span className="py-3 pl-2 pr-3 text-sm block">
                  Attach as evidence
                </span>
              </button>
            </Menu.Item>

            <Menu.Item>
              <Link
                to={`/topology/${topology.id}`}
                className="flex items-center w-full text-gray-700 hover:bg-gray-200"
              >
                <BiZoomIn className="ml-3" />
                <span className="py-3 pl-2 pr-3 text-sm block">Zoom In</span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                to={`/topology/${topology.id}`}
                className="flex items-center w-full text-gray-700 hover:bg-gray-200"
              >
                <BiHide className="ml-3" />
                <span className="py-3 pl-2 pr-3 text-sm block">Hide</span>
              </Link>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>

      <AttachEvidenceDialog
        isOpen={attachAsAsset}
        onClose={() => setAttachAsAsset(false)}
        type={EvidenceType.Topology}
        description="Topology incident"
        evidence={{ id: topology.id }}
      />
    </>
  );
};
