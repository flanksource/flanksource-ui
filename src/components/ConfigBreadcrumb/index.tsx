import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getConfigName } from "../../api/services/configs";
import { BreadcrumbNav } from "../BreadcrumbNav";
import { Icon } from "../Icon";

type ConfigBreadcrumbProps = {
  setTitle: (child: React.ReactNode) => void;
};

export function ConfigBreadcrumb({ setTitle }: ConfigBreadcrumbProps) {
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setTitle(<BreadcrumbNav list={["Config"]} />);
      return;
    }

    getConfigName(id)
      .then((res) => {
        const data = res?.data?.[0];
        setTitle(
          <BreadcrumbNav
            list={[
              { to: "/configs", title: "Config" },
              <span>
                <Icon
                  name={data?.type || data?.config_class}
                  className="h-5 mr-1"
                />
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
