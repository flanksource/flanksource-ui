import { useGetConfigByIdQuery } from "@flanksource-ui/api/query-hooks";
import { ConfigDetailsTabs } from "@flanksource-ui/components/Configs/ConfigDetailsTabs";
import { Loading } from "@flanksource-ui/components/Loading";
import { usePartialUpdateSearchParams } from "@flanksource-ui/hooks/usePartialUpdateSearchParams";
import { JSONViewer } from "@flanksource-ui/ui/JSONViewer";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export function ConfigDetailsPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = usePartialUpdateSearchParams();
  const [checked, setChecked] = useState<Record<string, any>>({});

  const {
    isLoading,
    data: configDetails,
    refetch
  } = useGetConfigByIdQuery(id!);

  useEffect(() => {
    if (!configDetails?.config) {
      return;
    }

    const selected = searchParams.getAll("selected");
    setChecked(Object.fromEntries(selected.map((x) => [x, true])));
  }, [searchParams, configDetails]);

  useEffect(() => {
    const selected = Object.keys(checked);
    setSearchParams({ selected });
  }, [checked, setSearchParams]);

  const handleClick = useCallback((idx: any) => {
    setChecked((checked) => {
      const obj = { ...checked };
      if (obj[idx]) {
        delete obj[idx];
      } else {
        obj[idx] = true;
      }
      return obj;
    });
  }, []);

  const code = useMemo(() => {
    if (configDetails === null || !configDetails?.config) {
      return "";
    }
    if (configDetails?.config?.content != null) {
      return configDetails?.config.content;
    }

    const ordered = Object.keys(configDetails.config)
      .sort()
      .reduce((obj: Record<string, any>, key) => {
        if (configDetails.config) {
          obj[key] = configDetails.config[key];
        }
        return obj;
      }, {});

    return configDetails?.config && JSON.stringify(ordered, null, 2);
  }, [configDetails]);

  const format = useMemo(
    () =>
      configDetails?.config?.format != null
        ? configDetails?.config.format
        : "json",
    [configDetails]
  );

  return (
    <ConfigDetailsTabs
      pageTitlePrefix={"Catalog Changes"}
      isLoading={isLoading}
      refetch={refetch}
      activeTabName="Catalog"
      className=""
    >
      <div className={`flex flex-col flex-1 pb-0 h-full relative`}>
        {!isLoading ? (
          <div className="flex flex-col w-full relative pt-2 border-gray-300 bg-white flex-1 overflow-x-auto overflow-y-auto">
            <JSONViewer
              code={code}
              format={format}
              showLineNo
              convertToYaml
              onClick={handleClick}
              selections={checked}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </ConfigDetailsTabs>
  );
}
