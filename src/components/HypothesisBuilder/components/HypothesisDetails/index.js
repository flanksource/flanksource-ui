import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../../Badge";
import { Dropdown } from "../../../Dropdown";
import { badgeMap, hypothesisStates } from "../../data";
import { getNode, setDeepValue } from "../../../NestedHeirarchy/utils";
import { LinkedItems } from "../LinkedItems";

const stateItems = {
  ...Object.values(hypothesisStates).reduce((acc, obj) => {
    const title = obj.title.toLowerCase();
    acc[title] = {
      id: `dropdown-${title}`,
      name: title,
      icon: React.createElement(obj.icon.type, {
        color: obj.color,
        style: { width: "20px" }
      }),
      description: obj.title,
      value: title
    };
    return acc;
  }, {})
};

export function HypothesisDetails({ nodePath, tree, setTree, ...rest }) {
  const node = getNode(tree, nodePath);
  const handleCurrentNodeValueChange = (key, value) => {
    setTree(setDeepValue(tree, nodePath, key, value));
  };
  const handleCurrentNodeValueChangeMemoized = useCallback(
    handleCurrentNodeValueChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const { control, watch } = useForm({
    defaultValues: { state: node.state || Object.values(stateItems)[2].value }
  });

  const watchState = watch("state");
  useEffect(
    () => handleCurrentNodeValueChangeMemoized("state", watchState),
    [watchState, handleCurrentNodeValueChangeMemoized]
  );

  return (
    <div className={`py-7 ${rest.className || ""}`} {...rest}>
      <div className="mt-1 mr-2 mb-2 pr-8">
        <EditableText
          value={node.description}
          sharedClassName="text-xl font-medium text-gray-800"
          onChange={(e) =>
            handleCurrentNodeValueChange("description", e.target.value)
          }
        />
      </div>

      <div className="mb-6">
        <Badge size="sm" text={badgeMap[nodePath.length - 1]} />
      </div>
      <div className="mb-6">
        <HypothesisTitle>Hypothesis State</HypothesisTitle>
        <Dropdown
          control={control}
          name="state"
          className="mb-4 w-72"
          items={stateItems}
        />
      </div>
      <div className="mb-6">
        <HypothesisTitle>Evidences</HypothesisTitle>
      </div>
      <div className="mb-6">
        <LinkedItems
          currentNode={node}
          currentNodePath={nodePath}
          fullTree={tree}
          titlePrepend={<HypothesisTitle>Linked Items</HypothesisTitle>}
          onLinksChange={(newItems) =>
            handleCurrentNodeValueChange("links", newItems)
          }
        />
      </div>
      <div className="mb-6">
        <HypothesisTitle>Comments</HypothesisTitle>
      </div>
    </div>
  );
}

function HypothesisTitle({ ...rest }) {
  return (
    <div
      className={`text-md font-medium text-gray-800 ${rest.children}`}
      {...rest}
    >
      {rest.children}
    </div>
  );
}

function EditableText({
  value,
  textAreaClassName,
  buttonClassName,
  sharedClassName,
  placeholder,
  append,
  onChange,
  ...rest
}) {
  const [editMode, setEditMode] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (editMode) {
      inputRef.current.focus();
      const val = inputRef.current.value;
      inputRef.current.value = "";
      inputRef.current.value = val;
    }
  }, [editMode]);
  return (
    <div className="relative" {...rest}>
      {editMode && (
        <textarea
          className={`w-full py-0 px-px resize-none rounded-sm absolute top-0 bottom-0 left-0 right-0 overflow-y-hidden ${textAreaClassName} ${sharedClassName}`}
          defaultValue={value}
          onChange={onChange}
          onBlur={() => setEditMode(false)}
          ref={inputRef}
        />
      )}

      <button
        type="button"
        className={`w-full px-px text-left border border-transparent hover:border-gray-300 rounded-sm cursor-text ${buttonClassName} ${sharedClassName}`}
        style={{ overflowX: "hidden", wordWrap: "break-word" }}
        onClick={() => setEditMode(true)}
      >
        {value || (
          <span className="text-gray-400 ">{placeholder || "(empty)"}</span>
        )}
        {append}
      </button>
    </div>
  );
}
