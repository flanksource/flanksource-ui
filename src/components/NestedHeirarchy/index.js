import React from "react";
import Randomstring from "randomstring";

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
    const newNode = { ...nodeTemplate, ...additionalNodeFields };
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
