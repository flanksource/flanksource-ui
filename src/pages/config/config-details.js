import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useOutletContext
} from "react-router-dom";
import { toastError } from "../../components/Toast/toast";
import { Modal } from "../../components/Modal";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { getConfig } from "../../api/services/configs";
import { Loading } from "../../components/Loading";
import { JSONViewer } from "../../components/JSONViewer";

export function ConfigDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [checked, setChecked] = useState({});
  const [configDetails, setConfigDetails] = useState();
  const { setTitle } = useOutletContext();

  useEffect(() => {
    getConfig(id)
      .then((res) => {
        const data = res?.data[0];
        setConfigDetails(data);
        setTitle(
          <span className="text-lg">
            Config details for <b>{data?.name}</b>
          </span>
        );
      })
      .catch((err) => toastError(err))
      .finally(() => {
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!configDetails?.config) {
      return;
    }

    const selected = params.getAll("selected");
    setChecked(Object.fromEntries(selected.map((x) => [x, true])));
  }, [params, configDetails]);

  const handleClick = (idx) => {
    setChecked((checked) => {
      const obj = { ...checked };
      if (obj[idx]) {
        delete obj[idx];
      } else {
        obj[idx] = true;
      }

      const selected = Object.keys(obj);
      setParams({ selected });
      return obj;
    });
  };

  const handleShare = () => {
    const { href } = window.location;
    const copyString = `${href}`;
    if (window.isSecureContext) {
      navigator.clipboard.writeText(copyString).then(() => {
        toast("Copied to clipboard");
      });
    } else {
      toastError(
        "Unable to copy to clipboard due to lack of HTTPS. Please contact the system administrator about this issue."
      );
    }
  };

  const code = useMemo(
    () =>
      configDetails?.config && JSON.stringify(configDetails.config, null, 2),
    [configDetails]
  );

  // TODO(ciju): make this lazy. Only needed for IncidentCreate.
  const configLines = useMemo(() => code && code.split("\n"), [code]);

  const selectedCount = Object.keys(checked).length;

  return (
    <div className="flex flex-col items-start">
      <div className="mb-4 flex flex-row iems-center">
        {selectedCount > 0 && (
          <>
            <div className="flex items-center mx-4">
              {selectedCount} lines selected
            </div>
            <button
              className="border rounded-md px-3 py-1 mr-2 text-sm"
              type="button"
              onClick={() => {
                setChecked({});
                setParams({ selected: null });
              }}
            >
              Clear
            </button>
            <button
              className="border rounded-md px-3 py-1 mr-2 text-sm"
              type="button"
              onClick={() => {
                handleShare();
              }}
            >
              Share
            </button>
            <button
              className="border rounded-md px-3 py-1 text-sm"
              type="button"
              onClick={() => setShowIncidentModal(true)}
            >
              Create Incident
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col w-full border rounded-md rounded-tl-none">
        {!isLoading ? (
          <JSONViewer
            code={code}
            showLineNo
            onClick={handleClick}
            selections={checked}
          />
        ) : (
          <div className="h-32 flex items-center justify-center">
            <Loading />
          </div>
        )}
      </div>

      <Modal
        open={showIncidentModal}
        onClose={() => setShowIncidentModal(false)}
        size="small"
        title="Create New Incident from Selected Evidence"
      >
        <IncidentCreate
          callback={(response) => {
            navigate(`/incidents/${response.id}`, { replace: true });
          }}
          evidence={{
            configId: id,
            configName: configDetails?.name,
            config: configLines,
            type: "config",
            lines: Object.fromEntries(
              Object.keys(checked).map((n) => [n, configLines[n]])
            )
          }}
        />
      </Modal>
    </div>
  );
}
