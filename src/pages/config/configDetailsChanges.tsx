import { useParams } from "react-router-dom";

import { getConfigChange } from "../../api/services/configs";
import { toastError } from "../../components/Toast/toast";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { useQuery } from "@tanstack/react-query";
import { InfoMessage } from "../../components/InfoMessage";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();

  const {
    data: historyData,
    isLoading,
    error
  } = useQuery(["configs", "changes", id], () => getConfigChange(id!), {
    select: (res) => {
      if (res.error) {
        throw res.error;
      }
      return res?.data?.length === 0 ? [] : res?.data;
    },
    onError: (err: any) => {
      toastError(err);
    },
    enabled: !!id
  });

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <div className="flex flex-col items-start">
      <ConfigChangeHistory data={historyData ?? []} isLoading={isLoading} />
    </div>
  );
}
