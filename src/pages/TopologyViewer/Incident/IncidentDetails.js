import React, { useEffect, useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import {
  createHypothesis,
  deleteHypothesis,
  deleteHypothesisBulk,
  getAllHypothesisByIncident,
  updateHypothesis
} from "../../../api/services/hypothesis";
import { getIncident } from "../../../api/services/incident";
import { Button } from "../../../components/Button";
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

export function IncidentDetailsPage() {
  const { id: incidentId } = useParams();
  const [isLoading, setIsLoading] = useState({
    incident: true,
    hypothesis: true
  });
  const isNewlyCreated = false; // TODO: set this to true if its a newly created incident
  const [loadedTree, setLoadedTree] = useState(null);
  const [incidentDetails, setIncidentDetails] = useState(null);

  useEffect(() => {
    if (incidentId) {
      getIncident(incidentId).then((res) => {
        setIncidentDetails(res.data[0]);
        setIsLoading((previous) => ({ ...previous, incident: false }));
      });

      getAllHypothesisByIncident(incidentId).then((res) => {
        setLoadedTree(buildTreeFromHypothesisList(res.data.data)); // temporarily build tree incorrectly
        setIsLoading((previous) => ({ ...previous, hypothesis: false }));
      });
    }
  }, [incidentId]);

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
      <div className="mt-4 w-full px-4">
        <div className="mb-4">
          <Link
            to="/incident"
            className="flex items-center text-sm font-semibold"
          >
            <BiChevronLeft
              style={{ width: "20px", height: "20px", marginRight: "8px" }}
            />
            Back to Incidents
          </Link>
        </div>
        <div className="mb-4">
          {!isLoading.incident ? (
            <IncidentDetails incident={incidentDetails} />
          ) : (
            <div>fetching incident...</div>
          )}
        </div>

        {!isLoading.hypothesis ? (
          <HypothesisBuilder
            loadedTree={loadedTree}
            // showGeneratedOutput
            initialEditMode={isNewlyCreated}
            api={{
              incidentId,
              create: createHypothesis,
              delete: deleteHypothesis,
              deleteBulk: deleteHypothesisBulk,
              update: updateHypothesis
            }}
          />
        ) : (
          <div>fetching tree...</div>
        )}
      </div>
    </div>
  );
}

function IncidentDetails({ incident, ...rest }) {
  const { title, id, description, severity, status, type } = incident;
  return (
    <div className="border px-6 py-3" {...rest}>
      <div className="text-gray-800 font-semibold">{title}</div>
      <div className="text-gray-400 text-sm">description: {description}</div>
      <div className="text-gray-400 text-sm">id: {id}</div>
      <div className="text-gray-400 text-sm">severity: {severity}</div>
      <div className="text-gray-400 text-sm">status: {status}</div>
      <div className="text-gray-400 text-sm">type: {type}</div>
    </div>
  );
}
