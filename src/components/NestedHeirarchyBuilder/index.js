import React, { useState } from "react";
import Randomstring from "randomstring";

import { IoMdAdd, IoMdSave } from "react-icons/io";
import { BsPencil, BsInfoCircle } from "react-icons/bs";

import { AiFillDelete } from "react-icons/ai";
import "./index.css";
import { Icon } from "../Icon";

const sampleTree = {
  id: 1,
  description: "",
  hasRating: false,
  rating: 0,
  icon: "junit",
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
      className="w-full flex border border-gray-150 mb-1 last:mb-0"
      style={{
        padding: "4px 0 2px 3px",
        borderRightWidth: isRoot ? "1px" : "0",
        borderTopLeftRadius: "4px",
        borderBottomLeftRadius: "4px",
        animation: !isRoot && "1.2s ease-out 0s 1 highlightOnLoad"
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0 rounded-full mr-0.5"
        style={{ width: "26px", height: "26px" }}
      >
        {node.icon ? (
          <Icon name={node.icon} className="" size="md" />
        ) : (
          <span className=" text-md text-gray-400">
            <BsInfoCircle style={{ fontSize: "20px" }} />
          </span>
        )}
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-col pr-2">
          {!editMode ? (
            <div
              className={`ml-0.5 ${!node.description && "text-gray-400"}`}
              style={{ marginTop: "1px", marginBottom: "1px" }}
            >
              {node.description || "(none)"}
            </div>
          ) : (
            <input
              className="w-full px-1 mr-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
              defaultValue={descriptionInputValue}
              placeholder="Hypothesis"
              onChange={(e) => setDescriptionInputValue(e.target.value)}
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-1 mb-1.5 mr-2">
          <MiniButton
            className="border border-gray-300 text-gray-500 rounded-md"
            onClick={() => handleAddNode([...parentArray, node.id])}
          >
            <IoMdAdd style={{ fontSize: "13px" }} />
            <span className="ml-1 text-xs">Add hypothesis</span>
          </MiniButton>

          <div className="flex">
            {!isRoot && editMode && (
              <MiniButton
                className="rounded-md bg-red-400 text-white"
                onClick={() => handleDeleteNode([...parentArray, node.id])}
              >
                <AiFillDelete style={{ fontSize: "14px" }} />
                <span className="ml-1 mt-0.5 text-xs">Delete</span>
              </MiniButton>
            )}
            <MiniButton
              className={`ml-2 rounded-md border ${
                editMode
                  ? "bg-blue-500 border-blue-500 text-gray-50"
                  : "text-gray-500 border-gray-300"
              }`}
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
              {editMode ? (
                <IoMdSave style={{ fontSize: "13px" }} />
              ) : (
                <BsPencil style={{ fontSize: "13px" }} />
              )}
              <span className="ml-1 text-xs mt-0.5">
                {editMode ? "Save" : "Edit"}
              </span>
            </MiniButton>
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="">
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
    </div>
  );
}

function MiniButton({ className, onClick, children, ...rest }) {
  return (
    <button
      type="button"
      className={`${className} px-2 py-0.5 flex items-center justify-center`}
      style={{}}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
