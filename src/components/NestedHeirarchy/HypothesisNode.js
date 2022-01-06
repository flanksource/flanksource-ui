import React, { useState } from "react";

import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import { IoMdAdd, IoMdSave } from "react-icons/io";
import { BsPencil, BsInfoCircle } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { Icon } from "../Icon";
import "./index.css";

export const hypothesisStates = {
  0: {
    title: "Unlikely",
    icon: <ThumbDownIcon />,
    color: "#808080"
  },
  1: {
    title: "Improbable",
    icon: <ThumbDownIcon />,
    color: "#F59337"
  },
  2: {
    title: "Disproven",
    icon: <ThumbDownIcon />,
    color: "#DD4F4F"
  },
  3: {
    title: "Possible",
    icon: <ThumbUpIcon />,
    color: "#808080"
  },
  4: {
    title: "Likely",
    icon: <ThumbUpIcon />,
    color: "#AAA526"
  },
  5: {
    title: "Proven",
    icon: <ThumbUpIcon />,
    color: "#459E45"
  }
};

export const hypothesisInitialFields = {
  state: null,
  evidences: [],
  links: [],
  comments: []
};

const addButtonLabels = ["Add issue", "Add potential solution"];
const textPlaceholders = ["Root hypothesis", "Issue", "Potential solution"];

export function HypothesisNode({
  node,
  treeFunctions,
  parentArray,
  depthLimit,
  setModalIsOpen,
  setSelectedNode
}) {
  const { handleNodeChange, handleAddNode, handleDeleteNode } = treeFunctions;
  const [editMode, setEditMode] = useState(true);
  const [descriptionInputValue, setDescriptionInputValue] = useState(
    node.description
  );
  const isRoot = parentArray.length <= 0;

  const handleOpenModal = () => {
    setSelectedNode(node);
    setModalIsOpen(true);
  };

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
              placeholder={textPlaceholders[parentArray.length]}
              onChange={(e) => setDescriptionInputValue(e.target.value)}
            />
          )}
        </div>

        <div className="flex items-center justify-between mt-1 mb-1.5 mr-2">
          <div className="flex">
            {!editMode && (
              <>
                {depthLimit > parentArray.length && (
                  <MiniButton
                    className="border border-gray-300 text-gray-500 rounded-md"
                    onClick={() => handleAddNode([...parentArray, node.id])}
                  >
                    <IoMdAdd style={{ fontSize: "13px" }} />
                    <span className="ml-1 text-xs">
                      {addButtonLabels[parentArray.length]}
                    </span>
                  </MiniButton>
                )}

                {depthLimit > parentArray.length &&
                  (node.links.length > 0 ||
                    node.comments.length > 0 ||
                    node.evidences.length > 0) && (
                    <Separator color="rgba(209, 213, 219)" xMargins="12px" />
                  )}

                {node.links.length > 0 && (
                  <NumberedText
                    number={node.links.length}
                    text="Linked items"
                    textStyle={{ fontSize: "12px" }}
                  />
                )}
                {node.comments.length > 0 && (
                  <NumberedText
                    number={node.comments.length}
                    text="Comments"
                    textStyle={{ fontSize: "12px" }}
                    className="ml-3"
                  />
                )}
                {node.evidences.length > 0 && (
                  <NumberedText
                    number={node.evidences.length}
                    text="Evidences"
                    textStyle={{ fontSize: "12px" }}
                    className="ml-3"
                  />
                )}

                {(node.links.length > 0 ||
                  node.comments.length > 0 ||
                  node.evidences.length > 0) && (
                  <Separator color="rgba(209, 213, 219)" xMargins="12px" />
                )}

                <>
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
              <HypothesisNode
                node={child}
                treeFunctions={treeFunctions}
                parentArray={[...parentArray, node.id]}
                key={child.id}
                depthLimit={depthLimit}
                setModalIsOpen={setModalIsOpen}
                setSelectedNode={setSelectedNode}
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
