import { useMemo } from "react";
import { FaTags } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../../api/query-hooks";
import CollapsiblePanel from "../../CollapsiblePanel";
import { InfoMessage } from "../../InfoMessage";
import TextSkeletonLoader from "../../SkeletonLoader/TextSkeletonLoader";
import Title from "../../Title/title";
import DisplayDetailsRow from "../../Utils/DisplayDetailsRow";
import { Age } from "../../../ui/Age";
import ConfigCostValue from "../../ConfigCosts/ConfigCostValue";
import { isCostsEmpty } from "../../../api/types/configs";

type Props = {
  configId: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function ConfigDetails({
  configId,
  isCollapsed = true,
  onCollapsedStateChange = () => {}
}: Props) {
  const {
    data: configDetails,
    isLoading,
    error
  } = useGetConfigByIdQuery(configId);

  const displayDetails = useMemo(() => {
    if (configDetails) {
      if (!configDetails.tags) {
        return undefined;
      }

      const groupedTags = new Map<string, Record<string, any>[]>();

      Object.entries(configDetails.tags)
        .filter(([key]) => key.toLowerCase() !== "name")
        .forEach(([key, value]) => {
          // if we can't split key by slash, then we don't need to group the tags
          if (key.split("/").length === 1) {
            groupedTags.set(key, [
              {
                key: value
              }
            ]);
            return;
          }
          const groupKey = key.split("/")[0];
          const existingValues = groupedTags.get(groupKey) ?? [];
          groupedTags.set(groupKey, [
            ...existingValues,
            {
              [key.split("/").slice(1).join("/")]: value
            }
          ]);
        });

      return groupedTags;
    }
  }, [configDetails]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex py-2 flex-row flex-1 items-center space-x-2">
          <Title title="Tags" icon={<FaTags className="w-6 h-auto" />} />
        </div>
      }
    >
      <div className="flex flex-col space-y-2 py-2 max-w-full">
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
            {configDetails.type && (
              <DisplayDetailsRow
                items={[
                  {
                    label: "Type",
                    value: configDetails.type
                  }
                ]}
              />
            )}
            <DisplayDetailsRow
              items={[
                {
                  label: "Created At",
                  value: <Age from={configDetails.created_at} />
                },
                {
                  label: "Updated At",
                  value: <Age from={configDetails.updated_at} />
                }
              ]}
            />

            {configDetails.config_scrapers && (
              <DisplayDetailsRow
                items={[
                  {
                    label: "Scraper",
                    value: (
                      <Link
                        to={`/settings/config_scrapers/${configDetails.config_scrapers.id}`}
                      >
                        {configDetails.config_scrapers.name}
                      </Link>
                    )
                  }
                ]}
              />
            )}

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

            {displayDetails &&
              Object.entries(Object.fromEntries(displayDetails.entries())).map(
                ([key, values]) => {
                  if (values.length === 1) {
                    return (
                      <DisplayDetailsRow
                        key={key}
                        items={[
                          {
                            label: key,
                            value: Object.values(values[0])[0]
                          }
                        ]}
                      />
                    );
                  }
                  return (
                    <div key={key} className="flex flex-col gap-2">
                      <label className="text-sm font-medium capitalize">
                        {key}
                      </label>
                      <div className="flex flex-col gap-2 px-2">
                        {values.map((k) =>
                          Object.entries(k).map(([key, value]) => (
                            <DisplayDetailsRow
                              key={key}
                              items={[
                                {
                                  label: key,
                                  value: value
                                }
                              ]}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                }
              )}

            {configDetails.deleted_at && (
              <DisplayDetailsRow
                items={[
                  {
                    label: "Deleted At",
                    value: <Age from={configDetails.deleted_at} />
                  }
                ]}
              />
            )}
          </>
        ) : (
          <InfoMessage message="Details not found" />
        )}
      </div>
    </CollapsiblePanel>
  );
}
