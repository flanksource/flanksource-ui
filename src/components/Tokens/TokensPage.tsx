import { SearchLayout } from "@flanksource-ui/ui/Layout/SearchLayout";
import { useTokensListQuery } from "../../api/query-hooks/useTokensQuery";
import { BreadcrumbNav, BreadcrumbRoot } from "../../ui/BreadcrumbNav";
import { Head } from "../../ui/Head";
import TokensTable from "./List/TokensTable";

export default function TokensPage() {
  const {
    data: tokens,
    isLoading,
    refetch,
    isRefetching
  } = useTokensListQuery({
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 0
  });

  return (
    <>
      <Head prefix="Tokens" />
      <SearchLayout
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot key={"root-tokens"} link="/settings/tokens">
                Tokens
              </BreadcrumbRoot>
            ]}
          />
        }
        onRefresh={refetch}
        contentClass="p-0 h-full"
        loading={isLoading || isRefetching}
      >
        <div className="flex h-full w-full flex-1 flex-col p-6 pb-0">
          <TokensTable
            tokens={tokens ?? []}
            isLoading={isLoading || isRefetching}
            refresh={refetch}
          />
        </div>
      </SearchLayout>
    </>
  );
}
