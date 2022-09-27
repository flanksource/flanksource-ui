import { useCallback, useMemo } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { EvidenceType } from "../../api/services/evidence";
import {
  createHypothesis,
  deleteHypothesis,
  deleteHypothesisBulk,
  Hypothesis,
  updateHypothesis
} from "../../api/services/hypothesis";
import {
  Incident,
  IncidentStatus,
  updateIncident
} from "../../api/services/incident";
import { Changelog } from "../../components/Change";
import { HypothesisBuilder } from "../../components/Hypothesis/HypothesisBuilder";
import { IncidentDetails } from "../../components/IncidentDetails";
import { SearchLayout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { useCreateHypothesisMutation } from "../../components/mutations/useCreateHypothesisMutation";
import { useUpdateHypothesisMutation } from "../../components/mutations/useUpdateHypothesisMutation";
import { useIncidentQuery } from "../../components/query-hooks/useIncidentQuery";
import { CardSize, TopologyCard } from "../../components/TopologyCard";

export type TreeNode<T> = T & {
  children?: T[];
};

export interface HypothesisAPIs {
  incidentId: string | undefined;
  create: Function;
  delete: Function;
  deleteBulk: Function;
  update: Function;
  updateMutation: UseMutationResult;
  createMutation: UseMutationResult;
}

interface Tree {
  [k: string]: TreeNode<Hypothesis>;
}

// temporary tree-building method that is incorrect.
function buildTreeFromHypothesisList(list: Hypothesis[]) {
  const tree: Tree = {};

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

  return Object.values(tree);
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

  const topologyIds = (incident?.hypotheses || [])
    .flatMap((h) =>
      h.evidences?.map((e) =>
        e.type === EvidenceType.Topology ? e.component_id : null
      )
    )
    .filter((x) => x) as string[];

  const status = useMemo(() => incident?.status ?? null, [incident]);

  const loadedTrees = useMemo(
    () => (incident ? buildTreeFromHypothesisList(incident.hypotheses) : null),
    [incident]
  );

  const updateMutation = useUpdateHypothesisMutation({ incidentId });
  const createMutation = useCreateHypothesisMutation({ incidentId });

  const updateStatus = (status: IncidentStatus) =>
    updateIncident(incident?.id || null, { status }).then(() =>
      incidentQuery.refetch()
    );

  const updateIncidentHandler = useCallback(
    (newDataIncident: Partial<Incident>) => {
      updateIncident(incident?.id || null, newDataIncident).then(() =>
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
      contentClass="px-6 pb-6"
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
          {Boolean(topologyIds?.length) && (
            <section>
              <div className="border-b">
                <div className="px-2 py-2 flex flex-nowrap overflow-x-auto">
                  {topologyIds?.map((id) => (
                    <TopologyCard
                      key={id}
                      size={CardSize.large}
                      topologyId={id}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          <section>
            {!isLoading ? (
              loadedTrees?.map((loadedTree, index) => {
                return (
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
                    key={loadedTree.id}
                    showHeader={index === 0}
                  />
                );
              })
            ) : (
              <div>{!error && "fetching tree..."}</div>
            )}
          </section>
        </div>
        <section className="border-l lg:col-start-3 lg:col-span-1">
          <IncidentDetails
            incident={incident}
            updateStatusHandler={() =>
              updateStatus(
                status === IncidentStatus.Open
                  ? IncidentStatus.Closed
                  : IncidentStatus.Open
              )
            }
            updateIncidentHandler={updateIncidentHandler}
            textButton={status === IncidentStatus.Open ? "Close" : "Reopen"}
          />
          <div className="bg-white px-2 py-3 mt-4 shadow sm:rounded-lg sm:px-4 ml-4">
            <section aria-labelledby="applicant-information-title">
              <Changelog />
            </section>
          </div>
        </section>
      </div>
    </SearchLayout>
  );
}
