import React, { useEffect, useState } from "react";
import Convert from "ansi-to-html";
import dayjs from "dayjs";
// import createDOMPurify from "dompurify";
// import { JSDOM } from "jsdom";
import { getLogs } from "../../api/services/logs";
import { IncidentCreate } from "../Incidents/IncidentCreate";
import { Modal } from "../Modal";
import { Loading } from "../Loading";

export function LogsViewer() {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
  const convert = new Convert();
  const loadLogs = () => {
    setIsLoading(true);
    getLogs().then((res) => {
      if (res.data) {
        setLogs(res.data[0].results);
      }
      setIsLoading(false);
    });
  };

  const handleIncidentCreate = (response) => {
    if (response?.error) {
      console.error(response.error?.message);
    }
    if (response?.data?.status === 201) {
      console.log(response.data);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <>
      <div className="mx-auto flex flex-col justify-center">
        <div className="mt-4 w-full px-4">
          <div className="flex justify-between items-center pb-4">
            <button
              type="button"
              onClick={() => setIncidentModalIsOpen(true)}
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Incident
            </button>
          </div>
          <div className="pb-12">
            {!isLoading ? (
              <div className="flex flex-col">
                <div className="align-middle inline-block min-w-full">
                  <table
                    className="min-w-full divide-y divide-gray-300 border-separate"
                    style={{ borderSpacing: "0px" }}
                  >
                    <thead className="sticky top-0 bg-white">
                      <tr>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300 pr-5">
                          Timestamp
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300">
                          Message
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className="bg-white divide-y divide-gray-300"
                      style={{ fontSize: "0.75rem", lineHeight: "0.9rem" }}
                    >
                      {logs.map((row, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <tr key={idx}>
                          <td
                            className="border-b border-gray-100 no-wrap"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {row.timestamp}
                          </td>
                          <td
                            className="border-b border-gray-100"
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: convert.toHtml(
                                row.message ? row.message : ""
                              )
                            }}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <Loading text="fetching logs..." />
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        open={incidentModalIsOpen}
        onClose={() => setIncidentModalIsOpen(false)}
        cardClass="w-full"
        contentClass="h-full px-8"
        cardStyle={{
          maxWidth: "420px",
          maxHeight: "calc(100vh - 4rem)"
        }}
        closeButtonStyle={{
          padding: "2.2rem 2.1rem 0 0"
        }}
        hideActions
      >
        <IncidentCreate
          callback={(response) => {
            handleIncidentCreate(response);
            setIncidentModalIsOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
