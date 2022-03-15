import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import { Dropdown } from "../../../Dropdown";
import { hypothesisStatuses } from "../../data";
import { getNode } from "../../../NestedHeirarchy/utils";

import { EvidenceSection } from "../EvidenceSection";
import { Modal } from "../../../Modal";
import { EvidenceBuilder } from "../../../EvidenceBuilder";
import { CommentsSection } from "../CommentsSection";
import { EditableText } from "../../../EditableText";
import {
  getCommentsByHypothesis,
  createComment
} from "../../../../api/services/comments";
import {
  createEvidence,
  deleteEvidenceBulk,
  getAllEvidenceByHypothesis
} from "../../../../api/services/evidence";
import { useUser } from "../../../../context";
import { toastError } from "../../../Toast/toast";
import { Avatar } from "../../../Avatar";
import { TopologySelectorModal } from "../../../TopologySelectorModal/TopologySelectorModal";
import { topologiesFactory } from "../../../../data/topologies";

const topologies = topologiesFactory(22);

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
  const [topologySelectorModal, setTopologySelectorModal] = useState(false);

  const node = useMemo(() => getNode(tree, nodePath), [tree, nodePath]);

  const selectedTopologies = useMemo(
    () =>
      evidence
        .filter(({ type }) => type === "topology")
        .map(({ evidence }) => evidence?.id),
    [evidence]
  );

  const fetchEvidence = (hypothesisId) => {
    getAllEvidenceByHypothesis(hypothesisId).then((evidence) => {
      const evidencePrepared =
        evidence?.data?.map((item) => ({
          ...item,
          type: "topology", // TODO remove this row after added topology type on backend
          evidence: JSON.parse(item.evidence)
        })) || [];
      setEvidence(evidencePrepared);
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
    debounce((params) => {
      if (api?.updateMutation && node?.id) {
        api.updateMutation.mutate({ id: node.id, params });
      }
    }, 1000)
  ).current;

  const { control, watch, setValue, getValues } = useForm({
    defaultValues: {
      status: node.status || Object.values(statusItems)[2].value,
      title: node.title?.trim() ?? ""
    }
  });

  watch();

  useEffect(() => {
    const subscription = watch((value) => {
      handleApiUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, handleApiUpdate]);

  const createEvidences = (topologiesId) => {
    const requests = topologies
      .filter(({ id }) => topologiesId.includes(id))
      .map((newEvidence) =>
        createEvidence(user, uuidv4(), node.id, JSON.stringify(newEvidence), {
          type: "topology"
        })
      );
    Promise.all(requests).then(() => {
      fetchEvidence(node.id);
    });
  };

  const deleteEvidences = (topologiesId) => {
    const evidencesIds = evidence
      .filter(({ evidence: topology }) => topologiesId.includes(topology.id))
      .map((evidence) => evidence.id);
    deleteEvidenceBulk(evidencesIds).then(() => {
      fetchEvidence(node.id);
    });
  };

  const topologyFilter = (topologiesIds) => {
    const newTopologiesId = topologiesIds.filter(
      (id) => !selectedTopologies.includes(id)
    );
    createEvidences(newTopologiesId);

    const oldTopologiesId = selectedTopologies.filter(
      (id) => !topologiesIds.includes(id)
    );
    deleteEvidences(oldTopologiesId);
  };

  return (
    <>
      <div className={clsx("py-7", rest.className || "")} {...rest}>
        <div className="flex pt-3">
          <Avatar size="sm" srcList={node.created_by.avatar} />
          <p className="font-inter text-dark-gray font-normal text-sm ml-1.5 mt-0.5">
            {node.created_by.name}
          </p>
        </div>
        <div className="mt-4 mr-2 mb-2 pr-8 flex flex-nowrap">
          {/* <Badge size="sm" text={badgeMap[nodePath.length - 1]} className="mr-2" /> */}
          <EditableText
            value={getValues("title")}
            sharedClassName="text-2xl font-semibold text-gray-900 grow"
            onChange={(e) => {
              setValue("title", e.target.value);
            }}
          />
        </div>
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
            evidence={evidence}
            titlePrepend={<HypothesisTitle>Evidence</HypothesisTitle>}
            onButtonClick={() => setTopologySelectorModal(true)}
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
      <TopologySelectorModal
        handleModalClose={() => setTopologySelectorModal(false)}
        isOpen={topologySelectorModal}
        topologies={topologies}
        title="Add evidence"
        submitButtonTitle="Add"
        onSubmit={(data) => {
          topologyFilter(data);
          setTopologySelectorModal(false);
        }}
        defaultChecked={selectedTopologies}
      />
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
