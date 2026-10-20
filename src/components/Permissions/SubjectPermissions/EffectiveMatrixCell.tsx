/**
 * Displays the evaluated effective-access result for a matrix cell, as a button
 * that opens its explanation when onClick is set.
 */
import EffectiveAccessBadge from "@flanksource-ui/components/Permissions/EffectiveAccessBadge";
import { EffectiveState } from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";

type EffectiveMatrixCellProps = {
  state: EffectiveState;
  notChecked?: boolean;
  label?: string;
  onClick?: () => void;
};

export default function EffectiveMatrixCell({
  state,
  notChecked = false,
  label,
  onClick
}: EffectiveMatrixCellProps) {
  if (notChecked) {
    return <span className="text-xs text-gray-500">Not checked</span>;
  }

  const badge = (
    <EffectiveAccessBadge
      state={state}
      unknownReason="Failed to evaluate effective access. Showing unknown state."
    />
  );

  if (!onClick) {
    return (
      <div className="flex items-center justify-center gap-2">{badge}</div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        className="rounded-full p-0.5 ring-offset-1 transition hover:ring-2 hover:ring-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {badge}
      </button>
    </div>
  );
}
