import React, { useState } from "react";

import { IoMdAdd, IoMdSave } from "react-icons/io";
import { BsPencil, BsInfoCircle } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import "./index.css";
import {
  addButtonLabels,
  hypothesisStates,
  textPlaceholders
} from "../../data";
import {
  deleteNodeInTree,
  getAllNodeIds,
  removeLinksFromTree
} from "../../../NestedHeirarchy/utils";

export function HypothesisNode({
  node,
  defaultEditMode = true,
  treeFunctions,
  parentArray,
  depthLimit,
  setModalIsOpen,
  setSelectedNodePath
}) {
  const { handleNodeChange, handleAddNode, tree, setTree } = treeFunctions;
  const [editMode, setEditMode] = useState(defaultEditMode);
  const isRoot = parentArray?.length <= 0;

  const handleOpenModal = () => {
    setSelectedNodePath([...parentArray, node.id]);
    setModalIsOpen(true);
  };

  const stateInfo = Object.values(hypothesisStates).find(
    (o) => o.value === node.state
  );

  return (
    <div
      key={node.id}
      className="w-full flex border border-t-0 border-gray-300 last:mb-1.5 first:border-t first:rounded-tl-md last:rounded-bl-md"
      style={{
        padding: "6px 0 2px 5px",
        borderRightWidth: isRoot ? "1px" : "0",
        animation: !isRoot && "0.8s ease-out 0s 1 highlightOnLoad"
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0 rounded-full mr-1"
        style={{ width: "26px", height: "26px" }}
      >
        {node.state && stateInfo ? (
          React.createElement(stateInfo.icon.type, {
            color: stateInfo.color,
            style: { width: "20px" }
          })
        ) : (
          <span className="text-md text-gray-400">
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
              <button
                className="text-left hover:text-indigo-800"
                type="button"
                onClick={handleOpenModal}
              >
                {node.description || "(none)"}
              </button>
            </div>
          ) : (
            <input
              className="w-full px-1 mr-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md"
              defaultValue={node.description}
              placeholder={textPlaceholders[parentArray?.length]}
              onChange={(e) =>
                handleNodeChange(
                  [...parentArray, node.id],
                  "description",
                  e.target.value
                )
              }
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-1 mb-1.5 mr-2">
          <div className="flex">
            {!editMode && (
              <>
                {depthLimit > parentArray?.length && (
                  <MiniButton
                    className="border border-gray-300 text-gray-500 rounded-md mr-2"
                    onClick={() => handleAddNode([...parentArray, node.id])}
                  >
                    <IoMdAdd style={{ fontSize: "13px" }} />
                    <span className="ml-1 text-xs">
                      {addButtonLabels[parentArray?.length]}
                    </span>
                  </MiniButton>
                )}

                {depthLimit > parentArray?.length &&
                  (node.links?.length > 0 ||
                    node.comments?.length > 0 ||
                    node.evidence?.length > 0) && (
                    <Separator color="rgba(209, 213, 219)" className="mr-2" />
                  )}

                {node.links?.length > 0 && (
                  <NumberedText
                    number={node.links?.length}
                    text="Linked items"
                    textStyle={{ fontSize: "12px" }}
                    className="mr-2"
                  />
                )}
                {node.comments?.length > 0 && (
                  <NumberedText
                    number={node.comments.length}
                    text="Comments"
                    textStyle={{ fontSize: "12px" }}
                    className="mr-2"
                  />
                )}
                {node.evidence?.length > 0 && (
                  <NumberedText
                    number={node.evidence?.length}
                    text="Evidences"
                    textStyle={{ fontSize: "12px" }}
                    className="mr-2"
                  />
                )}

                <>
                  {(depthLimit > parentArray?.length ||
                    node.evidence?.length > 0 ||
                    node.links?.length > 0 ||
                    node.comments?.length > 0) && (
                    <Separator color="rgba(209, 213, 219)" className="mr-2" />
                  )}

                  <MiniButton
                    className="rounded-md border border-gray-300 text-gray-500"
                    onClick={handleOpenModal}
                  >
                    <span className="text-xs">Details</span>
                  </MiniButton>
                </>
              </>
            )}
          </div>

          <div className="flex">
            {!isRoot && editMode && (
              <MiniButton
                className="rounded-md bg-red-400 text-white"
                onClick={() => {
                  const idsToRemove = getAllNodeIds(node);
                  const newTree = removeLinksFromTree(
                    tree,
                    idsToRemove,
                    node.id
                  );
                  setTree(deleteNodeInTree([...parentArray, node.id], newTree));
                }}
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
                setEditMode(!editMode);
              }}
            >
              {editMode ? (
                <IoMdSave style={{ fontSize: "13px" }} />
              ) : (
                <BsPencil style={{ fontSize: "13px" }} />
              )}
              <span className="ml-1 text-xs mt-0.5">
                {editMode ? "Done editing" : "Edit"}
              </span>
            </MiniButton>
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="">
            {node.children.map((child) => (
              <HypothesisNode
                node={child}
                treeFunctions={treeFunctions}
                parentArray={[...parentArray, node.id]}
                key={child.id}
                depthLimit={depthLimit}
                setModalIsOpen={setModalIsOpen}
                setSelectedNodePath={setSelectedNodePath}
                defaultEditMode={defaultEditMode}
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
      className={`px-2 py-0.5 flex items-center justify-center ${
        className || ""
      }`}
      style={{}}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

function Separator({ xMargins, yMargins, color, width, style, ...rest }) {
  return (
    <div
      style={{
        width: width ? `${width}px` : "1px",
        backgroundColor: color || "#909090",
        marginLeft: xMargins,
        marginRight: xMargins,
        marginTop: yMargins,
        marginBottom: yMargins,
        ...style
      }}
      {...rest}
    />
  );
}

function NumberedText({
  text = "",
  number = 0,
  onClick,
  className,
  numberClass,
  numberStyle,
  textClass,
  textStyle,
  ...rest
}) {
  return (
    <button
      className={`flex items-center ${!onClick ? "pointer-events-none" : ""} ${
        className || ""
      }`}
      type="button"
      onClick={onClick}
      {...rest}
    >
      <span
        className={`bg-gray-400 rounded-full mb-px text-white text-xs ${
          numberClass || ""
        }`}
        style={{ paddingLeft: "5px", paddingRight: "5px", ...numberStyle }}
      >
        {number}
      </span>{" "}
      <span
        className={`text-gray-500 text-sm ml-1 ${textClass || ""}`}
        style={textStyle}
      >
        {text}
      </span>
    </button>
  );
}
