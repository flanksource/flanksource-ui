import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "../Modal";
import { HypothesisDetails } from "./hypothesis-details";
import { HypothesisNode } from "./hypothesis-node";
import { CreateHypothesis } from "./create-hypothesis";
import { HypothesisTitle } from "./hypothesis-title";
import {
  createComment,
  getCommentsByHypothesis
} from "../../api/services/comments";
import { toastError } from "../Toast/toast";
import { useUser } from "../../context";

export function HypothesisBuilder({
  initialTree,
  loadedTree,
  initialEditMode = false,
  api,
  ...rest
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [createHypothesisModalIsOpen, setCreateHypothesisModalIsOpen] =
    useState(false);
  const defaultEditMode = loadedTree ? false : initialEditMode;
  const [tree, setTree] = useState(null);
  const [comments, setComments] = useState([]);

  const user = useUser();

  const fetchComments = useCallback(
    (id) =>
      getCommentsByHypothesis(id)
        .then((comments) => {
          setComments(comments?.data || []);
        })
        .catch((err) => console.error(err)),
    []
  );

  const handleComment = useCallback(
    (value) =>
      createComment(user, uuidv4(), tree.incident_id, tree.id, value)
        .catch(toastError)
        .then(() => {
          fetchComments(tree.id);
        }),
    [fetchComments, tree, user]
  );

  useEffect(() => {
    if (tree?.id) {
      fetchComments(tree.id);
    }
  }, [fetchComments, tree?.id]);

  useEffect(() => {
    setTree(loadedTree);
  }, [loadedTree]);

  return (
    <div {...rest}>
      <div className="w-full">
        <HypothesisNode
          node={tree}
          setModalIsOpen={setModalIsOpen}
          setSelectedNode={setSelectedNode}
          defaultEditMode={defaultEditMode}
          setCreateHypothesisModalIsOpen={setCreateHypothesisModalIsOpen}
          api={api}
        />
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        size="medium"
        titleClass="w-full"
        title={
          <HypothesisTitle node={selectedNode} api={api} comments={comments} />
        }
      >
        <HypothesisDetails
          node={selectedNode}
          api={api}
          comments={comments}
          handleComment={handleComment}
        />
      </Modal>
      <Modal
        open={createHypothesisModalIsOpen}
        onClose={() => {
          setCreateHypothesisModalIsOpen(false);
        }}
        size="medium"
      >
        <CreateHypothesis
          node={selectedNode}
          api={api}
          onHypothesisCreated={() => {
            setCreateHypothesisModalIsOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
