import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../../api/query-hooks";
import { isCostsEmpty } from "../../../api/types/configs";
import { Age } from "../../../ui/Age";
import TextSkeletonLoader from "../../../ui/SkeletonLoader/TextSkeletonLoader";
import { InfoMessage } from "../../InfoMessage";
import { Status } from "../../Status";
import DisplayDetailsRow from "../../Utils/DisplayDetailsRow";
import { DisplayGroupedProperties } from "../../Utils/DisplayGroupedProperties";
import ConfigCostValue from "../ConfigCosts/ConfigCostValue";
import ConfigsTypeIcon from "../ConfigsTypeIcon";
import { formatConfigTags } from "./Utils/formatConfigTags";

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
    return formatConfigTags(configDetails);
  }, [configDetails]);

  var types = [];
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
          {configDetails.status && (
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
                value: <Age from={configDetails.updated_at} suffix={true} />
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
