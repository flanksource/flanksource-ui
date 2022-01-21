import { differenceWith } from "lodash";

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

export function deleteNodeInTree(traverseOrder, tree) {
  const IdToDelete = traverseOrder.pop();
  const children = getDeepValue(tree, traverseOrder, "children");
  const deleted = children.filter((obj) => obj.id !== IdToDelete);
  return setDeepValue({ ...tree }, traverseOrder, "children", deleted);
}

export function addNodeToTree(traverseOrder, tree, newNodeObject) {
  const existingChildrenNodes = getDeepValue(tree, traverseOrder, "children");
  return setDeepValue({ ...tree }, traverseOrder, "children", [
    newNodeObject,
    ...existingChildrenNodes
  ]);
}

export function getAllNodes(tree) {
  let result = [];
  result = getAllNodesAux(tree, result);
  return result;
}

export function getAllNodeIds(tree) {
  let result = [];
  result = getAllNodesAux(tree, result, true);
  return result;
}

export function getAllNodesAux(currentNode, accumulator, onlyIds) {
  if (currentNode?.children?.length > 0) {
    let childResult = [onlyIds ? currentNode.id : currentNode];
    currentNode?.children?.forEach((child) => {
      childResult = [
        ...childResult,
        ...getAllNodesAux(child, accumulator, onlyIds)
      ];
    });
    return [...accumulator, ...childResult];
  }
  return [...accumulator, onlyIds ? currentNode.id : currentNode];
}

export function getTraverseOrderById(id, tree) {
  return findNodeById(id, tree)?.traverseOrder;
}

export function findNodeById(id, tree) {
  return findNodeByIdAux(id, tree);
}

export function findNodeByIdAux(id, currentNode) {
  if (currentNode?.id === id) {
    return { id, traverseOrder: [id], node: currentNode };
  }
  let result = null;
  if (currentNode?.children?.length > 0) {
    currentNode?.children?.every((child) => {
      const childResult = findNodeByIdAux(id, child);
      if (childResult?.id === id) {
        result = childResult;
        return false;
      }
      return true;
    });
  }
  if (result?.traverseOrder) {
    result.traverseOrder = [currentNode.id, ...result.traverseOrder];
  }
  return result;
}

export function removeLinksFromTree(tree, idsToRemove, idToIgnore = null) {
  let result = { ...tree };
  result = removeLinksFromTreeAux(result, idsToRemove, idToIgnore);
  return result;
}

export function removeLinksFromTreeAux(
  currentNode,
  idsToRemove,
  idToIgnore = null
) {
  // link matching and removal
  if (currentNode.links?.length > 0) {
    currentNode.links = differenceWith(
      currentNode.links,
      idsToRemove,
      (linkedId, id) => linkedId === id
    );
  }
  // skip recursing into children if the current node to be ignored
  if (idToIgnore === currentNode.id) {
    return currentNode;
  }
  // recurse into children
  if (currentNode.children?.length > 0) {
    currentNode.children = currentNode.children.map((child) =>
      removeLinksFromTreeAux(child, idsToRemove, idToIgnore)
    );
  }
  return currentNode;
}
