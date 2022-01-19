import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  createHypothesis,
  deleteHypothesis,
  deleteHypothesisBulk,
  getAllHypothesisByIncident,
  updateHypothesis
} from "../../../api/services/hypothesis";
import { HypothesisBuilder } from "../../../components/HypothesisBuilder";

function mapNode(node) {
  return {
    ...node,
    evidence: node.evidence || [],
    links: node.links || [],
    comments: node.comments || [],
    children: node.children || []
  };
}

// temporary tree-building method that is incorrect.
function buildTreeFromHypothesisList(list) {
  const root = mapNode(list.find((o) => o.type === "root"));
  const factors = list.filter((o) => o.type === "factor");
  const solutions = list.filter((o) => o.type === "solution");
  factors.forEach((factor) => {
    root.children = [...root.children, mapNode(factor)];
  });
  if (root.children.length > 0) {
    solutions.forEach((solution) => {
      const firstFactor = root.children[0];
      firstFactor.children = [...firstFactor.children, mapNode(solution)];
    });
  }
  return root;
}

export function IncidentDetails() {
  const [loadedTree, setLoadedTree] = useState(null);
  const { id: incidentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (incidentId) {
      getAllHypothesisByIncident(incidentId).then((res) => {
        setLoadedTree(buildTreeFromHypothesisList(res.data.data)); // temporarily build tree incorrectly
        setIsLoading(false);
      });
    }
  }, [incidentId]);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
      <div className="mt-4 w-full px-4">
        {isLoading ? (
          <div>loading...</div>
        ) : incidentId ? (
          <HypothesisBuilder
            loadedTree={loadedTree}
            showGeneratedOutput
            api={{
              incidentId,
              create: createHypothesis,
              delete: deleteHypothesis,
              deleteBulk: deleteHypothesisBulk,
              update: updateHypothesis
            }}
          />
        ) : (
          <div>Unable to find incident</div>
        )}
      </div>
    </div>
  );
}
