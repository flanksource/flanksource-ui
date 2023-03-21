import { ColumnDef } from "@tanstack/table-core";
import { useState } from "react";
import { useConfigNameQuery } from "../../api/query-hooks";
import { ConfigTypeChanges } from "../ConfigChanges";
import ConfigLink from "../ConfigLink/ConfigLink";

import { DateCell } from "../ConfigViewer/columns";
import { PaginationOptions } from "../DataTable";
import EmptyState from "../EmptyState";
import { DataTable, Icon, Modal } from "../index";
import { JSONViewer } from "../JSONViewer";

const columns: ColumnDef<ConfigTypeChanges>[] = [
  {
    header: "Type",
    accessorKey: "change_type",
    cell: function ConfigChangeTypeCell({ row, column }) {
      const changeType = row?.getValue(column.id) as string;
      return (
        <>
          <Icon
            name={changeType}
            secondary="diff"
            className="w-5 h-auto pr-1"
          />
          {changeType}
        </>
      );
    },
    size: 16
  },
  {
    header: "Summary",
    accessorKey: "summary"
  },
  {
    header: "Source",
    accessorKey: "source",
    size: 48
  },
  {
    header: "Created",
    accessorKey: "created_at",
    size: 48,
    cell: DateCell
  }
];

const configLinkCol: ColumnDef<ConfigTypeChanges>[] = [
  {
    header: "Config",
    accessorKey: "config_id",
    cell: function ConfigLinkCell({ row, column }) {
      const config = row.original.config;
      if (!config) {
        return null;
      }
      return (
        <ConfigLink
          configId={config.id}
          configName={config.name}
          configType={config.external_type}
          configTypeSecondary={config.config_type}
        />
      );
    },
    size: 84
  }
];

type ConfigChangeHistoryProps = {
  data: ConfigTypeChanges[];
  isLoading?: boolean;
  linkConfig?: boolean;
  className?: string;
  tableStyle?: React.CSSProperties;
  pagination?: PaginationOptions;
};

export function ConfigChangeHistory({
  data,
  isLoading,
  linkConfig,
  className = "w-full",
  pagination,
  tableStyle
}: ConfigChangeHistoryProps) {
  const [configTypeChange, setConfigTypeChange] = useState<ConfigTypeChanges>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { data: config } = useConfigNameQuery(configTypeChange?.config_id, {
    enabled: !!configTypeChange?.config_id
  });

  return (
    <>
      <DataTable
        className={className}
        columns={linkConfig ? [...configLinkCol, ...columns] : columns}
        data={data}
        isLoading={isLoading}
        stickyHead
        isVirtualized={false}
        tableStyle={tableStyle}
        pagination={pagination}
        virtualizedRowEstimatedHeight={500}
        preferencesKey="config-change-history"
        savePreferences={false}
        handleRowClick={(row) => {
          setConfigTypeChange(row.original);
          setModalIsOpen(true);
        }}
      />
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        bodyClass=""
        title={
          config && (
            <>
              <ConfigLink
                className="text-blue-600 text-xl font-semibold whitespace-nowrap mr-1"
                configId={config.id}
                configName={config.name}
                configType={config.external_type}
                configTypeSecondary={config.config_type}
              />
              &nbsp;/&nbsp;
              <Icon
                name={configTypeChange?.change_type}
                secondary="diff"
                className="w-5 h-auto pr-1"
              />
              {configTypeChange?.change_type}
            </>
          )
        }
      >
        <div
          className="flex flex-col h-full overflow-x-auto p-4 flex-wrap"
          style={{
            maxHeight: "calc(100vh - 8rem)"
          }}
        >
          {!!configTypeChange?.patches && (
            <JSONViewer
              code={JSON.stringify(configTypeChange.patches, null, 2)}
              format="yaml"
              convertToYaml
            />
          )}
          {!configTypeChange?.patches && (
            <EmptyState title="There are no changes" />
          )}
        </div>
      </Modal>
    </>
  );
}
