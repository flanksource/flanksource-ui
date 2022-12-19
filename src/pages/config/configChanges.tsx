import { useGetAllConfigsChangesQuery } from "../../api/query-hooks";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { InfoMessage } from "../../components/InfoMessage";
import { ConfigLayout } from "../../components/Layout";

export function ConfigChangesPage() {
  const { data, isLoading, error } = useGetAllConfigsChangesQuery();

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message ?? "Something went wrong";

  return (
    <ConfigLayout
      basePath={`configs`}
      isConfigDetails
      title={"Configs"}
      isLoading={isLoading}
    >
      {error ? (
        <InfoMessage message={errorMessage} />
      ) : (
        <ConfigChangeHistory
          data={data ?? []}
          isLoading={isLoading}
          linkConfig
        />
      )}
    </ConfigLayout>
  );
}
