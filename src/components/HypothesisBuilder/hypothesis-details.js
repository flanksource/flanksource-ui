import React, { useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { Dropdown } from "../Dropdown";
import { hypothesisStatuses } from "./data";
import { EvidenceSection } from "./evidence-section";
import { Modal } from "../Modal";
import { EvidenceBuilder } from "../EvidenceBuilder";
import { CommentsSection } from "./comments";
import {
  getCommentsByHypothesis,
  createComment
} from "../../api/services/comments";
import { getAllEvidenceByHypothesis } from "../../api/services/evidence";
import { useUser } from "../../context";
import { toastError } from "../Toast/toast";

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

export function HypothesisDetails({ node, api, ...rest }) {
  const [evidenceBuilderOpen, setEvidenceBuilderOpen] = useState(false);
  const user = useUser();
  const [comments, setComments] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [evidenceLoading, setEvidenceLoading] = useState(true);

  const fetchEvidence = (hypothesisId) => {
    getAllEvidenceByHypothesis(hypothesisId)
      .then((evidence) => {
        setEvidence(evidence?.data || []);
      })
      .finally(() => {
        setEvidenceLoading(false);
      });
  };

  const fetchComments = (id) =>
    getCommentsByHypothesis(id).then((comments) => {
      setComments(comments?.data || []);
    });

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
    debounce((params) => {
      if (api?.updateMutation && node?.id) {
        api.updateMutation.mutate({ id: node.id, params });
      }
    }, 1000)
  ).current;

  const { control, watch, getValues } = useForm({
    defaultValues: {
      status: node.status || Object.values(statusItems)[2].value
    }
  });

  watch();

  useEffect(() => {
    const subscription = watch((value) => {
      handleApiUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, handleApiUpdate]);

  return (
    <>
      <div className={clsx("pb-7", rest.className || "")} {...rest}>
        <div className="mt-6 mb-7">
          <Dropdown
            control={control}
            name="status"
            className="mb-4 w-72"
            items={statusItems}
          />
        </div>
        <div className="mb-8 mt-4">
          <EvidenceSection
            hypothesis={node}
            evidenceList={evidence}
            titlePrepend={<HypothesisTitle>Evidence</HypothesisTitle>}
            onButtonClick={() => setEvidenceBuilderOpen(true)}
            isLoading={evidenceLoading}
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
        <div className="">
          <CommentsSection
            comments={comments}
            onComment={(value) => handleComment(value)}
            titlePrepend={
              <HypothesisTitle className="mb-2.5">Comments</HypothesisTitle>
            }
          />
        </div>
      </div>
      <Modal
        open={evidenceBuilderOpen}
        onClose={() => setEvidenceBuilderOpen(false)}
        size="medium"
      >
        <EvidenceBuilder />
      </Modal>
    </>
  );
}

function HypothesisTitle({ className, ...rest }) {
  return (
    <div
      className={clsx(
        "text-lg font-medium text-gray-900 font-semibold",
        className
      )}
      {...rest}
    >
      {rest.children}
    </div>
  );
}
