import EffectiveAccessBadge from "@flanksource-ui/components/Permissions/EffectiveAccessBadge";
import { EffectiveState } from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";

type EffectiveMatrixCellProps = {
  state: EffectiveState;
  notChecked?: boolean;
};

export default function EffectiveMatrixCell({
  state,
  notChecked = false
}: EffectiveMatrixCellProps) {
  if (notChecked) {
    return <span className="text-xs text-gray-500">Not checked</span>;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <EffectiveAccessBadge
        state={state}
        unknownReason="Failed to evaluate effective access. Showing unknown state."
      />
    </div>
  );
}
