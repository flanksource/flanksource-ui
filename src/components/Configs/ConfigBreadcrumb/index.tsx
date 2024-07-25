import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getConfigName } from "../../../api/services/configs";
import { BreadcrumbNav } from "../../../ui/BreadcrumbNav";
import { ConfigIcon } from "../../../ui/Icons/ConfigIcon";

type ConfigBreadcrumbProps = {
  setTitle: (child: React.ReactNode) => void;
};

export function ConfigBreadcrumb({ setTitle }: ConfigBreadcrumbProps) {
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setTitle(<BreadcrumbNav list={["Catalog"]} />);
      return;
    }

    getConfigName(id)
      .then((res) => {
        const data = res?.data?.[0];
        setTitle(
          <BreadcrumbNav
            list={[
              { to: "/catalog", title: "Catalog" },
              <span key={data?.id}>
                <ConfigIcon config={data} className="mr-1 h-5" />
                {data?.name}
              </span>
            ]}
          />
        );
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return null;
}
