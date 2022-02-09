import React from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import clsx from "clsx";
import { BiMessageAltDetail, IoAddSharp } from "react-icons/all";
import { BsFileBarGraph } from "react-icons/bs";
import { VscGraph } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import { Icon } from "../../../Icon";
import { HypothesisRow } from "./HypothesisRow";
import { hypothesisStatuses } from "../../data";
import { HypothesisList } from "./HypothesisList";

export const HypothesisTree = ({
  node,
  parentArray,
  setModalIsOpen,
  setSelectedNodePath
}) => {
  const handleOpenModal = () => {
    setSelectedNodePath([...parentArray, node.id]);
    setModalIsOpen(true);
  };
  const EnumsIcon = {
    proven: 0,
    likely: 1,
    possible: 2,
    unlikely: 3,
    improbable: 4,
    disproven: 5
  };
  const enumsStatus = (status) => hypothesisStatuses[EnumsIcon[status]];
  const statusColorClass = (status) =>
    clsx({
      "text-light-green":
        enumsStatus(status).value === hypothesisStatuses["0"].value,
      "text-bright-green":
        enumsStatus(status).value === hypothesisStatuses["1"].value,
      "text-warm-green":
        enumsStatus(status).value === hypothesisStatuses["2"].value,
      "text-warmer-gray":
        enumsStatus(status).value ===
        (hypothesisStatuses["3"].value || hypothesisStatuses["4"].value),
      "text-bright-red":
        enumsStatus(status).value === hypothesisStatuses["5"].value
    });
  return (
    <div>
      <div className="flex align-baseline text-base font-semibold mb-6">
        <h2 className="text-dark-gray mr-3 text-2xl">Action plan</h2>
        <button type="button" className="bg-dark-blue rounded-full p-2">
          <Icon name="addButton" className="w-3 h-3" />
        </button>
      </div>
      <div className="w-full mt-5">
        <div className="w-full bg-white rounded-8px">
          <div className="w-full flex justify-between">
            <HypothesisRow
              renderChevronIcon={() => (
                <ChevronDownIcon className={clsx("w-5 h-5 ml-4 mr-2")} />
              )}
              iconLeftClassName={statusColorClass(node.status)}
              iconLeft={enumsStatus(node.status).icon}
              text={node.title}
              showMessageIcon={node.comments.length > 0}
              showSignalIcon={node.evidence.length > 0}
              image={node.created_by.avatar}
              onOpenModal={handleOpenModal}
            />
          </div>
          <div className="bg-light-blue p-5  mt-4 rounded-8px border border-dashed">
            <HypothesisList
              node={node}
              statusColorClass={statusColorClass}
              enumsStatus={enumsStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
