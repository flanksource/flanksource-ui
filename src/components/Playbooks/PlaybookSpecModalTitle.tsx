import { PlaybookSpec } from "../../api/types/playbooks";
import { Icon } from "../../ui/Icons/Icon";

type PlaybookSpecModalTitleProps = {
  playbookSpec?: PlaybookSpec;
  defaultTitle?: string;
};

export default function PlaybookSpecModalTitle({
  playbookSpec,
  defaultTitle = "Create Playbook Spec"
}: PlaybookSpecModalTitleProps) {
  if (!playbookSpec) {
    return <span>{defaultTitle}</span>;
  }

  return (
    <div className="flex flex-row items-center gap-2 overflow-ellipsis whitespace-nowrap">
      <Icon name={playbookSpec.spec.icon} />
      <span>{playbookSpec.name}</span>
    </div>
  );
}
