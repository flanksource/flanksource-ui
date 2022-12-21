import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { InfoMessage } from "../../components/InfoMessage";
import { useGetConfigChangesQueryById } from "../../api/query-hooks";
import { useEffect, useState } from "react";
import { ConfigTypeChanges } from "../ConfigChanges";

export function ConfigDetailsChanges({
  configId,
  id
}: {
  id: string;
  configId: string;
}) {
  const {
    data: historyData,
    isLoading,
    error
  } = useGetConfigChangesQueryById(configId!);

  const [changeDetails, setChangeDetails] = useState<ConfigTypeChanges[]>([]);

  useEffect(() => {
    setChangeDetails(historyData?.filter((item) => item.id === id) || []);
  }, [historyData, id]);

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <ConfigChangeHistory
      tableStyle={{ width: "auto" }}
      className=""
      data={changeDetails ?? []}
      isLoading={isLoading}
    />
  );
}
