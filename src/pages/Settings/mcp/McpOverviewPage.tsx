import PermissionsView from "@flanksource-ui/components/Permissions/PermissionsView";
import { useRef, useState } from "react";
import McpTabsLinks from "@flanksource-ui/components/MCP/McpTabsLinks";

const MCP_ACTIONS_FILTER = "mcp____run:1,mcp____use:1";

export default function McpOverviewPage() {
  const [isLoading, setIsLoading] = useState(false);
  const refetchFunctionRef = useRef<(() => void) | null>(null);

  return (
    <McpTabsLinks
      activeTab="Overview"
      loading={isLoading}
      onRefresh={() => refetchFunctionRef.current?.()}
    >
      <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
        <div className="flex min-h-0 flex-1 flex-col">
          <PermissionsView
            permissionRequest={{ action: MCP_ACTIONS_FILTER }}
            setIsLoading={setIsLoading}
            onRefetch={(refetch) => {
              refetchFunctionRef.current = refetch;
            }}
          />
        </div>
      </div>
    </McpTabsLinks>
  );
}
