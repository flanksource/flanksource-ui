import cx from "clsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillPlusCircle } from "react-icons/ai/";
import { getAllIncident } from "../../api/services/incident";
import { IncidentCreate } from "../../components/Incidents/IncidentCreate";
import { IncidentList } from "../../components/Incidents/IncidentList";
import { Modal } from "../../components/Modal";
import { SearchLayout } from "../../components/Layout";
import { Loading } from "../../components/Loading";
export function IncidentListPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [incidentModalIsOpen, setIncidentModalIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const loadIncidents = () => {
    setIsLoading(true);
    getAllIncident().then((res) => {
      setIncidents(res.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <>
      <SearchLayout
        title={
          <>
            <div className="flex my-auto pt-4">
              <span className="text-xl flex font-semibold">Incidents / </span>
              <div className="flex">
                <button
                  type="button"
                  className=""
                  onClick={() => setIncidentModalIsOpen(true)}
                >
                  <AiFillPlusCircle size={24} color="#326CE5" />
                </button>
              </div>
            </div>
          </>
        }
        onRefresh={loadIncidents}
        extra={<></>}
      >
        <div className="leading-1.21rel">
          <div className="flex-none flex-wrap space-x-2 space-y-2">
            <div className="max-w-screen-xl mx-auto flex flex-col justify-center">
              {!isLoading ? (
                <IncidentList list={incidents || []} />
              ) : (
                <Loading text="fetching incidents" />
              )}
            </div>
          </div>
        </div>
      </SearchLayout >

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
            navigate(`/incidents/${response.id}`, { replace: true });
          }}
        />
      </Modal>
    </>
  );
}
