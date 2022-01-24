import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "../../../Badge";
import { Dropdown } from "../../../Dropdown";
import { badgeMap, hypothesisStatuses } from "../../data";
import { getNode, setDeepValue } from "../../../NestedHeirarchy/utils";
import { LinkedItems } from "../LinkedItems";
import { EvidenceSection } from "../EvidenceSection";
import { Modal } from "../../../Modal";
import { EvidenceBuilder } from "../../../EvidenceBuilder";
import { CommentsSection } from "../CommentsSection";
import { EditableText } from "../../../EditableText";
import {
  getCommentsByHypothesis,
  createComment
} from "../../../../api/services/comments";

const statusItems = {
  ...Object.values(hypothesisStatuses).reduce((acc, obj) => {
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

export function HypothesisDetails({ nodePath, tree, setTree, api, ...rest }) {
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const node = getNode(tree, nodePath);
  const handleCurrentNodeValueChange = (key, value) => {
    setTree(setDeepValue(tree, nodePath, key, value));
  };
  const handleCurrentNodeValueChangeMemoized = useCallback(
    handleCurrentNodeValueChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchComments = (id) =>
    getCommentsByHypothesis(id)
      .then((data) => {
        setComments(data?.data?.data || []);
      })
      .catch((err) => console.error(err));

  const handleComment = (value) =>
    createComment(uuidv4(), node.incident_id, node.id, value).then(() => {
      fetchComments(node.id);
    });

  useEffect(() => {
    fetchComments(node.id);
  }, [node.id]);

  const handleApiUpdate = useRef(
    debounce((key, value) => {
      if (api?.update && node?.id) {
        const params = {};
        params[key] = value;
        api.update(node.id, params);
      }
    }, 1000)
  ).current;

  const { control, watch } = useForm({
    defaultValues: {
      status: node.status || Object.values(statusItems)[2].value
    }
  });

  const watchStatus = watch("status");
  useEffect(() => {
    handleApiUpdate("status", watchStatus);
    handleCurrentNodeValueChangeMemoized("status", watchStatus);
  }, [watchStatus, handleCurrentNodeValueChangeMemoized, handleApiUpdate]);

  return (
    <>
      <div className={`py-7 ${rest.className || ""}`} {...rest}>
        <div className="mt-1 mr-2 mb-2 pr-8">
          <EditableText
            value={node.title}
            sharedClassName="text-xl font-medium text-gray-800"
            onChange={(e) => {
              handleApiUpdate("title", e.target.value);
              handleCurrentNodeValueChange("title", e.target.value);
            }}
          />
        </div>

        <div className="mb-6">
          <Badge size="sm" text={badgeMap[nodePath.length - 1]} />
        </div>
        <div className="mb-6">
          <HypothesisTitle>Hypothesis Status</HypothesisTitle>
          <Dropdown
            control={control}
            name="status"
            className="mb-4 w-72"
            items={statusItems}
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
            comments={comments}
            onComment={(value) => handleComment(value)}
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
