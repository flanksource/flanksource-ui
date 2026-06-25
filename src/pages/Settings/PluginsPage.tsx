import {
  getPlugins,
  PluginListing,
  PluginUpgradeResult,
  upgradePlugin
} from "@flanksource-ui/api/services/plugins";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { MRT_ColumnDef } from "mantine-react-table";
import { useCallback, useMemo, useState } from "react";
import { FaCircleNotch } from "react-icons/fa";

function getUpgradeSuccessMessage(result: PluginUpgradeResult) {
  const plugin = result.plugin || "Plugin";

  if (result.restarted) {
    const previousVersion = result.previousVersion
      ? ` from ${result.previousVersion}`
      : "";
    const resolvedVersion = result.resolvedVersion
      ? ` to ${result.resolvedVersion}`
      : "";
    return `${plugin} upgraded${previousVersion}${resolvedVersion}`;
  }

  if (result.resolvedVersion) {
    return `${plugin} is already at latest version ${result.resolvedVersion}`;
  }

  return `${plugin} is already up to date`;
}

function PluginUpgradeButton({
  plugin,
  isUpgrading,
  onUpgrade
}: {
  plugin: PluginListing;
  isUpgrading?: boolean;
  onUpgrade: (plugin: PluginListing) => void;
}) {
  const isRemotePlugin = Boolean(plugin.agent);

  return (
    <AuthorizationAccessCheck resource={tables.rbac} action="write">
      <Button
        className="btn-white"
        size="xs"
        disabled={isRemotePlugin || isUpgrading}
        disabledTooltip={
          isRemotePlugin
            ? "Remote plugins must be upgraded on their owning agent"
            : undefined
        }
        onClick={(event) => {
          event.stopPropagation();
          onUpgrade(plugin);
        }}
        title="Check for and install the latest plugin version"
      >
        {isUpgrading && <FaCircleNotch className="inline animate-spin" />}
        <span>Upgrade</span>
      </Button>
    </AuthorizationAccessCheck>
  );
}

function PluginsList({
  data,
  isLoading,
  className,
  upgradingPluginName,
  onUpgrade
}: {
  data: PluginListing[];
  isLoading?: boolean;
  className?: string;
  upgradingPluginName?: string;
  onUpgrade: (plugin: PluginListing) => void;
}) {
  const columns = useMemo<MRT_ColumnDef<PluginListing>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        maxSize: 50,
        enableResizing: true
      },
      {
        header: "Description",
        accessorKey: "description",
        enableResizing: true
      },
      {
        header: "Version",
        accessorKey: "version",
        maxSize: 100,
        enableResizing: true
      },
      {
        header: "Agent",
        id: "agent",
        accessorFn: (row) => row.agent?.name ?? "Local",
        maxSize: 100,
        enableResizing: true
      },
      {
        header: "",
        id: "actions",
        maxSize: 90,
        enableColumnActions: false,
        enableResizing: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="flex justify-end">
            <PluginUpgradeButton
              plugin={row.original}
              isUpgrading={upgradingPluginName === row.original.name}
              onUpgrade={onUpgrade}
            />
          </div>
        )
      }
    ],
    [onUpgrade, upgradingPluginName]
  );

  return (
    <div className={clsx(className)}>
      <MRTDataTable columns={columns} data={data} isLoading={isLoading} />
    </div>
  );
}

export function PluginsPage() {
  const [pluginToUpgrade, setPluginToUpgrade] = useState<PluginListing | null>(
    null
  );

  const {
    isLoading: loading,
    data: plugins,
    refetch
  } = useQuery({
    queryKey: ["plugins", "all"],
    queryFn: async () => {
      const response = await getPlugins();
      return response.data ?? [];
    }
  });

  const {
    mutate: upgradeSelectedPlugin,
    isLoading: isUpgrading,
    error: upgradeError,
    reset: resetUpgrade
  } = useMutation({
    mutationFn: async (plugin: PluginListing) => {
      const response = await upgradePlugin(plugin.name);
      return response.data;
    },
    onSuccess: (result) => {
      toastSuccess(getUpgradeSuccessMessage(result));
      setPluginToUpgrade(null);
      refetch();
    },
    onError: (error) => {
      toastError(error);
    }
  });

  const handleUpgradeClick = useCallback(
    (plugin: PluginListing) => {
      resetUpgrade();
      setPluginToUpgrade(plugin);
    },
    [resetUpgrade]
  );

  const closeUpgradeDialog = useCallback(() => {
    if (isUpgrading) {
      return;
    }
    resetUpgrade();
    setPluginToUpgrade(null);
  }, [isUpgrading, resetUpgrade]);

  return (
    <>
      <Head prefix="Plugins" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="plugins" link="/settings/plugins">
                Plugins
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={() => {
          refetch();
        }}
        contentClass="p-0 h-full"
        loading={loading}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pb-0">
          <PluginsList
            className="mt-6 flex h-full flex-col overflow-y-auto py-1"
            data={plugins ?? []}
            isLoading={loading}
            upgradingPluginName={
              isUpgrading ? pluginToUpgrade?.name : undefined
            }
            onUpgrade={handleUpgradeClick}
          />
        </div>
      </SearchLayout>
      <ConfirmationPromptDialog
        isOpen={Boolean(pluginToUpgrade)}
        title="Upgrade plugin?"
        description={
          <span>
            Check for the latest version of{" "}
            <strong>{pluginToUpgrade?.name}</strong>. If a newer version is
            available, Mission Control will restart the local plugin.
            {pluginToUpgrade?.version ? (
              <span className="mt-2 block">
                Current version: {pluginToUpgrade.version}
              </span>
            ) : null}
          </span>
        }
        onClose={closeUpgradeDialog}
        onConfirm={() => {
          if (pluginToUpgrade) {
            upgradeSelectedPlugin(pluginToUpgrade);
          }
        }}
        yesLabel="Upgrade"
        closeLabel="Cancel"
        confirmationStyle="approve"
        isLoading={isUpgrading}
        error={upgradeError}
      />
    </>
  );
}
