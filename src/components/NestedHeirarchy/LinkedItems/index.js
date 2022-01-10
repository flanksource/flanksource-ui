import { Menu, Transition } from "@headlessui/react";
import React, { useEffect, Fragment, useState } from "react";

export function LinkedItems({
  currentNode,
  titlePrepend,
  fullTree,
  onLinksChange,
  ...rest
}) {
  const { links, id } = currentNode;
  const [nodeList, setNodeList] = useState(
    getAllNodes(fullTree).filter((o) => o.id !== id)
  );
  useEffect(() => {
    const allNodes = getAllNodes(fullTree).filter((o) => o.id !== id);
    setNodeList(allNodes);
  }, [fullTree, id]);

  const handleLinkClick = (node) => {
    const searchIndex = links.findIndex((o) => o === node.id);
    if (searchIndex > -1) {
      onLinksChange(links.filter((o) => o !== node.id));
    } else {
      onLinksChange([...links, node.id]);
    }
  };

  return (
    <div className={rest.className} {...rest}>
      <div className="flex justify-between items-center">
        <div className="">{titlePrepend}</div>
        <LinkedItemsDropdownButton
          items={nodeList}
          onItemClick={(id) => handleLinkClick(id)}
        />
      </div>
      <div className="border mt-2">
        {links && links.length > 0 ? (
          links.map((id) => {
            const item = nodeList.find((o) => o.id === id);
            return (
              <LinkedItem id={item.id} fullTree={fullTree} key={item.id} />
            );
          })
        ) : (
          <div className="py-2 px-4 text-sm text-gray-400">No linked items</div>
        )}
      </div>
    </div>
  );
}
export function LinkedItem({ id, fullTree, onClick, ...rest }) {
  const item = findNodeById(id, fullTree);
  const { description } = item.node;
  return (
    <div className="border-b last:border-b-0 py-1.5 px-4" {...rest}>
      {description}
    </div>
  );
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function LinkedItemsDropdownButton({ items, onItemClick, ...rest }) {
  return (
    <Menu as="div" className="relative inline-block text-left" {...rest}>
      <div>
        <Menu.Button className="inline-flex items-center px-2.5 py-1.5 mb-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Add a link
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-0 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {items?.length > 0 ? (
              items.map((item) => (
                <Menu.Item key={item.id}>
                  {({ active }) => (
                    <button
                      type="button"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm w-full text-left overflow-x-hidden overflow-ellipsis whitespace-nowrap"
                      )}
                      onClick={() => onItemClick(item)}
                    >
                      {item?.description || (
                        <span className="text-gray-400">
                          (no description given )
                        </span>
                      )}
                      {/* {item.description} {item.id} */}
                    </button>
                  )}
                </Menu.Item>
              ))
            ) : (
              <div className="block px-4 py-2 text-sm text-gray-400">
                No available items
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
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

function getAllNodesAux(currentNode, accumulator, onlyIds) {
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

function findNodeByIdAux(id, currentNode) {
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
