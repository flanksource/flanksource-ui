import { Menu, Transition } from "@headlessui/react";
import React, { useEffect, Fragment, useState } from "react";
import { differenceWith } from "lodash";
import { AiFillDelete } from "react-icons/ai";
import { findNodeById, getAllNodes } from "../../../NestedHeirarchy/utils";
import { Badge } from "../../../Badge";
import { badgeMap } from "../../data";

const getLinkableNodes = (allNodes, nonLinkableIDs) =>
  differenceWith(allNodes, nonLinkableIDs, (node, id) => node.id === id);

export function LinkedItems({
  currentNode,
  currentNodePath,
  titlePrepend,
  fullTree,
  onLinksChange,
  ...rest
}) {
  const { links, id: nodeId } = currentNode;
  const [allNodes, setAllNodes] = useState(getAllNodes(fullTree));
  const [linkableNodes, setLinkableNodes] = useState(
    getLinkableNodes(allNodes || [], [...links, nodeId])
  );

  useEffect(() => {
    setAllNodes(getAllNodes(fullTree));
  }, [fullTree, setAllNodes]);

  useEffect(() => {
    setLinkableNodes(getLinkableNodes(allNodes || [], [...links, nodeId]));
  }, [allNodes, links, nodeId]);

  const handleLinkAdd = (id) => {
    onLinksChange([...links, id]);
  };

  const handleLinkDelete = (id) => {
    onLinksChange(links.filter((oid) => oid !== id));
  };

  return (
    <div className={rest.className} {...rest}>
      <div className="flex justify-between items-center">
        <div className="">{titlePrepend}</div>
        <LinkedItemsDropdownButton
          items={linkableNodes}
          onItemClick={(node) => handleLinkAdd(node.id)}
        />
      </div>
      <div className="border mt-2">
        {links && links.length > 0 && allNodes ? (
          links.map((linkId) => {
            const item = allNodes.find((o) => o.id === linkId);
            return (
              <LinkedItem
                id={item.id}
                fullTree={fullTree}
                key={item.id}
                onDelete={() => handleLinkDelete(linkId)}
              />
            );
          })
        ) : (
          <div className="py-2 px-4 text-sm text-gray-400">No linked items</div>
        )}
      </div>
    </div>
  );
}

export function LinkedItem({ id, fullTree, onClick, onDelete, ...rest }) {
  const { node, traverseOrder } = findNodeById(id, fullTree);
  const { description } = node;
  return (
    <div
      className="flex justify-between border-b last:border-b-0 py-1.5 px-4"
      {...rest}
    >
      <button type="button" onClick={onClick}>
        <span className="mr-4 text-sm text-gray-800 text-left">
          {description || (
            <span className="text-gray-400">No description given</span>
          )}
        </span>
        <Badge size="xs" text={badgeMap[traverseOrder.length - 1]} />
      </button>
      <button type="button" title="Remove link" onClick={onDelete}>
        <AiFillDelete className="text-red-400" />
      </button>
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
