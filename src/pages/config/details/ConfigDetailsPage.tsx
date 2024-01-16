import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../../api/query-hooks";
import { ConfigDetailsTabs } from "../../../components/Configs/ConfigDetailsTabs";
import { JSONViewer } from "../../../components/JSONViewer";
import { Loading } from "../../../components/Loading";
import { usePartialUpdateSearchParams } from "../../../hooks/usePartialUpdateSearchParams";
import useRunTaskOnPropChange from "../../../hooks/useRunTaskOnPropChange";

export function ConfigDetailsPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = usePartialUpdateSearchParams();
  const [checked, setChecked] = useState<Record<string, any>>({});
  const marginBottom = 24;
  const contentRef = useRef<HTMLDivElement>(null);
  const element = contentRef.current;
  const contentDivHeight = contentRef.current?.parentElement
    ? document.body.clientHeight -
      contentRef.current.parentElement.getBoundingClientRect().top -
      marginBottom
    : 0;

  useRunTaskOnPropChange(
    () => {
      return contentDivHeight;
    },
    () => {
      if (!element) {
        return;
      }
      element.parentElement?.style.setProperty(
        "max-height",
        `${contentDivHeight}px`
      );
    }
  );

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
    >
      <div
        className={`flex flex-col flex-1 p-6 pb-0 h-full relative`}
        ref={contentRef}
      >
        <div className="flex flex-row items-start bg-white h-full">
          <div className="flex flex-col w-full max-w-full h-full">
            {!isLoading ? (
              <div className="flex flex-row space-x-2 h-full">
                <div className="flex flex-col w-full object-contain h-full">
                  <div className="flex flex-col mb-6 w-full h-full">
                    <div className="flex relative pt-2 px-4 border-gray-300 bg-white flex-1 overflow-x-auto overflow-y-auto">
                      <JSONViewer
                        code={code}
                        format={format}
                        showLineNo
                        convertToYaml
                        onClick={handleClick}
                        selections={checked}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigDetailsTabs>
  );
}
