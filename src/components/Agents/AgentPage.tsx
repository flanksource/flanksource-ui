import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAgentsListQuery } from "../../api/query-hooks/useAgentsQuery";
import { User } from "../../api/types/users";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
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

  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";

  const { data, isLoading, refetch, isRefetching } = useAgentsListQuery(
    {
      sortBy,
      sortOrder
    },
    {
      pageIndex,
      pageSize
    },
    {
      keepPreviousData: true
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
              <AddAgent refresh={refetch} key={"add-agent"} />
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex flex-col flex-1 p-6 pb-0 h-full w-full">
          <AgentsTable
            agents={agent ?? []}
            isLoading={isLoading || isRefetching}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageSize={pageSize}
            setPageState={setPageState}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChanged={(sortBy) => {
              const sort = typeof sortBy === "function" ? sortBy([]) : sortBy;
              if (sort.length === 0) {
                searchParams.delete("sortBy");
                searchParams.delete("sortOrder");
              } else {
                searchParams.set("sortBy", sort[0]?.id);
                searchParams.set("sortOrder", sort[0].desc ? "desc" : "asc");
              }
              setSearchParams(searchParams);
            }}
            refresh={refetch}
          />
        </div>
      </SearchLayout>
    </>
  );
}
