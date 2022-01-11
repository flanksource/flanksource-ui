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
    result.traverseOrder = [id, ...result.traverseOrder];
  }
  return result;
}
