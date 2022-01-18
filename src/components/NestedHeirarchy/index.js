import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  addNodeToTree,
  deleteNodeInTree,
  getTraverseOrderById,
  setDeepValue
} from "./utils";

export const minimalNodeTemplate = {
  id: null,
  children: []
};

export function NestedHeirarchy({
  children,
  tree,
  setTree,
  nodeTemplate = minimalNodeTemplate,
  additionalNodeFields,
  depthLimit,
  ...rest
}) {
  const handleNodeChange = (traverseOrder, key, value) => {
    setTree(setDeepValue(tree, traverseOrder, key, value));
  };

  const handleNodeChangeByID = (nodeID, key, value) => {
    const traverseOrder = getTraverseOrderById(nodeID);
    if (traverseOrder) {
      handleNodeChange(traverseOrder, key, value);
    }
  };

  const handleAddNode = (traverseOrder, additionalProps = {}) => {
    const newNode = {
      ...additionalProps,
      ...additionalNodeFields,
      ...nodeTemplate
    };
    newNode.id = uuidv4();
    setTree(addNodeToTree(traverseOrder, tree, newNode));
    return newNode.id;
  };

  const handleDeleteNode = (traverseOrder) => {
    setTree(deleteNodeInTree(traverseOrder, tree));
  };

  const treeFunctions = {
    handleNodeChange,
    handleNodeChangeByID,
    handleAddNode,
    handleDeleteNode,
    setTree,
    tree
  };

  const childProps = {
    node: tree,
    treeFunctions,
    parentArray: [],
    depthLimit,
    ...rest
  };

  return React.createElement(children.type, {
    ...children.props,
    ...childProps
  });
}
