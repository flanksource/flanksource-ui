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
import { Changelog } from "../../components/Change";
import { HypothesisBuilder } from "../../components/Hypothesis/HypothesisBuilder";
import { IncidentDetails } from "../../components/IncidentDetails";
import { SearchLayout } from "../../components/Layout";
import { useCreateHypothesisMutation } from "../../components/mutations/useCreateHypothesisMutation";
import { useUpdateHypothesisMutation } from "../../components/mutations/useUpdateHypothesisMutation";
import { useIncidentQuery } from "../../api/query-hooks";
import { TopologyCard } from "../../components/TopologyCard";
import { Size } from "../../types";
import SlidingSideBar from "../../components/SlidingSideBar";
import IncidentDetailsPageSkeletonLoader from "../../components/SkeletonLoader/IncidentDetailsPageSkeletonLoader";

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

  if (incident == null) {
    return <IncidentDetailsPageSkeletonLoader />;
  }

  return (
    <SearchLayout
      contentClass="pl-6 h-full overflow-y-auto"
      onRefresh={() => refetch()}
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
      <div className="flex flex-row min-h-full h-auto mt-2">
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
        <SlidingSideBar hideToggle={true}>
          <div>
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
            <Changelog />
          </div>
        </SlidingSideBar>
      </div>
    </SearchLayout>
  );
}
