import { useMemo } from "react";
import { FaTags } from "react-icons/fa";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { relativeDateTime } from "../../utils/date";
import { CountBadge } from "../Badge/CountBadge";
import CollapsiblePanel from "../CollapsiblePanel";
import { DescriptionCard } from "../DescriptionCard";
import { InfoMessage } from "../InfoMessage";
import TextSkeletonLoader from "../SkeletonLoader/TextSkeletonLoader";
import Title from "../Title/title";

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
    if (configDetails) {
      return [
        {
          label: "Name",
          value: configDetails.name
        },
        ...(configDetails.tags
          ? Object.entries(configDetails.tags)
              .filter(([key]) => key !== "Name")
              .map(([key, value]) => ({
                label: key,
                value
              }))
          : []),
        ...(configDetails.created_at
          ? [
              {
                label: "Created At",
                value: relativeDateTime(configDetails.created_at)
              }
            ]
          : []),
        ...(configDetails.updated_at
          ? [
              {
                label: "Updated At",
                value: relativeDateTime(configDetails.updated_at)
              }
            ]
          : []),
        ...(configDetails.deleted_at
          ? [
              {
                label: "Deleted At",
                value: relativeDateTime(configDetails.deleted_at)
              }
            ]
          : [])
      ];
    }
  }, [configDetails]);

  return (
    <CollapsiblePanel
      Header={
        <div className="flex py-2 flex-row flex-1 items-center space-x-2">
          <Title title="Tags" icon={<FaTags className="w-6 h-auto" />} />
          <CountBadge
            roundedClass="rounded-full"
            value={displayDetails?.length ?? 0}
          />
        </div>
      }
    >
      <div className="flex flex-col space-y-2 py-2 max-w-full">
        {isLoading ? (
          <TextSkeletonLoader />
        ) : displayDetails && !error ? (
          <DescriptionCard items={displayDetails} />
        ) : (
          <InfoMessage message="Details not found" />
        )}
      </div>
    </CollapsiblePanel>
  );
}
