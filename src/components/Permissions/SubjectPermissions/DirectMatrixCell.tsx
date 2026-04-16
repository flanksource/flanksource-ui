import TriStateAccessSwitch from "@flanksource-ui/components/Permissions/TriStateAccessSwitch";
import { AccessValue } from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";

type DirectMatrixCellProps = {
  value: AccessValue;
  disabled?: boolean;
  isReadOnly?: boolean;
  isWildcard?: boolean;
  onChange: (value: AccessValue) => void;
};

export default function DirectMatrixCell({
  value,
  disabled,
  isReadOnly,
  isWildcard,
  onChange
}: DirectMatrixCellProps) {
  return (
    <div className="flex min-h-8 flex-col items-center justify-center gap-1">
      <TriStateAccessSwitch
        value={value}
        disabled={disabled || isReadOnly || isWildcard}
        onChange={onChange}
      />
      {isReadOnly ? (
        <span className="text-[10px] text-amber-700">Managed externally</span>
      ) : isWildcard ? (
        <span className="text-[10px] text-gray-500">Type-wide rule</span>
      ) : null}
    </div>
  );
}
