import { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useCreateHypothesisMutation } from "../../api/mutations/useCreateHypothesisMutation";
import { useUpdateHypothesisMutation } from "../../api/mutations/useUpdateHypothesisMutation";
import { useCreateCommentMutation } from "../../api/query-hooks/mutations/comment";
import {
  createHypothesis,
  deleteHypothesis,
  deleteHypothesisBulk,
  updateHypothesis
} from "../../api/services/hypothesis";
import { updateIncident } from "../../api/services/incident";
import { EvidenceType } from "../../api/types/evidence";
import { Hypothesis } from "../../api/types/hypothesis";
import { Incident, IncidentStatus } from "../../api/types/incident";
import EmptyState from "../../components/EmptyState";
import { HypothesisActionPlanViewContainer } from "../../components/Incidents/Hypothesis/HypothesisActionPlanViewContainer/HypothesisActionPlanViewContainer";
import { HypothesisBuilder } from "../../components/Incidents/Hypothesis/HypothesisBuilder";
import { HypothesisCommentsViewContainer } from "../../components/Incidents/Hypothesis/HypothesisCommentsViewContainer/HypothesisCommentsViewContainer";
import EditableIncidentTitleBreadcrumb from "../../components/Incidents/IncidentDetails/EditableIncidentTitleBreadcrumb";
import { IncidentSidebar } from "../../components/Incidents/IncidentDetails/IncidentSidebar";
import { TopologyCard } from "../../components/Topology/TopologyCard/TopologyCard";
import { useIncidentState } from "../../store/incident.state";
import { Size } from "../../types";
import {
  BreadcrumbChild,
  BreadcrumbNav,
  BreadcrumbRoot
} from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { SearchLayout } from "../../ui/Layout/SearchLayout";
import IncidentDetailsPageSkeletonLoader from "../../ui/SkeletonLoader/IncidentDetailsPageSkeletonLoader";
import { Tab, Tabs } from "../../ui/Tabs/Tabs";

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
  createComment: UseMutationResult<any, any, any>;
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
  const { incident, refetchIncident, isLoading } = useIncidentState(
    incidentId!
  );
  const createComment = useCreateCommentMutation();
  const [refetchChangelog, setRefetchChangelog] = useState(0);
  const [activeViewType, setActiveViewType] = useState(
    IncidentDetailsViewTypes.comments
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
    updateIncident(incident?.id || null, { status }).then(() =>
      refetchIncident()
    );

  const updateIncidentHandler = useCallback(
    (newDataIncident: Partial<Incident>) => {
      updateIncident(incident?.id || null, newDataIncident).then(() => {
        refetchIncident();
        setRefetchChangelog(refetchChangelog + 1);
      });
    },
    [incident?.id, refetchIncident, refetchChangelog]
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
          label={IncidentDetailsViewTypes.comments}
          value={IncidentDetailsViewTypes.comments}
        >
          <HypothesisCommentsViewContainer
            incidentId={incidentId!}
            loadedTrees={loadedTrees}
            api={{
              incidentId,
              create: createHypothesis,
              delete: deleteHypothesis,
              deleteBulk: deleteHypothesisBulk,
              update: updateHypothesis,
              createComment,
              updateMutation,
              createMutation
            }}
          />
        </Tab>
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
                      createComment,
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
        onRefresh={() => refetchIncident()}
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="incidents" link="/incidents">
                Incidents
              </BreadcrumbRoot>,
              !isLoading && incident && (
                <BreadcrumbChild>
                  <EditableIncidentTitleBreadcrumb
                    incident={incident}
                    updateHandler={updateIncidentHandler}
                  />
                </BreadcrumbChild>
              )
            ]}
          />
        }
      >
        <div className="mt-2 flex h-full flex-row">
          {incident ? (
            <>
              <div className="flex h-full flex-1 flex-col p-6">
                <div className="mx-auto w-full max-w-3xl lg:max-w-6xl">
                  {Boolean(topologyIds?.length) && (
                    <section>
                      <div className="border-b">
                        <div className="flex flex-nowrap overflow-x-auto px-2 py-2">
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
            <div className="flex flex-1 flex-col justify-center p-6 font-semibold">
              <EmptyState title="Incident not found" />
            </div>
          )}
        </div>
      </SearchLayout>
    </>
  );
}
