import React from "react";
import Randomstring from "randomstring";

export const minimalNodeTemplate = {
  id: null,
  children: []
};

export const getNode = (rootNode, traverseOrder) => {
  if (rootNode.id !== traverseOrder[0]) {
    return undefined;
  }
  let currentNode = rootNode;
  [...traverseOrder].slice(1).forEach((nextId) => {
    const nextNode = currentNode.children.find((o) => o.id === nextId); // TODO: handle non-existing keys
    currentNode = nextNode;
  });
  return currentNode;
};

export const getDeepValue = (rootNode, traverseOrder, key) =>
  getNode(rootNode, traverseOrder)[key];

export const setDeepValue = (rootNode, traverseOrder, key, value) => {
  if (rootNode.id !== traverseOrder[0]) {
    return undefined;
  }
  const newTree = { ...rootNode };
  let currentNode = newTree;
  [...traverseOrder].slice(1).forEach((nextId) => {
    const nextNode = currentNode.children.find((o) => o.id === nextId);
    currentNode = nextNode;
  });
  currentNode[key] = value;
  return newTree;
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

  const handleAddNode = (traverseOrder, additionalProps = {}) => {
    const newNode = {
      ...nodeTemplate,
      ...additionalNodeFields,
      ...additionalProps
    };
    newNode.id = Randomstring.generate(16);
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
