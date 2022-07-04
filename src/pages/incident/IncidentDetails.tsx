import React, { useMemo, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createHypothesis,
  deleteHypothesis,
  deleteHypothesisBulk,
  updateHypothesis
} from "../../api/services/hypothesis";
import { updateIncident } from "../../api/services/incident";
import { EvidenceType } from "../../api/services/evidence";
import { HypothesisBuilder } from "../../components/Hypothesis/HypothesisBuilder";
import { SearchLayout } from "../../components/Layout";

import { Loading } from "../../components/Loading";
import { Changelog } from "../../components/Change";
import { TopologyCard } from "../../components/Topology/topology-card";
import { useIncidentQuery } from "../../components/query-hooks/useIncidentQuery";
import { useUpdateHypothesisMutation } from "../../components/mutations/useUpdateHypothesisMutation";
import { useCreateHypothesisMutation } from "../../components/mutations/useCreateHypothesisMutation";
import { IncidentDetails } from "../../components/IncidentDetails";

// temporary tree-building method that is incorrect.
function buildTreeFromHypothesisList(list) {
  const tree = {};

  if (list.length === 0) {
    return null;
  }

  list.forEach((node) => {
    tree[node.id] = { ...node }; // mapNode(node);
  });

  // 2nd pass to add children
  list.forEach((node) => {
    if (node.parent_id != null) {
      tree[node.parent_id].children = [
        ...(tree[node.parent_id].children || []),
        tree[node.id]
      ];
    }
  });

  // 3rd pass to remove children from root
  list.forEach((node) => {
    if (node.parent_id != null) {
      delete tree[node.id];
    }
  });

  return Object.values(tree)[0];
}

export function IncidentDetailsPage() {
  const { id: incidentId } = useParams();
  const isNewlyCreated = false; // TODO: set this to true if its a newly created incident
  const incidentQuery = useIncidentQuery(incidentId);

  const { isLoading } = incidentQuery;

  const incidentData = useMemo(() => incidentQuery.data, [incidentQuery.data]);

  const error = incidentData == null || !incidentData?.length;

  const incident = useMemo(
    () => (incidentData?.length ? incidentData[0] : null),
    [incidentData]
  );

  const topologyIds = incident?.hypothesis
    ?.flatMap((h) =>
      h.evidence.map((e) =>
        e.type === EvidenceType.Topology ? e.evidence.id : null
      )
    )
    .filter(Boolean);

  const status = useMemo(() => incident?.status ?? null, [incident]);

  const loadedTree = useMemo(
    () => (incident ? buildTreeFromHypothesisList(incident.hypothesis) : null),
    [incident]
  );

  const updateMutation = useUpdateHypothesisMutation({ incidentId });
  const createMutation = useCreateHypothesisMutation({ incidentId });

  const updateStatus = (status) =>
    updateIncident(incident.id, { status }).then(() => incidentQuery.refetch());

  const updateIncidentHandler = useCallback(
    (newDataIncident) => {
      updateIncident(incident.id, newDataIncident).then(() =>
        incidentQuery.refetch()
      );
    },
    [incidentQuery, incident]
  );

  if (incident == null) {
    return <Loading />;
  }
  return (
    <SearchLayout
      onRefresh={() => incidentQuery.refetch()}
      title={
        <div className="flex my-auto">
          <span className="text-xl flex">
            {" "}
            <Link to="/incidents">Incidents&nbsp;</Link>
            {" / "}
            {!isLoading && (
              <div className="font-semibold">
                <div>&nbsp;{incident.title}</div>
              </div>
            )}
          </span>
        </div>
      }
    >
      <div className="mt-2 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          {Boolean(topologyIds.length) && (
            <section aria-labelledby="notes-title">
              <div className="bg-white sm:overflow-hidden">
                <div className="px-2 py-2 flex flex-nowrap">
                  {topologyIds.map((id) => (
                    <TopologyCard
                      key={id}
                      size="large"
                      topologyId={id}
                      depth={2}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          <section aria-labelledby="notes-title">
            <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
              <div className="px-2 py-2">
                {!isLoading ? (
                  <HypothesisBuilder
                    loadedTree={loadedTree}
                    // showGeneratedOutput
                    initialEditMode={isNewlyCreated}
                    api={{
                      incidentId,
                      create: createHypothesis,
                      delete: deleteHypothesis,
                      deleteBulk: deleteHypothesisBulk,
                      update: updateHypothesis,
                      updateMutation,
                      createMutation
                    }}
                  />
                ) : (
                  <div>{!error && "fetching tree..."}</div>
                )}
              </div>
            </div>
          </section>
        </div>
        <section
          aria-labelledby="timeline-title"
          className="lg:col-start-3 lg:col-span-1"
        >
          <IncidentDetails
            incident={incident}
            updateStatusHandler={() =>
              updateStatus(status === "open" ? "closed" : "open")
            }
            updateIncidentHandler={updateIncidentHandler}
            textButton={status === "open" ? "Close" : "Reopen"}
          />
          <div className="bg-white px-4 py-5 mt-4  shadow sm:rounded-lg sm:px-6">
            <section aria-labelledby="applicant-information-title">
              <Changelog />
            </section>
          </div>
        </section>
      </div>
    </SearchLayout>
  );
}
