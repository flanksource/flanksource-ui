import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@flanksource-ui/components/ui/dropdown-menu";
import {
  getPluginsForConfig,
  pluginTabPath
} from "@flanksource-ui/api/services/configPlugins";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PluginIcon } from "./PluginIcon";

export function ConfigPluginsDropdown() {
  const { id, pluginName: activePlugin } = useParams<{
    id: string;
    pluginName?: string;
  }>();
  const navigate = useNavigate();

  const { data: plugins = [] } = useQuery({
    queryKey: ["config", "plugins", id],
    queryFn: () => getPluginsForConfig(id!),
    enabled: !!id
  });

  const items = plugins.flatMap((plugin) =>
    (plugin.tabs ?? []).map((tab) => ({ plugin, tab }))
  );

  if (!id || items.length === 0) {
    return null;
  }

  const isActive = !!activePlugin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={clsx(
          "mb-[-2px] flex cursor-pointer flex-row items-center space-x-1 rounded-t-md border border-b-0 border-gray-300 px-4 py-2 text-sm font-medium hover:text-gray-900 focus:outline-none",
          isActive
            ? "bg-white text-gray-900"
            : "border-transparent text-gray-500"
        )}
      >
        <span>Plugins</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map(({ plugin, tab }) => (
          <DropdownMenuItem
            key={`${plugin.name}:${tab.name}`}
            onClick={() => navigate(pluginTabPath(id, plugin.name, tab.name))}
            className="flex flex-row items-center space-x-2"
          >
            <PluginIcon name={tab.icon} />
            <span>{tab.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
