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
    <div className="flex flex-row gap-2 items-center whitespace-nowrap overflow-ellipsis">
      <Icon name={playbookSpec.spec.icon} />
      <span>{playbookSpec.name}</span>
    </div>
  );
}
