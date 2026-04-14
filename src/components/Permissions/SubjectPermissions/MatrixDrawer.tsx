import DirectMatrixCell from "@flanksource-ui/components/Permissions/SubjectPermissions/DirectMatrixCell";

type AccessValue = "allow" | "deny" | "default";
type EffectiveState = "allowed" | "denied" | "unknown";

type MatrixDrawerRow = {
  key: string;
  action: string;
  effectiveState: EffectiveState;
  access: AccessValue;
  source?: string;
  isReadOnly: boolean;
  isWildcard: boolean;
  disabled?: boolean;
  onChange: (next: AccessValue) => void;
};

type MatrixDrawerProps = {
  rows: MatrixDrawerRow[];
};

export default function MatrixDrawer({ rows }: MatrixDrawerProps) {
  return (
    <div className="flex w-full flex-col">
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex w-full items-center justify-between px-8"
        >
          <div className="min-w-0 flex-1 truncate text-sm font-medium text-gray-600">
            {row.action}
          </div>

          <div className="ml-2 flex shrink-0 items-center space-x-2">
            <DirectMatrixCell
              value={row.access}
              isReadOnly={row.isReadOnly}
              isWildcard={row.isWildcard}
              disabled={row.disabled}
              onChange={row.onChange}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
