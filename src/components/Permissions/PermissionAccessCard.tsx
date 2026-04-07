import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { Switch } from "@flanksource-ui/ui/FormControls/Switch";

type PermissionAccessCardProps = {
  entity: {
    id: string;
    name: string;
    namespace?: string;
    icon?: string;
  };
  globalOverride?: "allow" | "none" | "deny";
  onGlobalOverrideChange: (value: "allow" | "none" | "deny") => void;
  onViewSubjects?: () => void;
  isMutating?: boolean;
};

export default function PermissionAccessCard({
  entity,
  globalOverride = "none",
  onGlobalOverrideChange,
  onViewSubjects,
  isMutating = false
}: PermissionAccessCardProps) {
  return (
    <div
      className={`w-full max-w-3xl ${globalOverride === "none" && onViewSubjects ? "cursor-pointer" : ""}`}
      onClick={() => {
        if (globalOverride === "none") {
          onViewSubjects?.();
        }
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-700">
          <Icon name={entity.icon || "playbook"} className="h-4 w-4" />
        </div>

        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0">
            <div
              className="truncate text-sm font-semibold text-gray-900"
              title={entity.name}
            >
              {entity.name}
            </div>
            {entity.namespace ? (
              <div
                className="mt-0.5 truncate text-xs text-gray-500"
                title={entity.namespace}
              >
                {entity.namespace}
              </div>
            ) : null}
          </div>

          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <div
              className={isMutating ? "pointer-events-none opacity-60" : ""}
              aria-disabled={isMutating || undefined}
            >
              <Switch
                size="sm"
                options={["Deny all", "Custom", "Allow all"]}
                value={
                  globalOverride === "deny"
                    ? "Deny all"
                    : globalOverride === "allow"
                      ? "Allow all"
                      : "Custom"
                }
                onChange={(value) => {
                  const mappedValue =
                    value === "Deny all"
                      ? "deny"
                      : value === "Allow all"
                        ? "allow"
                        : "none";

                  onGlobalOverrideChange(mappedValue);
                }}
                className="h-auto"
                itemsClassName=""
                getActiveItemClassName={(option) =>
                  option === "Allow all"
                    ? "bg-blue-50 text-blue-700 ring-blue-200"
                    : option === "Deny all"
                      ? "bg-red-50 text-red-700 ring-red-200"
                      : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
