import { getTopology } from "@flanksource-ui/api/services/topology";
import { Topology } from "@flanksource-ui/api/types/topology";
import { InfoMessage } from "@flanksource-ui/components/InfoMessage";
import { toastError } from "@flanksource-ui/components/Toast/toast";
import TopologySidebar from "@flanksource-ui/components/Topology/Sidebar/TopologySidebar";
import { TopologyBreadcrumbs } from "@flanksource-ui/components/Topology/TopologyBreadcrumbs";
import { TopologyCard } from "@flanksource-ui/components/Topology/TopologyCard";
import TopologyFilterBar from "@flanksource-ui/components/Topology/TopologyPage/TopologyFilterBar";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import CardsSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/CardsSkeletonLoader";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import {
  getSortLabels,
  getSortedTopology
} from "../components/Topology/TopologyPopover/topologySort";
import { cardPreferenceAtom } from "@flanksource-ui/store/preference.state";

export const allOption = {
  All: {
    id: "All",
    name: "All",
    description: "All",
    value: "All"
  }
};

export const saveSortBy = (val: string, sortLabels: any[]) => {
  const sortItem = sortLabels.find((s) => s.value === val);
  if (sortItem?.standard) {
    localStorage.setItem(`topologyCardsSortByStandard`, val);
    localStorage.removeItem(`topologyCardsSortByCustom`);
  } else {
    localStorage.setItem(`topologyCardsSortByCustom`, val);
  }
};

export const saveSortOrder = (val: string) => {
  localStorage.setItem(`topologyCardsSortOrder`, val);
};

export const getSortBy = (sortLabels: any[]) => {
  const val = localStorage.getItem("topologyCardsSortByCustom");
  const sortItem = sortLabels.find((s) => s.value === val);
  if (!sortItem) {
    localStorage.removeItem(`topologyCardsSortByCustom`);
    return localStorage.getItem(`topologyCardsSortByStandard`) || "status";
  }
  return (
    localStorage.getItem("topologyCardsSortByCustom") ||
    localStorage.getItem("topologyCardsSortByStandard") ||
    "status"
  );
};

export const getSortOrder = () => {
  return localStorage.getItem(`topologyCardsSortOrder`) || "asc";
};

export function TopologyPage() {
  const { id } = useParams();

  const [, setTriggerRefresh] = useAtom(refreshButtonClickedTrigger);

  const [searchParams, setSearchParams] = useSearchParams({
    sortBy: "status",
    sortOrder: "desc"
  });

  const [topologyCardSize] = useAtom(cardPreferenceAtom);

  const selectedLabel = searchParams.get("labels") ?? "All";
  const team = searchParams.get("team") ?? "All";
  const topologyType = searchParams.get("type") ?? "All";
  const healthStatus = searchParams.get("status") ?? "All";
  const refererId = searchParams.get("refererId") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "status";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const agentId = searchParams.get("agent_id") ?? undefined;
  const showHiddenComponents =
    searchParams.get("showHiddenComponents") ?? undefined;

  const loadingBarRef = useRef<LoadingBarRef>(null);

  const { data, isLoading, refetch } = useQuery(
    [
      "topologies",
      id,
      healthStatus,
      team,
      selectedLabel,
      topologyType,
      showHiddenComponents,
      sortBy,
      sortOrder,
      agentId
    ],
    () => {
      loadingBarRef.current?.continuousStart();
      const apiParams = {
        id,
        status: healthStatus,
        type: topologyType,
        team: team,
        labels: selectedLabel,
        sortBy,
        sortOrder,
        // only flatten, if topology type is set
        ...(topologyType &&
          topologyType.toString().toLowerCase() !== "all" && {
            flatten: true
          }),
        hidden: showHiddenComponents === "no" ? false : undefined,
        agent_id: agentId
      };
      return getTopology(apiParams);
    },
    {
      onSettled: () => {
        loadingBarRef.current?.complete();
      }
    }
  );

  const currentTopology = useMemo(() => data?.components?.[0], [data]);

  const topology = useMemo(() => {
    let topologyData: Topology[] | undefined;

    if (id) {
      const x = Array.isArray(data?.components) ? data?.components : [];

      if (x!.length > 1) {
        console.warn("Multiple nodes for same id?");
        toastError("Response has multiple components for the id.");
      }

      topologyData = x![0]?.components;

      if (!topologyData) {
        console.warn("Component doesn't have any child components.");
        topologyData = data?.components;
      }
    } else {
      topologyData = data?.components ?? [];
    }

    let components = topologyData?.filter(
      (item) => (item.name || item.title) && item.id !== id
    );

    if (!components?.length && topologyData?.length) {
      let filtered = topologyData?.find(
        (x: Record<string, any>) => x.id === id
      );
      if (filtered) {
        components = [filtered];
      } else {
        components = [];
      }
    }
    return components;
  }, [data?.components, id]);

  const sortLabels = useMemo(() => {
    if (!topology) {
      return null;
    }
    return getSortLabels(topology);
  }, [topology]);

  const onRefresh = useCallback(() => {
    refetch();
    setTriggerRefresh((prev) => prev + 1);
  }, [refetch, setTriggerRefresh]);

  useEffect(() => {
    if (!sortLabels) {
      return;
    }

    const sortByFromURL = searchParams.get("sortBy");
    const sortOrderFromURL = searchParams.get("sortOrder");

    const sortByFromLocalStorage = getSortBy(sortLabels) || "status";
    const sortOrderFromLocalStorage =
      localStorage.getItem("topologyCardsSortOrder") || "desc";

    if (!sortByFromURL && !sortOrderFromURL) {
      searchParams.set("sortBy", sortByFromLocalStorage);
      searchParams.set("sortOrder", sortOrderFromLocalStorage);
    }

    // this will replace the history, so that the back button will work as expected
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, sortLabels]);

  const sortedTopologies = useMemo(
    () =>
      getSortedTopology(topology, getSortBy(sortLabels || []), getSortOrder()),
    [sortLabels, topology]
  );

  return (
    <>
      <LoadingBar color="#374151" height={4} ref={loadingBarRef} />
      <Head prefix="Topology" />
      <SearchLayout
        title={<TopologyBreadcrumbs topologyId={id} refererId={refererId} />}
        onRefresh={onRefresh}
        contentClass="p-0 h-full"
        loading={isLoading}
      >
        <div className="flex h-full flex-row overflow-y-auto py-2">
          <div className="flex h-full flex-1 flex-col overflow-y-auto">
            <TopologyFilterBar data={data} sortLabels={sortLabels ?? []} />
            {isLoading && !topology?.length ? (
              <CardsSkeletonLoader />
            ) : (
              <div className="flex w-full px-6 py-4 leading-1.21rel">
                <div className="flex w-full flex-wrap">
                  {sortedTopologies.map((item) => (
                    <TopologyCard
                      key={item.id}
                      topology={item}
                      size={topologyCardSize}
                      menuPosition="absolute"
                    />
                  ))}
                  {!topology?.length && !isLoading && (
                    <InfoMessage
                      className="my-8"
                      message="There are no components matching this criteria"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {id && (
            <TopologySidebar
              topology={currentTopology}
              refererId={refererId}
              onRefresh={refetch}
            />
          )}
        </div>
      </SearchLayout>
    </>
  );
}
