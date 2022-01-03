import React, { useState } from "react";
import Randomstring from "randomstring";

const sampleTree = {
  id: 1,
  description: "root node",
  hasRating: false,
  rating: 0,
  children: []
};

const nodeTemplate = {
  id: "",
  description: "",
  hasRating: false,
  rating: 0,
  children: []
};

export function NestedHeirarchyBuilder({ ...rest }) {
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
      ...existingChildrenNodes,
      newNode
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
      <div className="mt-12 w-full">
        <div>Generated tree:</div>
        <textarea
          onChange={() => {}}
          className="w-full"
          value={JSON.stringify(tree)}
        />
      </div>
    </div>
  );
}

function Node({ node, treeFunctions, parentArray }) {
  const { handleNodeChange, handleAddNode, handleDeleteNode } = treeFunctions;
  const [editMode, setEditMode] = useState(false);
  const [descriptionInputValue, setDescriptionInputValue] = useState(
    node.description
  );

  return (
    <div key={node.id} className="border border-red-500 p-3 w-full">
      <div className="flex flex-row">
        <div className="border border-black flex flex-col flex-grow">
          <div className="flex">
            <div className="flex-grow">
              {!editMode ? (
                node.description
              ) : (
                <input
                  className="w-full"
                  defaultValue={descriptionInputValue}
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
        {parentArray.length > 0 && (
          <button
            className="ml-2 px-2 bg-blue-700 text-white"
            type="button"
            onClick={() => handleDeleteNode([...parentArray, node.id])}
          >
            delete
          </button>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="mt-3">
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

      <div className="">
        <button
          type="button"
          className="mt-2 px-2 bg-blue-700 text-white"
          onClick={() => handleAddNode([...parentArray, node.id])}
        >
          add node
        </button>
      </div>
    </div>
  );
}
