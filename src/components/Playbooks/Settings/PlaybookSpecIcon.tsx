import { getPlaybookSpec } from "@flanksource-ui/api/services/playbooks";
import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import TextSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/TextSkeletonLoader";
import { Tag } from "@flanksource-ui/ui/Tags/Tag";
import { useQuery } from "@tanstack/react-query";

type PlaybookIconProps = {
  playbook: Pick<PlaybookSpec, "spec" | "name" | "category" | "title">;
  showLabel?: boolean;
  showTag?: boolean;
};

export default function PlaybookSpecIcon({
  playbook,
  showLabel = false,
  showTag = false
}: PlaybookIconProps) {
  const { title, name, spec } = playbook;

  return (
    <div className="flex min-w-min flex-row items-center gap-1">
      <Icon name={spec?.icon} className="h-5" />
      {/* fallback to name, when title not there */}
      {showLabel && <span>{title ?? name}</span>}
      {showTag && playbook.spec?.category && (
        <Tag title={playbook.spec.category}>{playbook.spec.category}</Tag>
      )}
    </div>
  );
}

export function PlaybookSpecLabel({ playbookId }: { playbookId: string }) {
  const { data: playbook, isLoading } = useQuery({
    queryKey: ["playbook", playbookId],
    queryFn: () => getPlaybookSpec(playbookId),
    enabled: !!playbookId
  });

  if (isLoading) {
    // show skeleton
    return <TextSkeletonLoader />;
  }

  return <PlaybookSpecIcon playbook={playbook!} showLabel />;
}
