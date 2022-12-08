import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getConfigChange } from "../../api/services/configs";
import { toastError } from "../../components/Toast/toast";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    getConfigChange(id!)
      .then((res) => {
        if (res.data.length === 0) {
          setHistoryData([]);
        } else {
          setHistoryData(res?.data);
        }
      })
      .catch((err) => toastError(err))
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="flex flex-col items-start">
      <ConfigChangeHistory data={historyData} isLoading={isLoading} />
    </div>
  );
}
