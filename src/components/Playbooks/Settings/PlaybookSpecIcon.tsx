import { PlaybookSpec } from "@flanksource-ui/api/types/playbooks";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Tag } from "@flanksource-ui/ui/Tags/Tag";

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
      <Icon name={spec?.icon} className="h-auto w-5" />
      {/* fallback to name, when title not there */}
      {showLabel && <span>{title ?? name}</span>}
      {showTag && playbook.spec?.category && (
        <Tag title={playbook.spec.category}>{playbook.spec.category}</Tag>
      )}
    </div>
  );
}
