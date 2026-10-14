import {
  useDeleteAgentTokenMutation,
  useGenerateAgentTokenMutation
} from "@flanksource-ui/api/query-hooks/mutations/useUpsertAgentMutations";
import { useAgentTokensQuery } from "@flanksource-ui/api/query-hooks/useAgentsQuery";
import {
  AgentAccessToken,
  GeneratedAgent
} from "@flanksource-ui/api/services/agents";
import { ErrorViewer } from "@flanksource-ui/components/ErrorViewer";
import {
  toastError,
  toastSuccess
} from "@flanksource-ui/components/Toast/toast";
import { useUser } from "@flanksource-ui/context";
import { Age } from "@flanksource-ui/ui/Age";
import { ConfirmationPromptDialog } from "@flanksource-ui/ui/AlertDialog/ConfirmationPromptDialog";
import { Button } from "@flanksource-ui/ui/Buttons/Button";
import FormSkeletonLoader from "@flanksource-ui/ui/SkeletonLoader/FormSkeletonLoader";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaCircleNotch, FaPlus } from "react-icons/fa";
import InstallAgentModal from "../InstalAgentInstruction/InstallAgentModal";

type Props = {
  agentId: string;
  agentName: string;
  agentProperties?: Record<string, string>;
};

export default function AgentTokensTab({
  agentId,
  agentName,
  agentProperties = {}
}: Props) {
  const { access } = useUser();
  const canUpdate = access?.agent?.update === "all";
  const queryClient = useQueryClient();

  const [tokenToRevoke, setTokenToRevoke] = useState<AgentAccessToken>();
  const [generatedAgent, setGeneratedAgent] = useState<GeneratedAgent>();

  const {
    data: tokens = [],
    isLoading,
    error
  } = useAgentTokensQuery(agentId, { staleTime: 0, cacheTime: 0 });

  const refreshTokens = () =>
    queryClient.invalidateQueries(["agents", agentId, "tokens"]);

  const { mutate: revokeToken, isLoading: isRevoking } =
    useDeleteAgentTokenMutation({
      onSuccess: () => {
        toastSuccess("Token revoked");
        setTokenToRevoke(undefined);
        refreshTokens();
      },
      onError: (error) => {
        toastError(error.message);
      }
    });

  const { mutate: generateToken, isLoading: isGenerating } =
    useGenerateAgentTokenMutation({
      onSuccess: (data) => {
        setGeneratedAgent(data);
        refreshTokens();
      },
      onError: (error) => {
        toastError(error.message);
      }
    });

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <p className="text-sm text-gray-500">
          The agent uses these tokens to connect to Mission Control. Token
          values are only shown when a token is generated.
        </p>
        {isLoading ? (
          <FormSkeletonLoader />
        ) : error ? (
          <ErrorViewer error={error} />
        ) : tokens.length === 0 ? (
          <div className="rounded-md border border-gray-200 p-4 text-center text-sm text-gray-500">
            This agent has no access tokens.
          </div>
        ) : (
          <table className="w-full table-auto text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-2 py-2 font-medium">Name</th>
                <th className="px-2 py-2 font-medium">Created</th>
                <th className="px-2 py-2 font-medium">Expires</th>
                {canUpdate && <th className="px-2 py-2" />}
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.id} className="border-b border-gray-100">
                  <td className="px-2 py-2 text-gray-900">{token.name}</td>
                  <td className="px-2 py-2">
                    <Age from={token.created_at} suffix />
                  </td>
                  <td className="px-2 py-2">
                    {token.expires_at ? (
                      <Age from={token.expires_at} suffix />
                    ) : (
                      "Never"
                    )}
                  </td>
                  {canUpdate && (
                    <td className="px-2 py-2 text-right">
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setTokenToRevoke(token)}
                      >
                        Revoke
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {canUpdate && (
        <div className="flex items-center justify-end bg-gray-100 px-5 py-4">
          <Button
            text="Generate new token"
            disabled={isGenerating}
            icon={
              isGenerating ? (
                <FaCircleNotch className="animate-spin" />
              ) : (
                <FaPlus />
              )
            }
            className="btn-primary"
            onClick={() => generateToken(agentName)}
          />
        </div>
      )}

      <ConfirmationPromptDialog
        title="Revoke token"
        description={
          <>
            Revoke token <b>{tokenToRevoke?.name}</b>? It stops working at once
            and the agent disconnects until it gets a new token.
          </>
        }
        yesLabel="Revoke"
        isLoading={isRevoking}
        isOpen={!!tokenToRevoke}
        onConfirm={() =>
          tokenToRevoke && revokeToken({ agentId, tokenId: tokenToRevoke.id })
        }
        onClose={() => setTokenToRevoke(undefined)}
        className="z-[9999]"
      />

      {generatedAgent && (
        <InstallAgentModal
          isOpen
          onClose={() => setGeneratedAgent(undefined)}
          generatedAgent={generatedAgent}
          agentFormValues={{ name: agentName, properties: agentProperties }}
        />
      )}
    </div>
  );
}
