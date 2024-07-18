import { getComponentChecks } from "@flanksource-ui/api/services/topology";
import PillBadge from "@flanksource-ui/ui/Badge/PillBadge";
import CollapsiblePanel from "@flanksource-ui/ui/CollapsiblePanel/CollapsiblePanel";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { AiFillHeart } from "react-icons/ai";
import TextSkeletonLoader from "../../../ui/SkeletonLoader/TextSkeletonLoader";
import { refreshButtonClickedTrigger } from "../../../ui/SlidingSideBar/SlidingSideBar";
import { CheckLink } from "../../Canary/HealthChecks/CheckLink";
import EmptyState from "../../EmptyState";
import Title from "../../Title/title";

type Props = {
  componentId: string;
  isCollapsed?: boolean;
  onCollapsedStateChange?: (isClosed: boolean) => void;
};

export function ComponentChecks({
  componentId,
  isCollapsed,
  onCollapsedStateChange
}: Props) {
  const {
    data: componentChecks,
    isLoading,
    refetch,
    isFetching
  } = useQuery(
    ["component", "checks", componentId],
    () => getComponentChecks(componentId),
    {
      enabled: !!componentId
    }
  );

  const [triggerRefresh] = useAtom(refreshButtonClickedTrigger);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefresh]);

  return (
    <CollapsiblePanel
      isCollapsed={isCollapsed}
      onCollapsedStateChange={onCollapsedStateChange}
      Header={
        <div className="flex w-full flex-row items-center space-x-2">
          <Title title="Checks" icon={<AiFillHeart className="h-auto w-6" />} />
          <PillBadge>{componentChecks?.length ?? 0}</PillBadge>
        </div>
      }
      dataCount={componentChecks?.length}
    >
      <div className="flex w-full flex-col gap-4">
        {isLoading ? (
          <TextSkeletonLoader />
        ) : componentChecks && componentChecks.length > 0 ? (
          componentChecks.map((componentCheck) => (
            <CheckLink key={componentCheck.id} check={componentCheck} />
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </CollapsiblePanel>
  );
}
