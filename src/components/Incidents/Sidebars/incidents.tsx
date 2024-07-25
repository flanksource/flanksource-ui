import { getIncidentsBy } from "@flanksource-ui/api/services/incident";
import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import { features } from "@flanksource-ui/services/permissions/features";
import { Age } from "@flanksource-ui/ui/Age";
import PillBadge from "@flanksource-ui/ui/Badge/PillBadge";
import CollapsiblePanel from "@flanksource-ui/ui/CollapsiblePanel/CollapsiblePanel";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { ImLifebuoy } from "react-icons/im";
import { Link } from "react-router-dom";
import { DetailsTable } from "../../../ui/DetailsTable/DetailsTable";
import Title from "../../Title/title";
import { IncidentStatusTag } from "../IncidentStatusTag";
import IncidentsFilterBar, { IncidentFilter } from "../IncidentsFilterBar";
import { typeItems } from "../data";
import { IncidentTypeIcon } from "../incidentTypeTag";

type Props = {
  topologyId?: string;
  configId?: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

const columns = [
  {
    key: "incident",
    label: "Incident"
  },
  {
    key: "age",
    label: "Age"
  }
];

export default function Incidents({
  topologyId,
  configId,
  isCollapsed = true,
  onCollapsedStateChange = () => {}
}: Props) {
  const [filterIncidentOptions, setFilterIncidentOptions] =
    useState<IncidentFilter>({
      type: "all",
      status: "open",
      age: 0
    });

  const { isFeatureDisabled } = useFeatureFlagsContext();

  const isIncidentManagementFeatureDisabled = useMemo(
    () => isFeatureDisabled(features.incidents),
    [isFeatureDisabled]
  );

  const { isLoading, data, isRefetching, refetch } = useQuery(
    [
      "incidents",
      ...(topologyId ? ["topology-", topologyId] : []),
      ...(configId ? ["configs", configId] : []),
      filterIncidentOptions.status,
      filterIncidentOptions.type
    ],
    async () => {
      const res = await getIncidentsBy({
        topologyId: topologyId,
        configId: configId,
        type: filterIncidentOptions.type,
        status: filterIncidentOptions.status
      });
      return res.data ?? [];
    },
    {
      enabled: !!topologyId || !!configId
    }
  );

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isRefetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  const incidents = useMemo(() => {
    return data?.map((item) => {
      return {
        incident: (
          <div className="flex flex-row">
            <IncidentTypeIcon type={item.type as keyof typeof typeItems} />
            <Link
              className="mx-1 block cursor-pointer text-sm"
              to={{
                pathname: `/incidents/${item.id}`
              }}
            >
              {item.title}
            </Link>
            <IncidentStatusTag status={item.status!} className="ml-1 text-sm" />
          </div>
        ),
        age: <Age from={item.created_at} />
      };
    });
  }, [data]);

  if (isIncidentManagementFeatureDisabled) {
    return null;
  }

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex flex-row items-center justify-center space-x-2">
          <Title
            title="Incidents"
            icon={<ImLifebuoy className="h-auto w-6" />}
          />
          <PillBadge>{incidents?.length ?? 0}</PillBadge>
        </div>
      }
      dataCount={incidents?.length}
      childrenClassName=""
    >
      <div className="flex flex-col">
        <div className="relative flex flex-col items-start">
          <IncidentsFilterBar
            defaultValues={filterIncidentOptions}
            onChangeFilterValues={(value) => setFilterIncidentOptions(value)}
          />
        </div>
        <div className="flex max-h-full flex-col space-y-1 overflow-y-auto">
          <DetailsTable
            loading={isLoading}
            data={incidents || []}
            columns={columns}
            showHeader={false}
          />
        </div>
      </div>
    </CollapsiblePanel>
  );
}
