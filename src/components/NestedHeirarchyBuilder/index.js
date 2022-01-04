import React, { useState } from "react";
import Randomstring from "randomstring";

import { IoMdAdd } from "react-icons/io";
import { BsXDiamond } from "react-icons/bs";

const sampleTree = {
  id: 1,
  description: "",
  hasRating: false,
  rating: 0,
  icon: "azure",
  children: []
};

const nodeTemplate = {
  id: "",
  description: "",
  hasRating: false,
  rating: 0,
  icon: null,
  children: []
};

export function NestedHeirarchyBuilder({ showJSON, ...rest }) {
  const [tree, setTree] = useState(sampleTree);

  const getDeepValue = (rootNode, traverseOrder, key) => {
    if (rootNode.id !== traverseOrder[0]) {
      return undefined;
    }
    let currentNode = rootNode;
    [...traverseOrder].slice(1).forEach((key) => {
      const nextNode = currentNode.children.find((o) => o.id === key); // TODO: handle non-existing keys
      currentNode = nextNode;
    });
    return currentNode[key];
  };

  const setDeepValue = (rootNode, traverseOrder, key, value) => {
    if (rootNode.id !== traverseOrder[0]) {
      return undefined;
    }
    const newTree = { ...rootNode };
    let currentNode = newTree;
    [...traverseOrder].slice(1).forEach((key) => {
      const nextNode = currentNode.children.find((o) => o.id === key);
      currentNode = nextNode;
    });
    currentNode[key] = value;
    return newTree;
  };

  const handleNodeChange = (traverseOrder, key, value) => {
    setTree(setDeepValue(tree, traverseOrder, key, value));
  };

  const handleAddNode = (traverseOrder) => {
    const newNode = { ...nodeTemplate };
    newNode.id = Randomstring.generate(10);
    const existingChildrenNodes = getDeepValue(tree, traverseOrder, "children");
    const newTree = setDeepValue({ ...tree }, traverseOrder, "children", [
      newNode,
      ...existingChildrenNodes
    ]);
    setTree(newTree);
  };

  const handleDeleteNode = (traverseOrder) => {
    const IdToDelete = traverseOrder.pop();
    const children = getDeepValue(tree, traverseOrder, "children");
    const deleted = children.filter((obj) => obj.id !== IdToDelete);
    const newTree = setDeepValue(
      { ...tree },
      traverseOrder,
      "children",
      deleted
    );
    setTree(newTree);
  };

  const treeFunctions = {
    handleNodeChange,
    handleAddNode,
    handleDeleteNode,
    setTree
  };

  return (
    <div className="w-full">
      <div className="w-full" {...rest}>
        <Node node={tree} treeFunctions={treeFunctions} parentArray={[]} />
      </div>
      {showJSON && (
        <div className="mt-12 w-full">
          <div>Generated tree:</div>
          <textarea
            onChange={() => {}}
            className="w-full"
            value={JSON.stringify(tree)}
          />
        </div>
      )}
    </div>
  );
}

function Node({ node, treeFunctions, parentArray }) {
  const { handleNodeChange, handleAddNode, handleDeleteNode } = treeFunctions;
  const [editMode, setEditMode] = useState(true);
  const [descriptionInputValue, setDescriptionInputValue] = useState(
    node.description
  );
  const isRoot = parentArray.length <= 0;

  return (
    <div
      key={node.id}
      className="w-full border border-gray-150 mb-1 last:mb-0"
      style={{
        padding: "6px 0 3px 2px",
        borderRightWidth: isRoot ? "1px" : "0",
        borderTopLeftRadius: "4px",
        borderBottomLeftRadius: "4px"
      }}
    >
      <div className="flex flex-row items-center pr-2">
        <div
          className="flex items-center justify-center  rounded-full mr-0"
          style={{ width: "29px", height: "29px" }}
        >
          <BsXDiamond style={{ fontSize: "19px" }} />
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex">
            <div className="flex-grow">
              {!editMode ? (
                <span className="px-1">{node.description}</span>
              ) : (
                <input
                  className="w-full px-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
                  defaultValue={descriptionInputValue}
                  placeholder="Hypothesis"
                  onChange={(e) => setDescriptionInputValue(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>
        <button
          className="ml-2 px-2 bg-blue-700 text-white"
          type="button"
          onClick={() => {
            if (editMode) {
              handleNodeChange(
                [...parentArray, node.id],
                "description",
                descriptionInputValue
              );
            }
            setEditMode(!editMode);
          }}
        >
          {editMode ? "save" : "edit"}
        </button>
        {!isRoot && (
          <button
            className="ml-2 px-2 bg-blue-700 text-white"
            type="button"
            onClick={() => handleDeleteNode([...parentArray, node.id])}
          >
            delete
          </button>
        )}
      </div>

      <div className="flex items-center text-xs text-gray-500 mt-1 mb-1.5 ml-7">
        <button
          type="button"
          className="px-2 py-0.5 flex items-center justify-center border border-gray-300 text-gray-600 rounded-full"
          style={{}}
          onClick={() => handleAddNode([...parentArray, node.id])}
        >
          <IoMdAdd style={{ fontSize: "13px" }} />
          <span className="ml-1">Add hypothesis</span>
        </button>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="ml-7">
          {node.children.map((child) => (
            <Node
              node={child}
              treeFunctions={treeFunctions}
              parentArray={[...parentArray, node.id]}
              key={child.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
