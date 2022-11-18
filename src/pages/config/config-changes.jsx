import React, { useState } from "react";
import { getAllChanges } from "../../api/services/configs";

import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { toastError } from "../../components/Toast/toast";

export function ConfigChangesPage() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useState(() => {
    setLoading(true);
    getAllChanges()
      .then((res) => {
        setData(res?.data?.length === 0 ? [] : res?.data);
      })
      .catch((err) => toastError(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <ConfigChangeHistory data={data} isLoading={isLoading} linkConfig />;
}
