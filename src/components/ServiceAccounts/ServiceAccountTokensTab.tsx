import {
  createServiceAccountToken,
  getServiceAccountTokens,
  revokeServiceAccountToken,
  ServiceAccountToken,
  setServiceAccountTokenRoles
} from "@flanksource-ui/api/services/serviceAccounts";
import { CreateTokenRequest } from "@flanksource-ui/api/services/tokens";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import CreateTokenForm, {
  TokenFormValues
} from "@flanksource-ui/components/Tokens/Add/CreateTokenForm";
import TokenDisplayModal from "@flanksource-ui/components/Tokens/Add/TokenDisplayModal";
import { tokenColumns } from "@flanksource-ui/components/Tokens/List/TokensTableColumns";
import TokenDetailsModal from "@flanksource-ui/components/Tokens/TokenDetailsModal";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import ServiceAccountKubeconfigModal from "./ServiceAccountKubeconfigModal";

export default function ServiceAccountTokensTab({
  account,
  canUseProxy
}: {
  account: string;
  canUseProxy: boolean;
}) {
  const queryClient = useQueryClient();
  const queryKey = ["service-accounts", account, "tokens"];
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isKubeconfigOpen, setIsKubeconfigOpen] = useState(false);
  const [issued, setIssued] = useState<{
    token: string;
    formValues: TokenFormValues;
  }>();
  const [tokenToRevoke, setTokenToRevoke] = useState<ServiceAccountToken>();
  const [selectedTokenId, setSelectedTokenId] = useState<string>();

  const {
    data: tokens = [],
    isLoading,
    isRefetching,
    error
  } = useQuery({
    queryKey,
    queryFn: () => getServiceAccountTokens(account),
    staleTime: 0
  });
  const selectedToken = tokens.find((token) => token.id === selectedTokenId);

  const { mutate: revoke, isLoading: isRevoking } = useMutation({
    mutationFn: (id: string) => revokeServiceAccountToken(account, id),
    onSuccess: () => {
      toastSuccess("Token revoked");
      setTokenToRevoke(undefined);
      queryClient.invalidateQueries(queryKey);
    },
    onError: (error) => toastError(error)
  });

  // The personal token form, sending the request to the service account's route
  const issueToken = async ({
    name,
    expiry,
    auto_renew,
    roles
  }: CreateTokenRequest) => {
    const created = await createServiceAccountToken(account, {
      name,
      expiry,
      autoRenew: !!auto_renew,
      roles
    });
    return { message: "", payload: { token: created.token } };
  };

  const columns = useMemo<MRT_ColumnDef<ServiceAccountToken>[]>(() => {
    // The personal token columns, narrowed to make room for the issuer after the roles
    const [name, roles, ...rest] = tokenColumns<ServiceAccountToken>().map(
      (column) => ({
        ...column,
        size: column.id === "role_bindings" ? 160 : 100,
        maxSize: undefined
      })
    );
    return [
      name,
      roles,
      {
        header: "Issued By",
        id: "issuer",
        accessorFn: (row) => row.issuer?.name,
        size: 100,
        Cell: ({ row }) =>
          row.original.issuer ? (
            <Avatar user={row.original.issuer} showName />
          ) : null
      },
      ...rest,
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
                setTokenToRevoke(row.original);
              }}
            >
              Revoke
            </button>
          </div>
        )
      }
    ];
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row items-start justify-between gap-4">
        <p className="text-sm text-gray-500">
          Each token signs in as {account}, limited to the Roles it was issued
          with. Token values are only shown when a token is issued.
        </p>
        <div className="flex shrink-0 flex-row gap-2">
          <Button
            text="Download kubeconfig"
            icon={<IoMdDownload />}
            className="btn-white"
            onClick={() => setIsKubeconfigOpen(true)}
          />
          <Button
            text="Issue token"
            icon={<FaPlus />}
            className="btn-primary"
            onClick={() => setIsCreateOpen(true)}
          />
        </div>
      </div>

      {error ? (
        <ErrorViewer error={error} />
      ) : (
        <MRTDataTable
          data={tokens}
          columns={columns}
          isLoading={isLoading}
          isRefetching={isRefetching}
          enableServerSideSorting={false}
          onRowClick={(token) => setSelectedTokenId(token.id)}
        />
      )}

      {selectedToken && (
        <TokenDetailsModal
          token={selectedToken}
          isOpen
          onClose={() => setSelectedTokenId(undefined)}
          accessOwner={account}
          saveTokenRoles={(id, roles) =>
            setServiceAccountTokenRoles(account, id, roles)
          }
          removeToken={(id) => revokeServiceAccountToken(account, id)}
          queryKey={queryKey}
        />
      )}

      <ServiceAccountKubeconfigModal
        account={account}
        canUseProxy={canUseProxy}
        isOpen={isKubeconfigOpen}
        onClose={() => setIsKubeconfigOpen(false)}
      />

      <CreateTokenForm
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        createToken={issueToken}
        accessOwner={account}
        onSuccess={(response, formValues) => {
          queryClient.invalidateQueries(queryKey);
          setIsCreateOpen(false);
          setIssued({ token: response.payload.token, formValues });
        }}
      />

      {issued && (
        <TokenDisplayModal
          isOpen
          onClose={() => setIssued(undefined)}
          tokenResponse={{ message: "", payload: { token: issued.token } }}
          formValues={issued.formValues}
          accessOwner={account}
        />
      )}

      <ConfirmationPromptDialog
        title="Revoke token"
        description={
          <>
            Revoke token <b>{tokenToRevoke?.name}</b>? It stops working at once.
          </>
        }
        yesLabel="Revoke"
        isLoading={isRevoking}
        isOpen={!!tokenToRevoke}
        onConfirm={() => tokenToRevoke && revoke(tokenToRevoke.id)}
        onClose={() => setTokenToRevoke(undefined)}
      />
    </div>
  );
}
