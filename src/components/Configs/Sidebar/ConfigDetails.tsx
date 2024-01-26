import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../../api/query-hooks";
import { isCostsEmpty } from "../../../api/types/configs";
import { Age } from "../../../ui/Age";
import { InfoMessage } from "../../InfoMessage";
import TextSkeletonLoader from "../../SkeletonLoader/TextSkeletonLoader";
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

  const namespace = configDetails?.tags?.["namespace"];
  return (
    <div className="flex flex-col space-y-2 py-2 max-w-full">
      {isLoading ? (
        <TextSkeletonLoader />
      ) : configDetails && !error ? (
        <>
          <DisplayDetailsRow
            items={[
              {
                label: "Name",
                value: (
                  <ConfigsTypeIcon config={configDetails}>
                    {configDetails.name}
                  </ConfigsTypeIcon>
                )
              }
            ]}
          />
          {namespace && (
            <DisplayDetailsRow
              items={[
                {
                  label: "Namespace",
                  value: (
                    <Link
                      className="link"
                      to={`/catalog?tag=namespace__%3A__${namespace}`}
                    >
                      {namespace}
                    </Link>
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
              },
              {
                label: "Updated",
                value: <Age from={configDetails.updated_at} />
              },
              ...(configDetails.deleted_at
                ? [
                    {
                      label: "Deleted",
                      value: <Age from={configDetails.deleted_at} />
                    }
                  ]
                : [])
            ]}
          />

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
