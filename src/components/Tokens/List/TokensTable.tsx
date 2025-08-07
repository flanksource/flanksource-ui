import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Token } from "../../../api/services/tokens";
import { tokensTableColumns } from "./TokensTableColumns";
import TokenDetailsModal from "../TokenDetailsModal";

type TokensTableProps = {
  tokens: Token[];
  isLoading?: boolean;
  refresh?: () => void;
};

export default function TokensTable({
  tokens,
  isLoading,
  refresh
}: TokensTableProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const columns = useMemo(() => tokensTableColumns, []);

  const tokenId = searchParams.get("id") ?? undefined;
  const selectedToken = useMemo(() => {
    return tokens.find((token) => token.id === tokenId);
  }, [tokens, tokenId]);

  const [hideAgents, setHideAgents] = useState(true);
  const filteredTokens = useMemo(() => {
    if (hideAgents) {
      return tokens.filter((token) => !token.name.startsWith("agent-"));
    } else {
      return tokens;
    }
  }, [tokens, hideAgents]);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <Toggle
        value={hideAgents}
        label="Hide Agents"
        className="inline-flex items-center"
        onChange={(val) => {
          setHideAgents(val);
        }}
      />

      <MRTDataTable
        data={filteredTokens}
        columns={columns}
        isLoading={isLoading}
        enableServerSideSorting={false}
        onRowClick={(token) => {
          searchParams.set("id", token.id);
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
            searchParams.delete("id");
            setSearchParams(searchParams);
          }}
        />
      )}
    </div>
  );
}
