import { Tag } from "@flanksource-ui/ui/Tags/Tag";
import { PlaybookSpec } from "../../../api/types/playbooks";
import { Icon } from "../../../ui/Icons/Icon";

type PlaybookIconProps = {
  playbook: Pick<PlaybookSpec, "spec" | "name" | "category">;
  showLabel?: boolean;
  showTag?: boolean;
};

export default function PlaybookSpecIcon({
  playbook,
  showLabel = false,
  showTag = false
}: PlaybookIconProps) {
  const { name, spec } = playbook;

  return (
    <div className="flex min-w-min flex-row items-center gap-1">
      <Icon name={spec.icon} className="h-5" />
      {showLabel && <span>{name}</span>}
      {showTag && playbook.spec.category && (
        <Tag title={playbook.spec.category}>{playbook.spec.category}</Tag>
      )}
    </div>
  );
}
