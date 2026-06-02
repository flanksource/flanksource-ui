/**
 * Animated expansion panel shown under a selected resource row, exposing the
 * editable direct-access switches for each supported action.
 */
import DirectMatrixCell from "@flanksource-ui/components/Permissions/SubjectPermissions/DirectMatrixCell";
import { AccessValue } from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { motion } from "motion/react";

export type MatrixDrawerRow = {
  key: string;
  action: string;
  access: AccessValue;
  isReadOnly: boolean;
  isWildcard: boolean;
  disabled?: boolean;
  onChange: (next: AccessValue) => void;
};

type MatrixDrawerProps = {
  rows: MatrixDrawerRow[];
};

const DRAWER_OPEN_TRANSITION = {
  duration: 0.18,
  ease: "easeOut"
} as const;

export default function MatrixDrawer({ rows }: MatrixDrawerProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0, y: -4 }}
      animate={{ height: "auto", opacity: 1, y: 0 }}
      transition={DRAWER_OPEN_TRANSITION}
      className="w-full overflow-hidden"
    >
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
    </motion.div>
  );
}
