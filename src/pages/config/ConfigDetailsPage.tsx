import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useSearchParams, useOutletContext } from "react-router-dom";
import { ConfigItem, getConfig } from "../../api/services/configs";
import { EvidenceType } from "../../api/services/evidence";
import { AttachEvidenceDialog } from "../../components/AttachEvidenceDialog";
import { BreadcrumbNav } from "../../components/BreadcrumbNav";
import { Button } from "../../components/Button";
import { JSONViewer } from "../../components/JSONViewer";
import { Loading } from "../../components/Loading";
import { toastError } from "../../components/Toast/toast";

export function ConfigDetailsPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showIncidentModal] = useState(false);
  const [attachAsAsset, setAttachAsAsset] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [checked, setChecked] = useState({});
  const [configDetails, setConfigDetails] = useState<ConfigItem | undefined>();
  // @ts-ignore
  const { setTitle, setTabRight } = useOutletContext();

  useEffect(() => {
    getConfig(id!)
      .then((res) => {
        const data = res?.data?.[0];
        setConfigDetails(data);
        setTitle(
          <BreadcrumbNav
            list={[
              { to: "/configs", title: "Config" },
              <b key="title">{data?.name}</b>
            ]}
          />
        );
      })
      .catch((err) => toastError(err))
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!(configDetails as any)?.config) {
      return;
    }

    const selected = params.getAll("selected");
    setChecked(Object.fromEntries(selected.map((x) => [x, true])));
  }, [params, configDetails]);

  useEffect(() => {
    const selected = Object.keys(checked);
    setParams({ selected });
  }, [checked]);

  const handleClick = useCallback((idx: any) => {
    setChecked((checked) => {
      const obj = { ...checked };
      // @ts-ignore
      if (obj[idx]) {
        // @ts-ignore
        delete obj[idx];
      } else {
        // @ts-ignore
        obj[idx] = true;
      }
      return obj;
    });
  }, []);

  const code = useMemo(
    () =>
      // @ts-ignore
      configDetails?.config && JSON.stringify(configDetails.config, null, 2),
    [configDetails]
  );

  // TODO(ciju): make this lazy. Only needed for IncidentCreate.
  const configLines = useMemo(() => code && code.split("\n"), [code]);

  const selectedCount = Object.keys(checked).length;

  let selectionControls = (
    <div className="flex flex-row space-x-2">
      {selectedCount > 0 && (
        <>
          <div className="flex items-center mx-4">
            {selectedCount} lines selected
          </div>
          <Button
            className="btn-secondary"
            text="Clear"
            onClick={() => {
              setChecked({});
              return Promise.resolve();
            }}
          />
        </>
      )}
      <button
        type="button"
        onClick={() => {
          setAttachAsAsset(true);
          setDialogKey(Math.floor(Math.random() * 1000));
        }}
        className="btn-primary"
      >
        Attach to Incident
      </button>
    </div>
  );

  useEffect(() => {
    setTabRight(selectionControls);
    return () => setTabRight(null);
  }, [checked, showIncidentModal]);

  return (
    <div className="flex flex-row items-start space-x-2 ">
      <div className="flex flex-col w-full max-w-full">
        {!isLoading ? (
          <div className="flex flex-row space-x-2 p-2">
            <div className="flex flex-col w-full object-contain">
              {configDetails && (
                <div className="flex flex-col p-2">
                  <div className="block py-6 px-4 border-gray-300 bg-white rounded shadow">
                    <div className="block text-lg tracking-wide">
                      <span className="font-semibold">Name:</span>{" "}
                      {configDetails.name}
                    </div>
                    {configDetails.tags &&
                      Object.entries(configDetails.tags)
                        .filter(([key]) => key !== "Name")
                        .map(([key, value]) => (
                          <>
                            {/* @ts-ignore */}
                            <div
                              key={key}
                              className="block text-lg tracking-wide"
                            >
                              <span className="font-semibold">{key}:</span>
                              {value}
                            </div>
                          </>
                        ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col p-2 mb-6 w-full">
                <div className="flex relative py-6 px-4 border-gray-300 bg-white rounded shadow-md flex-1 overflow-x-auto">
                  <JSONViewer
                    code={code}
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
        key={`link-${dialogKey}`}
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
  );
}
