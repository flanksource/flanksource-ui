import { useCallback, useMemo, useState } from "react";
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
import { HypothesisBuilder } from "../../components/Hypothesis/HypothesisBuilder";
import { IncidentSidebar } from "../../components/IncidentDetails/IncidentSidebar";
import { SearchLayout } from "../../components/Layout";
import { useCreateHypothesisMutation } from "../../api/mutations/useCreateHypothesisMutation";
import { useUpdateHypothesisMutation } from "../../api/mutations/useUpdateHypothesisMutation";
import { useIncidentQuery } from "../../api/query-hooks";
import { TopologyCard } from "../../components/TopologyCard";
import { Size } from "../../types";
import IncidentDetailsPageSkeletonLoader from "../../components/SkeletonLoader/IncidentDetailsPageSkeletonLoader";
import { Head } from "../../components/Head/Head";
import { HypothesisCommentsViewContainer } from "../../components/Hypothesis/HypothesisCommentsViewContainer/HypothesisCommentsViewContainer";
import { HypothesisActionPlanViewContainer } from "../../components/Hypothesis/HypothesisActionPlanViewContainer/HypothesisActionPlanViewContainer";
import { Tab, Tabs } from "../../components/Tabs/Tabs";
import EmptyState from "../../components/EmptyState";

export enum IncidentDetailsViewTypes {
  comments = "Comments",
  actionPlan = "Action Plan"
}

export type TreeNode<T> = T & {
  children?: T[];
};

export interface HypothesisAPIs {
  incidentId: string | undefined;
  create: Function;
  delete: Function;
  deleteBulk: Function;
  update: Function;
  // todo: Type this correctly
  updateMutation: UseMutationResult<any, any, any>;
  createMutation: UseMutationResult<any, any, any>;
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
  const { isLoading, data: incident, refetch } = useIncidentQuery(incidentId!);
  const [refetchChangelog, setRefetchChangelog] = useState(0);
  const [activeViewType, setActiveViewType] = useState(
    IncidentDetailsViewTypes.actionPlan
  );

  const error = !!incident;

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
    updateIncident(incident?.id || null, { status }).then(() => refetch());

  const updateIncidentHandler = useCallback(
    (newDataIncident: Partial<Incident>) => {
      updateIncident(incident?.id || null, newDataIncident).then(() => {
        refetch();
        setRefetchChangelog(refetchChangelog + 1);
      });
    },
    [incident?.id, refetch, refetchChangelog]
  );

  const getHypothesisView = () => {
    if (isLoading && !error) {
      return <div>fetching tree...</div>;
    }

    return (
      <Tabs
        activeTab={activeViewType}
        onSelectTab={(tab) =>
          setActiveViewType(tab as IncidentDetailsViewTypes)
        }
      >
        <Tab
          label={IncidentDetailsViewTypes.actionPlan}
          value={IncidentDetailsViewTypes.actionPlan}
        >
          <HypothesisActionPlanViewContainer className="py-4">
            <div className="flex flex-col p-4">
              {loadedTrees?.map((loadedTree, index) => {
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
                  />
                );
              })}
            </div>
          </HypothesisActionPlanViewContainer>
        </Tab>
        <Tab
          label={IncidentDetailsViewTypes.comments}
          value={IncidentDetailsViewTypes.comments}
        >
          <HypothesisCommentsViewContainer
            incidentId={incidentId!}
            loadedTrees={loadedTrees}
          />
        </Tab>
      </Tabs>
    );
  };

  if (!incident && isLoading) {
    return <IncidentDetailsPageSkeletonLoader />;
  }

  return (
    <>
      <Head prefix={incident ? `Incident - ${incident.title}` : ""} />
      <SearchLayout
        contentClass="pl-6 h-full"
        onRefresh={() => refetch()}
        title={
          <div className="flex my-auto">
            <span className="text-xl flex">
              {" "}
              <Link to="/incidents">Incidents&nbsp;</Link>
              {" / "}
              {!isLoading && incident && (
                <div className="font-semibold">
                  <div>&nbsp;{incident.title}</div>
                </div>
              )}
            </span>
          </div>
        }
      >
        <div className="flex flex-row min-h-full h-auto mt-2">
          {incident ? (
            <>
              <div className="flex flex-col flex-1 p-6 min-h-full h-auto">
                <div className="max-w-3xl lg:max-w-6xl w-full mx-auto">
                  {Boolean(topologyIds?.length) && (
                    <section>
                      <div className="border-b">
                        <div className="px-2 py-2 flex flex-nowrap overflow-x-auto">
                          {topologyIds?.map((id) => (
                            <TopologyCard
                              key={id}
                              size={Size.large}
                              topologyId={id}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  )}
                  <section className="mt-4">{getHypothesisView()}</section>
                  <section className="mt-4">
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
              </div>
              <IncidentSidebar
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
            </>
          ) : (
            <div className="flex flex-col flex-1 p-6 justify-center font-semibold">
              <EmptyState title="Incident not found" />
            </div>
          )}
        </div>
      </SearchLayout>
    </>
  );
}
