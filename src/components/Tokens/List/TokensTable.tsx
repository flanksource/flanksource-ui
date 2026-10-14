import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Token } from "../../../api/services/tokens";
import { tokensTableColumns } from "./TokensTableColumns";
import TokenDetailsModal from "../TokenDetailsModal";

type TokensTableProps = {
  tokens: Token[];
  isLoading?: boolean;
  isRefetching?: boolean;
  refresh?: () => void;
  tokenIdSearchParamKey?: string;
};

export default function TokensTable({
  tokens,
  isLoading,
  isRefetching,
  refresh,
  tokenIdSearchParamKey = "id"
}: TokensTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const columns = useMemo(() => tokensTableColumns, []);

  const tokenId = searchParams.get(tokenIdSearchParamKey) ?? undefined;
  const selectedToken = useMemo(() => {
    return tokens.find((token) => token.id === tokenId);
  }, [tokens, tokenId]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <MRTDataTable
        data={tokens}
        columns={columns}
        isLoading={isLoading}
        isRefetching={isRefetching}
        enableServerSideSorting={false}
        onRowClick={(token) => {
          searchParams.set(tokenIdSearchParamKey, token.id);
          setSearchParams(searchParams);
        }}
      />

      {selectedToken && (
        <TokenDetailsModal
          token={selectedToken}
          isOpen={!!selectedToken}
          onClose={() => {
            if (refresh) {
              refresh();
            }
            searchParams.delete(tokenIdSearchParamKey);
            setSearchParams(searchParams);
          }}
        />
      )}
    </div>
  );
}
