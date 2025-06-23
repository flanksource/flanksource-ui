import { getAll } from "@flanksource-ui/api/schemaResources";
import { AuthorizationAccessCheck } from "@flanksource-ui/components/Permissions/AuthorizationAccessCheck";
import { SchemaApi } from "@flanksource-ui/components/SchemaResourcePage/resourceTypes";
import { useUser } from "@flanksource-ui/context";
import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import {
  BreadcrumbNav,
  BreadcrumbRoot
} from "@flanksource-ui/ui/BreadcrumbNav";
import useReactTableSortState from "@flanksource-ui/ui/DataTable/Hooks/useReactTableSortState";
import { Head } from "@flanksource-ui/ui/Head";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useQuery } from "@tanstack/react-query";
import { ApplicationsList } from "./ApplicationsList";

export interface Application {
  id: string;
  name: string;
  namespace?: string;
  description?: string;
  spec: any;
  labels?: any;
  source: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

const applicationsSchemaConnection: SchemaApi = {
  table: "applications",
  api: "config-db",
  name: "Applications"
};

export function ApplicationsPage() {
  const user = useUser();
  const [sortState] = useReactTableSortState();

  const {
    isLoading: loading,
    data: applications,
    refetch
  } = useQuery({
    queryKey: ["applications", "all", sortState],
    queryFn: async () => {
      const response = await getAll(applicationsSchemaConnection, sortState);
      return (response.data ?? []) as unknown as Application[];
    }
  });

  return (
    <>
      <Head prefix="Applications" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key="applications" link="/applications">
                Applications
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
          <ApplicationsList
            className="mt-6 flex h-full flex-col overflow-y-auto py-1"
            data={applications ?? []}
            isLoading={loading}
          />
        </div>
      </SearchLayout>
    </>
  );
}
