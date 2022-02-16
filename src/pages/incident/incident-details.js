import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useQueryClient } from "react-query";
import {
  createHypothesis,
  deleteHypothesis,
  deleteHypothesisBulk,
  updateHypothesis
} from "../../api/services/hypothesis";
import { getIncident, updateIncident } from "../../api/services/incident";
import { HypothesisBuilder } from "../../components/HypothesisBuilder";
import { IncidentSeverity } from "../../components/Incidents/incident-severity";
import { IncidentStatus } from "../../components/Incidents/incident-status";
import { SearchLayout } from "../../components/Layout";

import { Loading } from "../../components/Loading";
import { Description } from "../../components/Description/description";
import { Button } from "../../components/Button";
import { Changelog } from "../../components/Change";
import { TopologyCard } from "../../components/Topology/topology-card";
import {
  createIncidentQueryKey,
  useIncidentQuery
} from "../../components/query-hooks/useIncidentQuery";
import { useUpdateHypothesisMutation } from "../../components/mutations/useUpdateHypothesisMutation";
import { useCreateHypothesisMutation } from "../../components/mutations/useCreateHypothesis";

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
  const isNewlyCreated = false; // TODO: set this to true if its a newly created incident
  const queryClient = useQueryClient();
  const incidentQuery = useIncidentQuery(incidentId);

  const { isLoading } = incidentQuery;

  const incidentData = useMemo(
    () => incidentQuery.data?.data,
    [incidentQuery.data]
  );

  const error = incidentData == null || !incidentData?.length;

  const incident = useMemo(
    () => (incidentData?.length ? incidentData[0] : null),
    [incidentData]
  );

  const status = useMemo(() => incident?.status ?? null, [incident]);

  const loadedTree = useMemo(
    () => (incident ? buildTreeFromHypothesisList(incident.hypothesis) : null),
    [incident]
  );

  const updateMutation = useUpdateHypothesisMutation({
    onSettled: () => {
      queryClient.invalidateQueries(createIncidentQueryKey(incidentId));
    }
  });
  const createMutation = useCreateHypothesisMutation({
    onSettled: () => {
      queryClient.invalidateQueries(createIncidentQueryKey(incidentId));
    }
  });

  const updateStatus = (status) =>
    updateIncident(incident.id, { status }).then(() => incidentQuery.refetch());

  if (incident == null) {
    return <Loading />;
  }

  return (
    <SearchLayout
      onRefresh={() => incidentQuery.refetch()}
      title={
        <>
          <div className="flex my-auto">
            <span className="text-xl flex">
              {" "}
              <Link to="/incidents">Incidents&nbsp;</Link>
              {" / "}
              {!isLoading && (
                <>
                  <div className="font-semibold">
                    <div>&nbsp;{incident.title}</div>
                  </div>
                </>
              )}
            </span>
          </div>
        </>
      }
    >
      <div className="mt-2 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          <section aria-labelledby="notes-title">
            <div className="bg-white sm:overflow-hidden">
              <div className="px-2 py-2 flex flex-nowrap">
                <TopologyCard
                  size="medium"
                  topologyId="017ed3af-c25a-5362-175d-40e7864ed7b7"
                  depth={0}
                />
              </div>
            </div>
          </section>

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
          <div className="bg-white px-4 py-5  shadow sm:rounded-lg sm:px-6">
            {/* <h2 className="text-lg font-medium text-gray-900">Details</h2> */}
            <div className="py-2 space-y-5">
              <div className="flex flex-nowrap space-x-10">
                <Description
                  label="Started"
                  value={dayjs(incident.created_at).fromNow()}
                />
                <Description
                  label="Updated"
                  value={dayjs(incident.updated_at).fromNow()}
                />
              </div>

              <Description
                label="Severity"
                value={<IncidentSeverity incident={incident} />}
              />

              <Description
                label="Status"
                value={<IncidentStatus incident={incident} />}
              />
              <div className="mt-6 flex flex-col justify-stretch">
                <Button
                  text={status === "open" ? "Resolve" : "Reopen"}
                  onClick={() =>
                    updateStatus(status === "open" ? "closed" : "open")
                  }
                />
              </div>
            </div>
          </div>
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
