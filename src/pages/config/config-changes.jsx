import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { getAllChanges } from "../../api/services/configs";

import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { toastError } from "../../components/Toast/toast";
import { BreadcrumbNav } from "../../components/BreadcrumbNav";

export function ConfigChangesPage() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { setTitle } = useOutletContext();

  useState(() => {
    setLoading(true);
    getAllChanges()
      .then((res) => {
        setData(res?.data?.length === 0 ? [] : res?.data);
        setTitle(<BreadcrumbNav list={["Config"]} />);
      })
      .catch((err) => toastError(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return <ConfigChangeHistory data={data} isLoading={isLoading} linkConfig />;
}
