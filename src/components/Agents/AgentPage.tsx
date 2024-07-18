import { tables } from "@flanksource-ui/context/UserAccessContext/permissions";
import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useState } from "react";
import { useAgentsListQuery } from "../../api/query-hooks/useAgentsQuery";
import { User } from "../../api/types/users";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import { AuthorizationAccessCheck } from "../Permissions/AuthorizationAccessCheck";
import AddAgent from "./Add/AddAgent";
import AgentsTable from "./List/AgentsTable";

export type Agent = {
  id?: string;
  name: string;
  hostname?: string;
  description?: string;
  ip?: string;
  version?: string;
  username?: string;
  person_id?: string;
  person?: User;
  properties?: { [key: string]: any };
  tls?: string;
  created_by?: User;
  created_at: Date;
  updated_at: Date;
  last_seen: string;
  last_received: string;
};

export type AgentSummary = Agent & {
  config_count?: number;
  checks_count?: number;
  config_scrapper_count?: number;
  playbook_runs_count?: number;
};

export default function AgentsPage() {
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 150
  });

  const { data, isLoading, refetch, isRefetching } = useAgentsListQuery(
    {
      pageIndex,
      pageSize
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      cacheTime: 0
    }
  );

  const agent = data?.data;
  const totalEntries = data?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  return (
    <>
      <Head prefix="Agents" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"root-agent"} link="/agents">
                Agents
              </BreadcrumbRoot>,
              <AuthorizationAccessCheck
                resource={tables.agents}
                action="write"
                key="add-agent"
              >
                <AddAgent refresh={refetch} key={"add-agent"} />
              </AuthorizationAccessCheck>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
          <AgentsTable
            agents={agent ?? []}
            isLoading={isLoading || isRefetching}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageState={setPageState}
            refresh={refetch}
          />
        </div>
      </SearchLayout>
    </>
  );
}
