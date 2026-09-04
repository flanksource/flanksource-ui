import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { groupBucketByType } from "./Utils";

export function ChangeIconWithBadge({
  group
}: {
  group: ReturnType<typeof groupBucketByType>[number];
}) {
  const hasBadge = group.count > 1;
  return (
    <span
      className={`relative inline-flex items-center ${hasBadge ? "mr-1" : ""}`}
    >
      <ChangeIcon change={group.representative} className="h-5 w-5" />
      {hasBadge && (
        <span className="absolute -right-1 -top-0.5 flex h-3 min-w-3 items-center justify-center rounded-full bg-zinc-400 px-0.5 text-[7px] font-light leading-none text-white">
          {group.count}
        </span>
      )}
    </span>
  );
}
