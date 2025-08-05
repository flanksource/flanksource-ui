import { Toggle } from "@flanksource-ui/components";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useMemo, useState } from "react";
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

  // TODO: Add Hide Agents toggle functionality later
  const [hideAgents, setHideAgents] = useState(true);
  let filteredTokens = useMemo(() => {
    if (hideAgents) {
      //return tokens.filter(token => !token.name.startsWith('agent-'));
      return tokens;
    } else {
      return tokens;
    }
  }, [tokens, hideAgents]);

  return (
    //TODO: Uncomment to add Hide Agents toggle functionality
    //<div className="flex flex-col gap-4" >
    <div>
      <Toggle
        value={true}
        label="Hide Agents"
        className="inline-flex items-center"
        onChange={(val) => {
          if (val) {
          }
        }}
      ></Toggle>

      <MRTDataTable
        data={tokens}
        columns={columns}
        isLoading={isLoading}
        enableServerSideSorting={false}
      />
    </div>

    //<MRTDataTable
    //data={tokens}
    //columns={columns}
    //isLoading={isLoading}
    //enableServerSideSorting={false}
    ///>
  );
}
