import { useGetConfigByIdQuery } from "@flanksource-ui/api/query-hooks";
import { isCostsEmpty } from "@flanksource-ui/api/types/configs";
import { formatProperties } from "@flanksource-ui/components/Topology/Sidebar/Utils/formatProperties";
import { Age } from "@flanksource-ui/ui/Age";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import dayjs from "dayjs";
import { useMemo } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { InfoMessage } from "../../InfoMessage";
import { Status } from "../../Status";
import DisplayDetailsRow from "../../Utils/DisplayDetailsRow";
import { DisplayGroupedProperties } from "../../Utils/DisplayGroupedProperties";
import ConfigCostValue from "../ConfigCosts/ConfigCostValue";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import { formatConfigLabels } from "./Utils/formatConfigLabels";

type Props = {
  configId: string;
};

export function ConfigDetails({ configId }: Props) {
  const {
    data: configDetails,
    isLoading,
    error
  } = useGetConfigByIdQuery(configId);

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
    <div className="flex flex-col space-y-2 py-2 max-w-full overflow-y-auto flex-1">
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
                          className="flex flex-row p-[0.25rem] rounded-md bg-gray-200 text-gray-600 font-semibold text-xs whitespace-nowrap break-inside-avoid-column"
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
          {configDetails.health && (
            <DisplayDetailsRow
              items={[
                {
                  label: "Status",
                  value: (
                    <>
                      <Status
                        status={configDetails.health}
                        statusText={configDetails.status}
                      />
                      {configDetails.description ? (
                        <div className="ml-1 text-gray-600 text-sm">
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
                    {configDetails.config_scrapers && (
                      <>
                        {" "}
                        by{" "}
                        <Link
                          to={{
                            pathname: `/settings/config_scrapers/${configDetails.config_scrapers.id}`
                          }}
                          className="link whitespace-nowrap  text-ellipsis overflow-hidden relative"
                        >
                          {configDetails.config_scrapers.name}
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
                        <span className="mx-2 space-x-1 items-center">
                          (Last scraped{" "}
                          <Age
                            from={configDetails.last_scraped_time}
                            suffix={true}
                          />
                          <FaExclamationTriangle className="text-yellow-600 inline" />
                          )
                        </span>
                      )}
                  </>
                )
              },
              ...(configDetails.deleted_at
                ? [
                    {
                      label: "Deleted",
                      value: (
                        <Age from={configDetails.deleted_at} suffix={true} />
                      )
                    }
                  ]
                : [])
            ]}
          />

          <DisplayDetailsRow items={types} />

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
