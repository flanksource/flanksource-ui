import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";

type GlobalOverride = "allow" | "none" | "deny";

type Entity = {
  id: string;
  name: string;
  namespace?: string;
  icon?: string;
};

type PermissionAccessCardProps = {
  entity: Entity;
  globalOverride?: GlobalOverride;
  onGlobalOverrideChange: (value: GlobalOverride) => void;
  onViewSubjects?: () => void;
  isMutating?: boolean;
};

const SWITCH_OPTIONS = ["Deny all", "Custom", "Allow all"];
type SwitchOption = "Deny all" | "Custom" | "Allow all";

function toSwitchOption(value: GlobalOverride): SwitchOption {
  switch (value) {
    case "deny":
      return "Deny all";
    case "allow":
      return "Allow all";
    default:
      return "Custom";
  }
}

function toGlobalOverride(value: string): GlobalOverride {
  switch (value) {
    case "Deny all":
      return "deny";
    case "Allow all":
      return "allow";
    default:
      return "none";
  }
}

export default function ResourceAccessCard({
  entity,
  globalOverride = "none",
  onGlobalOverrideChange,
  onViewSubjects,
  isMutating = false
}: PermissionAccessCardProps) {
  const canOpenSubjects = globalOverride === "none" && Boolean(onViewSubjects);

  const handleCardClick = () => {
    if (!canOpenSubjects) {
      return;
    }

    onViewSubjects?.();
  };

  return (
    <div
      className={`w-full max-w-3xl ${canOpenSubjects ? "cursor-pointer" : ""}`}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
          <Icon name={entity.icon ?? "playbook"} className="h-4 w-4" />
        </div>

        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className="truncate text-sm font-semibold text-gray-900"
              title={entity.name}
            >
              {entity.name}
            </div>
            {entity.namespace && (
              <div
                className="mt-0.5 truncate text-xs text-gray-500"
                title={entity.namespace}
              >
                {entity.namespace}
              </div>
            )}
          </div>

          <div
            className="shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className={
                isMutating ? "pointer-events-none opacity-60" : undefined
              }
              aria-disabled={isMutating || undefined}
            >
              <Switch
                size="sm"
                options={SWITCH_OPTIONS}
                value={toSwitchOption(globalOverride)}
                onChange={(value) =>
                  onGlobalOverrideChange(toGlobalOverride(value))
                }
                className="h-auto"
                itemsClassName=""
                getActiveItemClassName={(option) => {
                  if (option === "Allow all") {
                    return "bg-blue-50 text-blue-700 ring-blue-200";
                  }

                  if (option === "Deny all") {
                    return "bg-red-50 text-red-700 ring-red-200";
                  }

                  return undefined;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
