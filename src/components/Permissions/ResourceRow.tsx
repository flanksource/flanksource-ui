import TriStateAccessSwitch from "@flanksource-ui/components/Permissions/TriStateAccessSwitch";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { motion } from "motion/react";
import { ReactNode } from "react";
import type {
  McpSubjectResource,
  ResourceAccess
} from "./ResourceSelectorPanel";

const ROW_LAYOUT_TRANSITION = {
  type: "spring",
  stiffness: 620,
  damping: 42,
  mass: 0.7
} as const;

type ResourceRowProps = {
  resource: McpSubjectResource;
  access: ResourceAccess;
  defaultIcon: string;
  effectiveBadge: ReactNode;
  isListLocked: boolean;
  isSubmitting: boolean;
  isMutating: boolean;
  onSetResourceAccess: (
    resource: McpSubjectResource,
    access: ResourceAccess
  ) => Promise<void> | void;
};

export default function ResourceRow({
  resource,
  access,
  defaultIcon,
  effectiveBadge,
  isListLocked,
  isSubmitting,
  isMutating,
  onSetResourceAccess
}: ResourceRowProps) {
  return (
    <motion.div
      layout="position"
      initial={false}
      transition={ROW_LAYOUT_TRANSITION}
      key={resource.id}
      className="flex items-center justify-between gap-3 border-b border-gray-200 p-3 last:border-b-0"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Icon
          name={resource.icon || defaultIcon}
          className="h-4 w-4 text-gray-500"
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-gray-900">
            {resource.displayName || resource.name}
          </div>
          {resource.subtitle ? (
            <div className="truncate text-xs text-gray-500">
              {resource.subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {effectiveBadge}
        {!isListLocked ? (
          <TriStateAccessSwitch
            value={access}
            disabled={isMutating || isSubmitting}
            onChange={(nextAccess) => onSetResourceAccess(resource, nextAccess)}
          />
        ) : null}
      </div>
    </motion.div>
  );
}
