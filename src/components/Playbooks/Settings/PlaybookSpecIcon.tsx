import { PlaybookSpec } from "../../../api/types/playbooks";
import { Icon } from "../../../ui/Icons/Icon";

type PlaybookIconProps = {
  playbook: Pick<PlaybookSpec, "spec" | "name">;
  showLabel?: boolean;
};

export default function PlaybookSpecIcon({
  playbook,
  showLabel = false
}: PlaybookIconProps) {
  const { name, spec } = playbook;

  return (
    <div className="flex flex-row items-center gap-1">
      <Icon name={spec.icon} className="h-5" />
      {showLabel && <span>{name}</span>}
    </div>
  );
}
