import {
  useAddFeatureFlag,
  useDeleteFeatureFlag,
  useGetFeatureFlagsFromAPI,
  useGetPropertyDefinitions,
  useGetPropertyFromDB,
  useUpdateFeatureFlag
} from "@flanksource-ui/api/query-hooks/useFeatureFlags";
import { useUser } from "@flanksource-ui/context";
import { useFeatureFlagsContext } from "@flanksource-ui/context/FeatureFlagsContext";
import {
  FeatureFlag,
  PropertyDBObject
} from "@flanksource-ui/services/permissions/permissionsService";
import { DataTable } from "@flanksource-ui/ui/DataTable";
import { CellContext, ColumnDef } from "@tanstack/table-core";
import { useMemo, useState } from "react";
import FeatureFlagForm from "./FeatureFlagForm";

type ResourcePropertiesTabProps = {
  /** The prefix to filter properties by, e.g. "jobs.Scraper.{name}" */
  prefix: string;
};

const columns: ColumnDef<FeatureFlag>[] = [
  {
    header: "Name",
    accessorKey: "name"
  },
  {
    header: "Value",
    accessorKey: "value"
  },
  {
    header: "Type",
    accessorKey: "type"
  },
  {
    header: "Default",
    accessorKey: "default",
    cell: ({ getValue }: CellContext<FeatureFlag, any>) => {
      const value = getValue();
      if (value === undefined || value === null || value === "") {
        return "-";
      }
      return String(value);
    }
  },
  {
    header: "Source",
    accessorKey: "source"
  }
];

export default function ResourcePropertiesTab({
  prefix
}: ResourcePropertiesTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedRow, setEditedRow] = useState<FeatureFlag>();
  const { refreshFeatureFlags } = useFeatureFlagsContext();
  const user = useUser();

  const {
    data: featureFlags,
    isLoading,
    refetch
  } = useGetFeatureFlagsFromAPI();

  const { data: propertyDefinitions } = useGetPropertyDefinitions();

  const filteredProperties = useMemo(() => {
    const flags = featureFlags ?? [];
    const enriched = flags
      .filter((flag) => flag.name.startsWith(prefix))
      .map((flag) => {
        const metadata = propertyDefinitions?.[flag.name];
        return {
          ...flag,
          type: metadata?.type || flag.type,
          default: metadata?.default,
          description: metadata?.description || flag.description
        };
      });
    return enriched;
  }, [featureFlags, propertyDefinitions, prefix]);

  const { data: property } = useGetPropertyFromDB(editedRow);

  const { mutate: saveFeatureFlag } = useAddFeatureFlag(() => {
    refetch();
    setIsOpen(false);
    refreshFeatureFlags();
  });

  const { mutate: updateFeatureFlag } = useUpdateFeatureFlag(() => {
    refetch();
    setIsOpen(false);
    refreshFeatureFlags();
  });

  const { mutate: deleteFeatureFlag } = useDeleteFeatureFlag(() => {
    refetch();
    setIsOpen(false);
    refreshFeatureFlags();
  });

  async function onSubmit(data: Partial<PropertyDBObject>) {
    if (!data.created_at) {
      saveFeatureFlag({ ...data, created_by: user.user?.id });
    } else {
      updateFeatureFlag({ ...data, created_by: user.user?.id });
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-2">
      <DataTable
        stickyHead
        columns={columns}
        data={filteredProperties}
        tableStyle={{ borderSpacing: "0" }}
        isLoading={isLoading}
        preferencesKey="resource-properties-tab"
        savePreferences={false}
        handleRowClick={(row) => {
          if (row.original.source === "local") {
            return;
          }
          setIsOpen(true);
          setEditedRow(row.original);
        }}
      />
      {property && (
        <FeatureFlagForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onFeatureFlagSubmit={onSubmit}
          onFeatureFlagDelete={deleteFeatureFlag}
          formValue={property}
          source={editedRow?.source}
        />
      )}
    </div>
  );
}
