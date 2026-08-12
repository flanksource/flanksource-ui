import {
  ConfigAccessSummary,
  ConfigAccessSummaryByConfig,
  ConfigAccessSummaryByGroup,
  ConfigAccessSummaryByUser
} from "@flanksource-ui/api/types/configs";
import ConfigLink from "@flanksource-ui/components/Configs/ConfigLink/ConfigLink";
import { ExternalUserCell } from "@flanksource-ui/components/Configs/ExternalUserCell";
import { Age } from "@flanksource-ui/ui/Age";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import FilterByCellValue from "@flanksource-ui/ui/DataTable/FilterByCellValue";
import { MRTCellProps } from "@flanksource-ui/ui/MRTDataTable/MRTCellProps";
import { paramsToReset } from "../utils";

export const FlatConfigCell = ({ row }: MRTCellProps<ConfigAccessSummary>) => {
  const configId = row.original.config_id;
  const configType = row.original.config_type;
  const configName = row.original.config_name;

  if (!configId || !configType || !configName) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <FilterByCellValue
      filterValue={configId}
      paramKey="config_id"
      paramsToReset={paramsToReset}
    >
      <ConfigLink
        config={{
          id: configId,
          type: configType,
          name: configName
        }}
        configId={configId}
        showSecondaryIcon
      />
    </FilterByCellValue>
  );
};

export const FlatUserCell = ({ row }: MRTCellProps<ConfigAccessSummary>) => {
  const userName = row.original.user;
  const user = {
    name: userName,
    user_email: row.original.email || null
  };

  if (!userName) {
    return <span className="text-gray-400">—</span>;
  }

  const filterValue =
    row.original.external_user_id ?? row.original.external_group_id;
  const paramKey = row.original.external_user_id
    ? "external_user_id"
    : "external_group_id";

  if (!filterValue) {
    return <ExternalUserCell user={user} />;
  }

  return (
    <FilterByCellValue
      filterValue={filterValue}
      paramKey={paramKey}
      paramsToReset={paramsToReset}
    >
      <ExternalUserCell user={user} />
    </FilterByCellValue>
  );
};

export const FlatRoleCell = ({ cell }: MRTCellProps<ConfigAccessSummary>) => {
  const value = cell.getValue<string | null>();

  if (!value) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <FilterByCellValue
      filterValue={value}
      paramKey="role"
      paramsToReset={paramsToReset}
    >
      <span>{value}</span>
    </FilterByCellValue>
  );
};

export const FlatTypeCell = ({ cell }: MRTCellProps<ConfigAccessSummary>) => {
  const value = cell.getValue<string | null>();

  if (!value) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <FilterByCellValue
      filterValue={value}
      paramKey="user_type"
      paramsToReset={paramsToReset}
    >
      <span>{value}</span>
    </FilterByCellValue>
  );
};

export const FlatLastSignedInCell = ({
  cell
}: MRTCellProps<ConfigAccessSummary>) => {
  const value = cell.getValue<string | null>();

  if (!value) {
    return <span className="text-gray-400">Never</span>;
  }

  return <Age from={value} />;
};

export const FlatOptionalDateCell = ({
  cell
}: MRTCellProps<ConfigAccessSummary>) => {
  const value = cell.getValue<string | null>();

  if (!value) {
    return <span className="text-gray-400">—</span>;
  }

  return <Age from={value} />;
};

export const GroupedByUserIdentityCell = ({
  row
}: MRTCellProps<ConfigAccessSummaryByUser>) => {
  const user = {
    name: row.original.user,
    user_email: row.original.email || null
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <ExternalUserCell user={user} />
      <Badge text={row.original.access_count} />
    </div>
  );
};

export const GroupedByGroupIdentityCell = ({
  row
}: MRTCellProps<ConfigAccessSummaryByGroup>) => (
  <div className="flex flex-row items-center gap-2">
    <span>{row.original.group}</span>
    <Badge text={row.original.access_count} />
  </div>
);

function GroupedOptionalDateValue({ value }: { value?: string | null }) {
  if (!value) {
    return <span className="text-gray-400">Never</span>;
  }

  return <Age from={value} />;
}

export const GroupedByUserLastSignedInCell = ({
  cell
}: MRTCellProps<ConfigAccessSummaryByUser>) => (
  <GroupedOptionalDateValue value={cell.getValue<string | null>()} />
);

export const GroupedByGroupLastSignedInCell = ({
  cell
}: MRTCellProps<ConfigAccessSummaryByGroup>) => (
  <GroupedOptionalDateValue value={cell.getValue<string | null>()} />
);

function GroupedLatestGrantValue({ value }: { value?: string | null }) {
  if (!value) {
    return <span className="text-gray-400">—</span>;
  }

  return <Age from={value} />;
}

export const GroupedByUserLatestGrantCell = ({
  cell
}: MRTCellProps<ConfigAccessSummaryByUser>) => (
  <GroupedLatestGrantValue value={cell.getValue<string | null>()} />
);

export const GroupedByGroupLatestGrantCell = ({
  cell
}: MRTCellProps<ConfigAccessSummaryByGroup>) => (
  <GroupedLatestGrantValue value={cell.getValue<string | null>()} />
);

export const GroupedByCatalogIdentityCell = ({
  row
}: MRTCellProps<ConfigAccessSummaryByConfig>) => {
  const { config_id, config_type, config_name, access_count } = row.original;

  return (
    <div className="flex flex-row items-center gap-2">
      <ConfigLink
        config={{
          id: config_id,
          type: config_type,
          name: config_name
        }}
        configId={config_id}
        showSecondaryIcon
      />
      <Badge text={access_count} />
    </div>
  );
};

export const GroupedByCatalogLastSignedInCell = ({
  cell
}: MRTCellProps<ConfigAccessSummaryByConfig>) => {
  const value = cell.getValue<string | null>();

  if (!value) {
    return <span className="text-gray-400">Never</span>;
  }

  return <Age from={value} />;
};

export const GroupedByCatalogLatestGrantCell = ({
  cell
}: MRTCellProps<ConfigAccessSummaryByConfig>) => {
  const value = cell.getValue<string | null>();

  if (!value) {
    return <span className="text-gray-400">—</span>;
  }

  return <Age from={value} />;
};
