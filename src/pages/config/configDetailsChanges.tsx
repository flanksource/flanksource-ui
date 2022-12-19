import { useParams } from "react-router-dom";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { InfoMessage } from "../../components/InfoMessage";
import { ConfigLayout } from "../../components/Layout";
import { ConfigsDetailsBreadcrumbNav } from "../../components/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import { useGetConfigChangesQueryById } from "../../api/query-hooks";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();

  const {
    data: historyData,
    isLoading,
    error
  } = useGetConfigChangesQueryById(id!);

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <ConfigLayout
      basePath={`configs/${id}`}
      isConfigDetails
      title={<ConfigsDetailsBreadcrumbNav configId={id} />}
      isLoading={isLoading}
    >
      <div className="flex flex-col items-start">
        <ConfigChangeHistory data={historyData ?? []} isLoading={isLoading} />
      </div>
    </ConfigLayout>
  );
}
