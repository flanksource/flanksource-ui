import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useGetConfigByIdQuery } from "../../api/query-hooks";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../../components/AttachEvidenceDialog";
import { ConfigsDetailsBreadcrumbNav } from "../../components/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import ConfigSidebar from "../../components/ConfigSidebar";
import { ConfigDetailsSelectedLinesControls } from "../../components/ConfigsPage/ConfigDetailsSelectedLinesControls";
import { ConfigsPageTabs } from "../../components/ConfigsPage/ConfigsPageTabs";
import { Head } from "../../components/Head/Head";
import { JSONViewer } from "../../components/JSONViewer";
import { SearchLayout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
import { usePartialUpdateSearchParams } from "../../hooks/usePartialUpdateSearchParams";

export function ConfigDetailsPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = usePartialUpdateSearchParams();
  const [attachAsAsset, setAttachAsAsset] = useState(false);
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
    if (!configDetails?.config) {
      return "";
    }
    if (configDetails?.config?.content != null) {
      return configDetails?.config.content;
    }

    const ordered = Object.keys(configDetails.config)
      .sort()
      .reduce((obj: Record<string, any>, key) => {
        obj[key] = configDetails.config[key];
        return obj;
      }, {});

    return configDetails?.config && JSON.stringify(ordered, null, 2);
  }, [configDetails]);

  const format = useMemo(
    () =>
      configDetails?.config.format != null
        ? configDetails?.config.format
        : "json",
    [configDetails]
  );

  // TODO(ciju): make this lazy. Only needed for IncidentCreate.
  const configLines = useMemo(() => code && code.split("\n"), [code]);

  const selectedCount = Object.keys(checked).length;

  return (
    <>
      <Head prefix={configDetails ? `Config - ${configDetails.name}` : ""} />
      <SearchLayout
        title={
          <div className="flex space-x-2">
            <span className="text-lg">
              <ConfigsDetailsBreadcrumbNav config={configDetails} />
            </span>
          </div>
        }
        onRefresh={() => refetch()}
        loading={isLoading}
        contentClass="p-0 h-full"
      >
        <div className={`flex flex-row min-h-full h-auto`}>
          <div
            className={`flex flex-col flex-1 p-6 pb-0 min-h-full h-auto overflow-auto`}
          >
            <ConfigsPageTabs
              basePath={`configs/${id}`}
              tabRight={
                <ConfigDetailsSelectedLinesControls
                  selectedCount={selectedCount}
                  setAttachAsAsset={setAttachAsAsset}
                  setChecked={setChecked}
                />
              }
            />
            <div className="flex flex-row items-start bg-white">
              <div className="flex flex-col w-full max-w-full">
                {!isLoading ? (
                  <div className="flex flex-row space-x-2">
                    <div className="flex flex-col w-full object-contain">
                      <div className="flex flex-col mb-6 w-full">
                        <div className="flex relative py-6 px-4 border-gray-300 bg-white rounded shadow-md flex-1 overflow-x-auto">
                          <JSONViewer
                            code={code}
                            format={format}
                            showLineNo
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

              <AttachEvidenceDialog
                key={`attach-evidence-dialog`}
                isOpen={attachAsAsset}
                onClose={() => setAttachAsAsset(false)}
                config_id={id}
                evidence={{
                  lines: configLines,
                  configName: configDetails?.name,
                  configType: configDetails?.config_type,
                  selected_lines: Object.fromEntries(
                    Object.keys(checked).map((n) => [n, configLines[n]])
                  )
                }}
                type={EvidenceType.Config}
                callback={(_: any) => {
                  setChecked({});
                }}
              />
            </div>
          </div>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
