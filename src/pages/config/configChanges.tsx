import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllChanges } from "../../api/services/configs";

import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { InfoMessage } from "../../components/InfoMessage";
import { toastError } from "../../components/Toast/toast";

export function ConfigChangesPage() {
  const { data, isLoading, error } = useQuery(
    ["configs", "changes", "all"],
    getAllChanges,
    {
      select: (res) => {
        if (res.error) {
          throw new Error(res.error.message);
        }
        return res?.data?.length === 0 ? [] : res?.data;
      },
      onError: (err: any) => {
        toastError(err);
      }
    }
  );

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <ConfigChangeHistory data={data ?? []} isLoading={isLoading} linkConfig />
  );
}
