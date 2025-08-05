import { Toggle } from "@flanksource-ui/ui/FormControls/Toggle";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useMemo, useState, useEffect } from "react";
import { Token } from "../../../api/services/tokens";
import { tokensTableColumns } from "./TokensTableColumns";

type TokensTableProps = {
  tokens: Token[];
  isLoading?: boolean;
  refresh?: () => void;
};

export default function TokensTable({
  tokens,
  isLoading,
  refresh = () => {}
}: TokensTableProps) {
  const columns = useMemo(() => tokensTableColumns, []);

  const [hideAgents, setHideAgents] = useState(true);
  const filteredTokens = useMemo(() => {
    if (hideAgents) {
      return tokens.filter((token) => !token.name.startsWith("agent-"));
    } else {
      return tokens;
    }
  }, [tokens, hideAgents]);

  useEffect(() => {
    console.log(
      "TokensTable useEffect - filteredTokens updated:",
      filteredTokens
    );
  }, [filteredTokens]);

  return (
    /*
     * TODO: @yash (Table not displayed at all when this is commented out)
    <div className="flex flex-col gap-4">
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
      />
    </div>
    */
    <MRTDataTable
      data={filteredTokens}
      columns={columns}
      isLoading={isLoading}
      enableServerSideSorting={false}
    />
  );
}
