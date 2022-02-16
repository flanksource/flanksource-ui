import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Dropdown } from "../../../Dropdown";
import { hypothesisStatuses } from "../../data";
import { getNode } from "../../../NestedHeirarchy/utils";
import { EvidenceSection } from "../EvidenceSection";
import { useUser } from "../../../../context";

export const CreateHypothesis = ({
  nodePath,
  treeFunctions,
  tree,
  api,
  onHypothesisCreated
}) => {
  const [commentTextValue, setCommentTextValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [evidenceChecked, setEvidenceChecked] = useState([]);
  const { handleAddNode } = treeFunctions;
  const user = useUser();
  const node = getNode(tree, nodePath);
  const statusItems = {
    ...Object.values(hypothesisStatuses).reduce((acc, obj) => {
      const title = obj.title.toLowerCase();
      acc[title] = {
        id: `dropdown-${title}`,
        name: title,
        icon: React.createElement(obj.icon.type, {
          color: obj.color,
          style: { width: "20px" }
        }),
        description: obj.title,
        value: title
      };
      return acc;
    }, {})
  };
  const { control, watch } = useForm({
    defaultValues: {
      status: node.status || Object.values(statusItems)[2].value
    }
  });

  const watchStatus = watch("status");
  const onSubmit = () => {
    const newNodeID = handleAddNode(nodePath);
    if (api?.createMutation) {
      api.createMutation.mutate({
        user,
        id: newNodeID,
        incidentId: api.incidentId,
        params: {
          title: nameValue,
          type: node.type,
          status: watchStatus
        }
      });
    }
    onHypothesisCreated();
  };
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-700">Creat hypothesis</h2>
      <div className="mt-6">
        <div className="text-sm font-medium text-gray-700 mb-1.5">
          <label htmlFor="name">Name</label>
        </div>
        <input
          id="name"
          type="text"
          placeholder="Type name"
          onChange={(e) => setNameValue(e.target.value)}
          value={nameValue}
          className="w-72 cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500 text-base leading-6 font-normal"
        />
      </div>
      <div className="mt-4">
        <Dropdown
          control={control}
          name="status"
          className="mb-4 w-72"
          items={statusItems}
          label="State"
        />
      </div>
      <EvidenceSection
        hypothesis={node}
        evidence={evidenceChecked}
        titlePrepend={
          <h3 className="mr-2 text-sm font-medium text-gray-700 mt-1.5">
            Evidence
          </h3>
        }
        onButtonClick={(data) => {
          setEvidenceChecked(data);
        }}
      />
      <div>
        <h3 className="mt-4 text-sm font-medium text-gray-700 mb-1.5">
          Comment
        </h3>
        <textarea
          className="w-full border-gray-200 resize-none rounded-6px text-base leading-6 font-normal font-inter outline-none placeholder-gray-400"
          onChange={(e) => setCommentTextValue(e.target.value)}
          placeholder="Type something"
          value={commentTextValue}
          style={{ minHeight: "138px" }}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="bg-dark-blue text-white rounded-6px py-3.5 px-6 disabled:bg-gray-200 disabled:text-gray-400 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={false}
          onClick={onSubmit}
        >
          Create
        </button>
      </div>
    </div>
  );
};
