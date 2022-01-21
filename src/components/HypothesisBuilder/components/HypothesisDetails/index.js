import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Badge } from "../../../Badge";
import { Dropdown } from "../../../Dropdown";
import { badgeMap, hypothesisStates } from "../../data";
import { getNode, setDeepValue } from "../../../NestedHeirarchy/utils";
import { LinkedItems } from "../LinkedItems";
import { EvidenceSection } from "../EvidenceSection";
import { Modal } from "../../../Modal";
import { EvidenceBuilder } from "../../../EvidenceBuilder";
import { CommentsSection } from "../CommentsSection";
import { EditableText } from "../../../EditableText";

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
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);

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
    <>
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
          <EvidenceSection
            currentNode={node}
            nodePath={nodePath}
            tree={tree}
            setTree={setTree}
            titlePrepend={<HypothesisTitle>Evidence</HypothesisTitle>}
            onButtonClick={() => setEvidenceBuilderOpen(true)}
          />
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
          <CommentsSection
            // comments={}
            titlePrepend={
              <HypothesisTitle className="mb-4">Comments</HypothesisTitle>
            }
          />
        </div>
      </div>
      <Modal
        open={evidenceBuilderOpen}
        onClose={() => setEvidenceBuilderOpen(false)}
        cardClass="w-full"
        contentClass="h-full p-8"
        cardStyle={{
          maxWidth: "1024px"
        }}
        closeButtonStyle={{ padding: "2.2rem 2.1rem 0 0" }}
        hideActions
      >
        <EvidenceBuilder />
      </Modal>
    </>
  );
}

function HypothesisTitle({ className, ...rest }) {
  return (
    <div className={`text-md font-medium text-gray-800 ${className}`} {...rest}>
      {rest.children}
    </div>
  );
}
