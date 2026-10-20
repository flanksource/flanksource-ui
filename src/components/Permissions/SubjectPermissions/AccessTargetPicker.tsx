/**
 * Picks the config, component or check that playbook run, approve and cancel are
 * reviewed on, or none to review them without a target.
 */
import { IncidentCommander } from "@flanksource-ui/api/axios";
import { AccessTarget } from "@flanksource-ui/components/Permissions/SubjectPermissions/shared";
import { Button } from "@flanksource-ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@flanksource-ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@flanksource-ui/components/ui/popover";
import useDebouncedValue from "@flanksource-ui/hooks/useDebounce";
import { Icon } from "@flanksource-ui/ui/Icons/Icon";
import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, Crosshair, X } from "lucide-react";
import { useState } from "react";

const TARGET_SOURCES: Array<{
  type: AccessTarget["type"];
  label: string;
  path: string;
}> = [
  { type: "config", label: "Configs", path: "/config_items" },
  { type: "component", label: "Components", path: "/components" },
  { type: "check", label: "Checks", path: "/checks" }
];

async function searchTargets(search: string): Promise<AccessTarget[]> {
  const name = search.trim().replaceAll(/[*,()]/g, "");
  const filter = name ? `&name=ilike.*${encodeURIComponent(name)}*` : "";

  const found = await Promise.all(
    TARGET_SOURCES.map(async ({ type, path }) => {
      try {
        const response = await IncidentCommander.get<
          Array<{ id: string; name: string; type?: string; icon?: string }>
        >(
          `${path}?select=id,name,type${type === "component" ? ",icon" : ""}&deleted_at=is.null${filter}&order=name.asc&limit=8`
        );
        return (response.data ?? []).map((row) => ({
          type,
          id: row.id,
          name: row.name,
          icon: row.icon || row.type
        }));
      } catch {
        // The reviewer may not read every type
        return [];
      }
    })
  );

  return found.flat();
}

type AccessTargetPickerProps = {
  value?: AccessTarget;
  onChange: (target?: AccessTarget) => void;
};

export default function AccessTargetPicker({
  value,
  onChange
}: AccessTargetPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 250) ?? "";

  const { data: targets = [], isFetching } = useQuery({
    queryKey: ["permissions-subjects", "targets", debouncedSearch],
    queryFn: () => searchTargets(debouncedSearch),
    enabled: open,
    keepPreviousData: true
  });

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center gap-1 text-gray-500">
        <Crosshair className="h-3.5 w-3.5" />
        Target
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className="h-8 min-w-[220px] justify-between font-normal"
          >
            {value ? (
              <span className="flex min-w-0 items-center gap-1.5">
                <Icon name={value.icon} className="h-4 w-4 shrink-0" />
                <span className="truncate">{value.name}</span>
                <span className="text-xs text-gray-400">{value.type}</span>
              </span>
            ) : (
              <span className="text-gray-500">No target</span>
            )}
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-0" align="end">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search configs, components, checks..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {isFetching ? "Searching..." : "Nothing found."}
              </CommandEmpty>
              {TARGET_SOURCES.map(({ type, label }) => {
                const list = targets.filter((target) => target.type === type);
                if (list.length === 0) {
                  return null;
                }
                return (
                  <CommandGroup key={type} heading={label}>
                    {list.map((target) => (
                      <CommandItem
                        key={`${target.type}:${target.id}`}
                        value={`${target.type}:${target.id}`}
                        onSelect={() => {
                          onChange(target);
                          setOpen(false);
                        }}
                      >
                        <Icon
                          name={target.icon}
                          className="mr-2 h-4 w-4 shrink-0"
                        />
                        <span className="truncate">{target.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value ? (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-gray-500"
          onClick={() => onChange(undefined)}
          title="Review without a target"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
