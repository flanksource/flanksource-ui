import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { createEvidence } from "../../../api/services/evidence";
import { getAllHypothesisByIncident } from "../../../api/services/hypothesis";
import { getAllIncident } from "../../../api/services/incident";
import { useUser } from "../../../context";
import { Dropdown } from "../../Dropdown";
import { TextInput } from "../../TextInput";

const incidentSelectionsTemplate = {
  // new: {
  //   id: "dropdown-incident-new",
  //   name: "new",
  //   description: "New Incident",
  //   icon: <BiPlus />,
  //   value: "new"
  // }
};

const evidenceTypeItems = {
  log: {
    id: "dropdown-type-log",
    name: "log",
    description: "Log",
    value: "log"
  }
};

export function LogsIncidentLinker({ selectedLogs, callback, ...rest }) {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      incident: "new",
      hypothesis: null,
      type: "log",
      description: ""
    }
  });
  const selectedIncident = watch("incident");
  const user = useUser();
  const [incidentsList, setIncidentsList] = useState([]);
  const [hypothesisList, setHypothesisList] = useState([]);
  const [isLoading, setIsLoading] = useState({
    incident: true,
    hypothesis: false,
    submit: false
  });

  const getIncidentSelections = (list) => ({
    ...incidentSelectionsTemplate,
    ...list.reduce((acc, incident) => {
      acc[incident.id] = {
        id: `dropdown-incident-${incident.id}`,
        name: incident.id,
        description:
          incident?.title?.length > 0 ? incident.title : "(no title)",
        value: incident.id
      };
      return acc;
    }, {})
  });

  const getHypothesisSelections = (list) =>
    list.reduce((acc, hypothesis) => {
      acc[hypothesis.id] = {
        id: `dropdown-hypothesis-${hypothesis.id}`,
        name: hypothesis.id,
        description:
          hypothesis?.title?.length > 0 ? hypothesis.title : "(no title)",
        value: hypothesis.id
      };
      return acc;
    }, {});

  // fetch incidents on mount
  useEffect(() => {
    getAllIncident().then((res) => {
      if (res?.data?.length > 0) {
        setValue("incident", res.data[0]?.id);
      }
      setIncidentsList(res.data);
      setIsLoading((previous) => ({ ...previous, incident: false }));
    });
  }, [setValue]);

  // fetch hypotheses on incident selection
  useEffect(() => {
    setHypothesisList([]);
    if (selectedIncident !== "new") {
      setIsLoading((previous) => ({ ...previous, hypothesis: true }));
      getAllHypothesisByIncident(selectedIncident)
        .then((res) => {
          if (res?.data?.length > 0) {
            setValue("hypothesis", res.data[0]?.id);
          }
          setHypothesisList(res.data);
        })
        .finally(() => {
          setIsLoading((previous) => ({ ...previous, hypothesis: false }));
        });
    }
  }, [selectedIncident, setValue]);

  const onSubmit = (data) => {
    setIsLoading((previous) => ({ ...previous, submit: true }));
    createEvidence(
      user,
      uuidv4,
      data.hypothesis,
      JSON.stringify(selectedLogs),
      {
        type: data.type,
        description: data.description
      }
    )
      .then(() => {
        callback(true);
      })
      .catch(() => {
        callback(false);
      })
      .finally(() => {
        setIsLoading((previous) => ({ ...previous, submit: false }));
      });
  };

  return (
    <div className={`py-7 ${rest.className || ""}`} {...rest}>
      <div className="text-xl font-medium text-gray-800 mb-6">
        Link{selectedLogs?.length > 1 ? ` ${selectedLogs?.length}` : ""} log
        {selectedLogs?.length > 1 && "s"} to Incident
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Controller
            control={control}
            name="description"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <TextInput
                  label="Evidence description"
                  id="description"
                  className="w-full"
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
          <p className="text-red-600 text-sm">{errors.description?.message}</p>
        </div>
        <div className="mb-6">
          <Dropdown
            control={control}
            label="Type"
            name="type"
            className="w-full"
            items={evidenceTypeItems}
          />
          <p className="text-red-600 text-sm">{errors.type?.message}</p>
        </div>
        <div className="w-full border-b mb-4" />
        <div className="mb-4">
          {isLoading.incident ? (
            <div className="text-sm text-gray-400 mb-4">
              Loading incidents...
            </div>
          ) : (
            <Dropdown
              control={control}
              label="Incident"
              name="incident"
              className="w-full"
              items={getIncidentSelections(incidentsList)}
            />
          )}
        </div>
        {selectedIncident !== "new" &&
          (isLoading.hypothesis && hypothesisList?.length <= 0 ? (
            <div className="text-sm text-gray-400 mb-4">
              Loading hypotheses...
            </div>
          ) : (
            <div className="mb-4">
              <Dropdown
                control={control}
                label="Hypothesis"
                name="hypothesis"
                className="w-full"
                items={getHypothesisSelections(hypothesisList)}
              />
            </div>
          ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              isLoading.incident || isLoading.hypothesis || isLoading.submit
            }
            className={`${
              !isLoading.incident && !isLoading.hypothesis && !isLoading.submit
                ? "text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                : "text-gray-400 bg-gray-200"
            } inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {isLoading.submit ? "Adding.." : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
