import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BiHide, BiZoomIn } from "react-icons/bi";
import { MdAlarmAdd, MdTableRows } from "react-icons/md";

export const TopologyDropdownMenu = ({ topology }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const viewLogs = () => {
    navigate(`/logs?topologyId=${topology.id}`);
  };

  return (
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
        <Menu.Items className="absolute right-0 top-full font-inter w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-card  focus:outline-none ">
          <Menu.Item>
            <button
              onClick={viewLogs}
              type="button"
              className="flex items-center w-full text-gray-700 hover:bg-gray-200"
            >
              <MdTableRows className="ml-3" />
              <span className="py-3 pl-2 pr-3 text-sm block">View Logs</span>
            </button>
          </Menu.Item>
          <Menu.Item>
            <Link
              to={`/incidents/create?topology=${topology.id}`}
              className="flex items-center w-full text-gray-700 hover:bg-gray-200"
              state={{
                backgroundLocation: location,
                evidenceType: "topology",
                evidence: { id: topology.id }
              }}
            >
              <MdAlarmAdd className="ml-3" />
              <span className="py-3 pl-2 pr-3 text-sm block">
                Create Incident
              </span>
            </Link>
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
              {" "}
              <BiHide className="ml-3" />
              <span className="py-3 pl-2 pr-3 text-sm block">Hide</span>
            </Link>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

TopologyDropdownMenu.propTypes = {
  topology: PropTypes.shape({}).isRequired
};
