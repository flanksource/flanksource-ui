import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { Dropdown } from "../../../Dropdown";
import { hypothesisStatuses } from "../../data";
import { getNode, setDeepValue } from "../../../NestedHeirarchy/utils";

import { EvidenceSection } from "../EvidenceSection";
import { Modal } from "../../../Modal";
import { EvidenceBuilder } from "../../../EvidenceBuilder";
import { CommentsSection } from "../CommentsSection";
import { EditableText } from "../../../EditableText";
import {
  getCommentsByHypothesis,
  createComment
} from "../../../../api/services/comments";
import { getAllEvidenceByHypothesis } from "../../../../api/services/evidence";
import { useUser } from "../../../../context";
import { toastError } from "../../../Toast/toast";

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
  const user = useUser();
  const [comments, setComments] = useState([]);
  const [evidence, setEvidence] = useState([]);

  const node = getNode(tree, nodePath);
  const handleCurrentNodeValueChange = (key, value) => {
    setTree(setDeepValue(tree, nodePath, key, value));
  };
  const handleCurrentNodeValueChangeMemoized = useCallback(
    handleCurrentNodeValueChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const fetchEvidence = (hypothesisId) => {
    getAllEvidenceByHypothesis(hypothesisId).then((evidence) => {
      setEvidence(evidence?.data || []);
    });
  };

  const fetchComments = (id) =>
    getCommentsByHypothesis(id)
      .then((comments) => {
        setComments(comments?.data || []);
      })
      .catch((err) => console.error(err));

  const handleComment = (value) =>
    createComment(user, uuidv4(), node.incident_id, node.id, value)
      .catch(toastError)
      .then(() => {
        fetchComments(node.id);
      });

  useEffect(() => {
    fetchEvidence(node.id);
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
      <div className={clsx("py-7", rest.className || "")} {...rest}>
        <div className="flex mt-3">
          <img
            className="h-6 w-6  rounded-full bg-gray-400 flex items-center justify-center"
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
            alt="avatar"
          />
          <p className="font-inter text-dark-gray font-normal text-sm ml-1.5 mt-0.5">
            John Crewer
          </p>
        </div>
        <div className="mt-5 mr-2 mb-2 pr-8 flex flex-nowrap">
          <Dropdown
            control={control}
            name="status"
            className="mb-4 w-40 mr-2"
            items={statusItems}
          />
          {/* <Badge size="sm" text={badgeMap[nodePath.length - 1]} className="mr-2" /> */}
          <EditableText
            value={node.title}
            sharedClassName="text-xl font-medium text-gray-800 grow"
            onChange={(e) => {
              handleApiUpdate("title", e.target.value);
              handleCurrentNodeValueChange("title", e.target.value);
            }}
          />
        </div>
        <div className="my-6">
          <Dropdown
            control={control}
            name="status"
            className="mb-4 w-72"
            items={statusItems}
          />
        </div>
        <div className="mb-9">
          <EvidenceSection
            hypothesis={node}
            evidence={evidence}
            titlePrepend={<HypothesisTitle>Evidence</HypothesisTitle>}
            onButtonClick={() => setEvidenceBuilderOpen(true)}
          />
        </div>
        {/* <div className="mb-6">
          <LinkedItems
            currentNode={node}
            currentNodePath={nodePath}
            fullTree={tree}
            titlePrepend={<HypothesisTitle>Linked Items</HypothesisTitle>}
            onLinksChange={(newItems) =>
              handleCurrentNodeValueChange("links", newItems)
            }
          />
        </div> */}
        <div className="mb-6">
          <CommentsSection
            comments={comments}
            onComment={(value) => handleComment(value)}
            titlePrepend={
              <HypothesisTitle className="mb-3">Comments</HypothesisTitle>
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
