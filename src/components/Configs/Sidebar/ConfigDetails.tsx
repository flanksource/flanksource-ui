import {
  useGetConfigByIdQuery,
  useGetParentsByLocationQuery
} from "@flanksource-ui/api/query-hooks";
import { isCostsEmpty } from "@flanksource-ui/api/types/configs";
import { formatProperties } from "@flanksource-ui/components/Topology/Sidebar/Utils/formatProperties";
import { Age } from "@flanksource-ui/ui/Age";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "@flanksource-ui/ui/SlidingSideBar/SlidingSideBar";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useMemo, useEffect } from "react";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { InfoMessage } from "../../InfoMessage";
import { Status } from "../../Status";
import DisplayDetailsRow from "../../Utils/DisplayDetailsRow";
import { DisplayGroupedProperties } from "../../Utils/DisplayGroupedProperties";
import ConfigCostValue from "../ConfigCosts/ConfigCostValue";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import { formatConfigLabels } from "./Utils/formatConfigLabels";
import { MdOutlineSupportAgent } from "react-icons/md";

type Props = {
  configId: string;
};

export function ConfigDetails({ configId }: Props) {
  const {
    data: configDetails,
    isLoading,
    error,
    refetch: refetchConfig,
    isFetching: isFetchingConfig
  } = useGetConfigByIdQuery(configId);

  const {
    data: parents,
    isLoading: isLoadingParents,
    refetch: refetchParents,
    isFetching: isFetchingParents
  } = useGetParentsByLocationQuery(configId);

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isFetchingConfig) {
      refetchConfig();
    }
    if (!isLoadingParents && !isFetchingParents) {
      refetchParents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  const displayDetails = useMemo(() => {
    return formatConfigLabels(configDetails);
  }, [configDetails]);

  const types = useMemo(() => {
    const types = [];
    if (!isLoading && configDetails != null) {
      types.push({
        label: "Type",
        value: (
          <Link
            to={{
              pathname: "/catalog",
              search: `type=${configDetails.type}`
            }}
          >
            <ConfigsTypeIcon
              config={configDetails}
              showLabel
              showPrimaryIcon
              showSecondaryIcon
            />
          </Link>
        )
      });

      if (!configDetails.type?.endsWith(configDetails.config_class || "")) {
        types.push({
          label: "Class",
          value: configDetails?.config_class
        });
      }
    }
    return types;
  }, [isLoading, configDetails]);

  const properties = useMemo(
    () => formatProperties(configDetails),
    [configDetails]
  );

  const isLastScrappedMoreThan1Hour = useMemo(() => {
    if (!configDetails?.last_scraped_time) {
      return false;
    }
    // if last scraped time is more than an hour ago, show stale icon
    if (dayjs().diff(dayjs(configDetails.last_scraped_time), "hour") >= 1) {
      return true;
    }
    return false;
  }, [configDetails?.last_scraped_time]);

  return (
    <div className="flex max-w-full flex-1 flex-col space-y-2 overflow-y-auto py-2">
      {isLoading ? (
        <TextSkeletonLoader />
      ) : configDetails && !error ? (
        <>
          <DisplayDetailsRow
            items={[
              {
                label: "Name",
                value: configDetails.name
              }
            ]}
          />
          {configDetails.tags && (
            <DisplayDetailsRow
              items={[
                {
                  label: "Tags",
                  value: (
                    <div className="flex flex-wrap gap-2 py-1">
                      {Object.values(configDetails.tags).map((tag) => (
                        <div
                          className="flex break-inside-avoid-column flex-row whitespace-nowrap rounded-md bg-gray-200 p-[0.25rem] text-xs font-semibold text-gray-600"
                          key={tag}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )
                }
              ]}
            />
          )}
          {configDetails.deleted_at && (
            <DisplayDetailsRow
              items={[
                {
                  label: "Status",
                  value: (
                    <div className="flex items-center gap-1">
                      <FaTrash className="inline text-red-500" />
                      <span>Deleted</span>
                      <Age from={configDetails.deleted_at} suffix={true} />
                    </div>
                  )
                }
              ]}
            />
          )}
          {configDetails.health && (
            <DisplayDetailsRow
              items={[
                {
                  label: configDetails.deleted_at ? "Last status" : "Status",
                  value: (
                    <>
                      <Status
                        status={configDetails.health}
                        statusText={configDetails.status}
                      />
                      {configDetails.description ? (
                        <div className="ml-1 text-sm text-gray-600">
                          {configDetails.description}
                        </div>
                      ) : null}
                    </>
                  )
                }
              ]}
            />
          )}
          <DisplayDetailsRow
            items={[
              {
                label: "Created",
                value: (
                  <>
                    <Age from={configDetails.created_at} suffix={true} />
                    {configDetails.scraper && (
                      <>
                        {" "}
                        by{" "}
                        <Link
                          to={{
                            pathname: `/catalog/scrapers/${configDetails.scraper.id}`
                          }}
                          className="link relative overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                          {configDetails.scraper.name}
                        </Link>
                      </>
                    )}
                  </>
                )
              }
            ]}
          />
          <DisplayDetailsRow
            items={[
              {
                label: "Updated",
                value: (
                  <>
                    <Age from={configDetails.updated_at} suffix={true} />
                    {isLastScrappedMoreThan1Hour &&
                      !configDetails.deleted_at && (
                        <span className="mx-2 items-center space-x-1">
                          (Last scraped{" "}
                          <Age
                            from={configDetails.last_scraped_time}
                            suffix={true}
                          />
                          <FaExclamationTriangle className="inline text-yellow-600" />
                          )
                        </span>
                      )}
                  </>
                )
              }
            ]}
          />

          <DisplayDetailsRow
            items={[
              {
                label: "Agent",
                value: (
                  <div className="flex items-center">
                    <Link
                      to={`/settings/agents?id=${configDetails.agent_id}`}
                      className="flex items-center text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MdOutlineSupportAgent className="mr-1 text-gray-600" />
                      {configDetails.agent_name}
                    </Link>
                  </div>
                )
              }
            ]}
          />

          <DisplayDetailsRow items={types} />

          {parents && parents.length > 0 && (
            <DisplayDetailsRow
              items={[
                {
                  label: "Parents",
                  value: (
                    <div className="flex flex-col gap-1">
                      {isLoadingParents ? (
                        <TextSkeletonLoader />
                      ) : (
                        parents.map((child) => (
                          <Link
                            key={child.id}
                            to={{
                              pathname: `/catalog/${child.id}`
                            }}
                            className="flex text-sm text-blue-500 hover:underline"
                          >
                            <ConfigsTypeIcon
                              config={{ type: child.type }}
                              showLabel={false}
                              showPrimaryIcon
                              showSecondaryIcon={true}
                            >
                              {child.name}
                            </ConfigsTypeIcon>
                          </Link>
                        ))
                      )}
                    </div>
                  )
                }
              ]}
            />
          )}

          <DisplayGroupedProperties items={properties} />

          {!isCostsEmpty(configDetails) && (
            <DisplayDetailsRow
              items={[
                {
                  label: "Cost",
                  value: <ConfigCostValue config={configDetails} />
                }
              ]}
            />
          )}
          <DisplayGroupedProperties items={displayDetails} />
        </>
      ) : (
        <InfoMessage message="Details not found" />
      )}
    </div>
  );
}
