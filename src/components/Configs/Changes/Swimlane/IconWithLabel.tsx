import { ConfigChange } from "@flanksource-ui/api/types/configs";
import {
  HoverCard,
  HoverCardTrigger
} from "@flanksource-ui/components/ui/hover-card";
import { PortaledHoverCardContent as HoverCardContent } from "@flanksource-ui/components/ui/portaled-hover-card";
import { GroupedSwimlaneTooltip, SwimlaneTooltip } from "./Tooltip";
import { LabelPlacement, groupBucketByType } from "./Utils";
import { ChangeIconWithBadge } from "./ChangeIconWithBadge";
import { FlexLabel } from "./FlexLabel";

export function IconWithLabel({
  group,
  labelPlacement,
  onItemClicked
}: {
  group: ReturnType<typeof groupBucketByType>[number];
  labelPlacement: LabelPlacement;
  onItemClicked: (change: ConfigChange) => void;
}) {
  const tooltip =
    group.count === 1 ? (
      <SwimlaneTooltip
        change={group.representative}
        onExpand={() => onItemClicked(group.representative)}
      />
    ) : (
      <GroupedSwimlaneTooltip group={group} onExpand={onItemClicked} />
    );

  if (labelPlacement === "extra") {
    return (
      <HoverCard openDelay={200} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            className="inline-flex cursor-pointer items-center"
            onClick={() => onItemClicked(group.representative)}
          >
            <ExtraDot text={group.representative.change_type} />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          align="end"
          collisionPadding={16}
          className="w-fit min-w-56 max-w-lg p-0"
        >
          {tooltip}
        </HoverCardContent>
      </HoverCard>
    );
  }

  const type = group.representative.change_type;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          className="inline-flex cursor-pointer items-center gap-0.5"
          onClick={() => onItemClicked(group.representative)}
        >
          {labelPlacement === "left" && <FlexLabel text={type} />}
          <ChangeIconWithBadge group={group} />
          {labelPlacement === "right" && <FlexLabel text={type} />}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align="end"
        collisionPadding={16}
        className="w-fit min-w-56 max-w-lg p-0"
      >
        {tooltip}
      </HoverCardContent>
    </HoverCard>
  );
}

function ExtraDot({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="h-2 w-2 shrink-0 rounded-full bg-gray-300" />
      <span className="whitespace-nowrap text-xs text-gray-400">{text}</span>
    </span>
  );
}
