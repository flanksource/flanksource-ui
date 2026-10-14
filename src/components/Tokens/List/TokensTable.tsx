import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteToken, Token } from "../../../api/services/tokens";
import { toastError, toastSuccess } from "../../Toast/toast";
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
  const [tokenToDelete, setTokenToDelete] = useState<Token>();
  const queryClient = useQueryClient();

  const { mutate: deleteTokenMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deleteToken,
    onSuccess: () => {
      toastSuccess("Token deleted successfully");
      setTokenToDelete(undefined);
      queryClient.invalidateQueries(["tokens", "list"]);
      refresh?.();
    },
    onError: (error: any) => {
      toastError(error?.message || "Failed to delete token");
    }
  });

  const columns = useMemo<MRT_ColumnDef<Token>[]>(
    () => [
      ...tokensTableColumns,
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableColumnActions: false,
        maxSize: 30,
        Cell: ({ row }) => (
          <div className="text-right">
            <button
              type="button"
              className="text-red-600 hover:text-red-800"
              onClick={(e) => {
                // Don't open the details modal behind the confirmation
                e.stopPropagation();
                setTokenToDelete(row.original);
              }}
            >
              Delete
            </button>
          </div>
        )
      }
    ],
    []
  );

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

      <ConfirmationPromptDialog
        title="Delete token"
        description={
          <>
            Delete token <b>{tokenToDelete?.name}</b>? It stops working at once.
            This action cannot be undone.
          </>
        }
        isLoading={isDeleting}
        isOpen={!!tokenToDelete}
        onConfirm={() => tokenToDelete && deleteTokenMutation(tokenToDelete.id)}
        onClose={() => setTokenToDelete(undefined)}
      />
    </div>
  );
}
