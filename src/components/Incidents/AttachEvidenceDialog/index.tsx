import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createIncidentQueryKey } from "../../../api/query-hooks";
import { createEvidence } from "../../../api/services/evidence";
import {
  createHypothesis,
  searchHypothesis
} from "../../../api/services/hypothesis";
import { createIncident, searchIncident } from "../../../api/services/incident";
import {
  Hypothesis,
  HypothesisStatus,
  NewHypothesis
} from "../../../api/types/hypothesis";
import { IncidentSeverity, IncidentStatus } from "../../../api/types/incident";
import { useUser } from "../../../context";
import { Events, sendAnalyticEvent } from "../../../services/analytics";
import { IItem } from "../../../types/IItem";
import SelectDropdown from "../../../ui/Dropdowns/SelectDropdown";
import { TextInput } from "../../../ui/FormControls/TextInput";
import { Modal } from "../../../ui/Modal";
import { DropdownWithActions } from "../../Dropdown/DropdownWithActions";
import { toastSuccess } from "../../Toast/toast";
import { IncidentSeverityTag } from "../IncidentSeverityTag";
import { IncidentStatusTag } from "../IncidentStatusTag";
import { severityItems, typeItems } from "../data";

interface Props {
  title?: string;
  config_id?: string;
  config_change_id?: string;
  config_analysis_id?: string;
  component_id?: string;
  check_id?: string;
  disabled?: boolean;
  selectedLogs?: any;
  callback?: (success: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface IOptionItem {
  id: string;
  title?: string;
  [k: string]: any;
}

function toOpts<T>(ls: IOptionItem[], extraProps?: (k: any) => T) {
  return ls.map((x) => {
    return {
      description: x.title || "(no title)",
      value: x.id,
      ...(extraProps ? extraProps(x) : {})
    } as IItem & T;
  });
}

interface IExtendedItem extends IItem {
  details: {
    rootId: string;
    severity: IncidentSeverity;
    status: IncidentStatus;
    type: string;
  };
}

interface IFormValues {
  title: string;
  severity: IncidentSeverity | string;
  type: string;
  incident?: IExtendedItem;
  hypothesis?: IItem;
  description?: string;
}

const IncidentOption = ({ option }: any) => {
  if (!option.details) {
    return (
      <div className="text-gray-900">
        <b>{option.value}</b>
        <div className="text-gray-400 text-xs">Create new {option.value}</div>
      </div>
    );
  }
  return (
    <div className="flex space-x-4 justify-between w-full">
      <div className="flex space-x-4">
        <IncidentSeverityTag iconOnly severity={option.details.severity} />
        <div>{option?.description}</div>
      </div>
      <IncidentStatusTag status={option.details.status} />
    </div>
  );
};

/* Can't mention nested sybling properpty in when condition, in yup. See
https://github.com/jquense/yup/issues/935. So, we check reference sybling
(`incident`) in hypothesis, instead of `incident.id` in hypothesis.id.
Rudamentary hacky checks like if it's a new incident, show differnt error
message than if an incident is selected. */
const validationSchema = yup
  .object({
    description: yup.string(),
    incident: yup
      .object()
      .shape({
        value: yup.string().nullable(),
        description: yup.string()
      })
      .test("is-incident", "Must select or create an incident", (incident) => {
        return Boolean(incident?.value || incident?.description);
      }),
    hypothesis: yup
      .object()
      .shape({
        value: yup.string(),
        description: yup.string()
      })
      .when("incident", (incident) => {
        if (incident?.__isNew__ || !incident?.value) {
          return yup.object().shape({
            description: yup.string()
          });
        }
        return yup.object().shape({
          value: yup.string().nullable(),
          description: yup
            .string()
            .required("Must select or create a hypothesis")
        });
      }),
    severity: yup.string().required("Please select incident severity"),
    type: yup.string().required("Please select an incident type")
  })
  .required();

export const severityOptions = Object.entries(severityItems).map(
  ([_, { value, description, icon }]) => ({
    value,
    label: description,
    icon
  })
);

export const typeOptions = Object.entries(typeItems).map(
  ([_, { value, description, icon }]) => ({
    value,
    label: description,
    icon
  })
);

export function AttachEvidenceDialog({
  title = "Link to Incident",
  config_id,
  check_id,
  config_change_id,
  config_analysis_id,
  component_id,
  evidence: evidenceAttachment,
  type,
  callback = () => {},
  isOpen,
  onClose
}: Props & Partial<Record<string, any>>) {
  const client = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<IFormValues>({
    defaultValues: {
      title: "",
      hypothesis: {
        value: null,
        description: ""
      },
      incident: {
        value: null,
        description: ""
      },
      type: typeItems.availability.value,
      severity: IncidentSeverity.Low
    },
    resolver: yupResolver(validationSchema)
  });

  /* @ts-ignore:next-line */
  const selectedHypothesis = watch("hypothesis");
  /* @ts-ignore:next-line */
  const selectedIncident = watch("incident");

  const watchType = watch("type");
  const watchSeverity = watch("severity");

  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newIncidentCreated, setNewIncidentCreated] = useState<boolean>(true);

  useEffect(() => {
    setValue("hypothesis", undefined);
    if (!selectedIncident?.value) {
      return;
    }
    setNewIncidentCreated(!!(selectedIncident as any).__isNew__);
  }, [selectedIncident, setValue]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [isOpen, reset]);

  const fetchIncidentOptions = useCallback((query: string) => {
    const fn = async (query: string): Promise<IExtendedItem[]> => {
      const { data, error } = await searchIncident(query || "");

      if (error || !Array.isArray(data)) {
        console.error(error || "No data?");
        return [];
      }
      return toOpts(data, (x) => ({
        details: {
          rootId: x.hypotheses?.find((h: Hypothesis) => h.type === "root")?.id,
          status: x.status,
          type: x.type,
          severity: x.severity
        }
      }));
    };
    return fn(query);
  }, []);

  const fetchHypothesisOptions = async (
    query: string,
    incident: any
  ): Promise<IItem[]> => {
    if (!incident.details) {
      return Promise.resolve([]);
    }

    const { data, error } = await searchHypothesis(
      incident?.value as string,
      query || ""
    );
    if (error || !Array.isArray(data)) {
      console.error(error || "No data?");
      return [];
    }
    const hypotheses = toOpts(data);
    if (hypotheses.length === 1) {
      setValue("hypothesis", hypotheses[0]);
    }
    return hypotheses;
  };

  const onSubmit = async (data: IFormValues) => {
    if (!user) return;
    let { hypothesis: hypothesisData, incident: incidentData } = data;
    let incidentId = incidentData?.value as string;
    let hypothesisId = hypothesisData?.value as string;

    const isNewIncident = (incidentData as any).__isNew__;
    const isNewHypothesis = (hypothesisData as any).__isNew__;
    setIsSubmitting(true);

    if (isNewIncident) {
      const { data: incidentResp, error } = await createIncident(user, {
        title: incidentData?.description || "",
        severity: data.severity,
        type: data.type,
        description: ""
      });

      if (error || !incidentResp) {
        console.error("Incident creation failed", incidentResp);
        return;
      }

      incidentId = incidentResp.id;
    }

    if (
      isNewHypothesis ||
      (!hypothesisData?.value && !hypothesisData?.description)
    ) {
      const params: NewHypothesis = {
        user,
        incident_id: incidentId,
        title: hypothesisData?.description || incidentData?.description,
        status: HypothesisStatus.Possible,
        type: "root"
      };

      const res = await createHypothesis(params);

      if (res.error || !res.data) {
        console.error("Error hypothesis", res.data, res.error);
        return;
      }

      hypothesisId = res.data.id;
    }

    const evidence = {
      user,
      check_id,
      config_id,
      config_change_id,
      config_analysis_id,
      component_id,
      hypothesisId: hypothesisId,
      evidence: evidenceAttachment,
      type,
      description: data.description ?? ""
    };

    try {
      await createEvidence(evidence);
      sendAnalyticEvent(Events.AttachEvidenceToIncident);
      toastSuccess(
        <div>
          Linked to{" "}
          <Link className="link" to={`/incidents/${incidentId}`}>
            {" "}
            incident
          </Link>{" "}
          successfully
        </div>,
        { position: "top-right", duration: 5000 }
      );
      await client.invalidateQueries({
        queryKey: createIncidentQueryKey(incidentId)
      });
      callback(true);
    } catch (e) {
      callback(false);
    } finally {
      setIsSubmitting(false);
      onClose();
      reset();
    }
  };

  return (
    <Modal
      title={
        <div className="text-xl font-medium text-gray-800">
          {title || "Link to Incident"}
        </div>
      }
      open={isOpen}
      onClose={onClose}
      size="small"
    >
      <div className="pt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-8">
            <div className="mb-4">
              <div className="form-label">Incident</div>
              <DropdownWithActions
                onQuery={fetchIncidentOptions}
                label="Incident"
                name="incident"
                value={selectedIncident}
                setValue={setValue}
                creatable={true}
                displayOption={IncidentOption}
              />
              <p className="text-red-600 text-sm">{errors.incident?.message}</p>
              <div className="pt-4">
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Description"
                      id="description"
                      className="w-full"
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                <p className="text-red-600 text-sm">
                  {errors.description?.message}
                </p>
              </div>
              {newIncidentCreated && (
                <div className="space-y-2 pt-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 mb-1 mr-4 w-16">
                      Type
                    </span>
                    <SelectDropdown
                      name="type"
                      className="w-full"
                      options={typeOptions}
                      value={watchType}
                      onChange={(e) => {
                        if (!e) return;
                        setValue("type", e);
                      }}
                    />
                    <p className="text-red-600 text-sm">
                      {errors.type?.message}
                    </p>
                  </div>
                </div>
              )}
              {newIncidentCreated && (
                <div className="space-y-2 pt-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 mb-1 mr-4 w-16">
                      Severity
                    </span>
                    <SelectDropdown
                      name="severity"
                      className="w-full"
                      options={severityOptions}
                      value={watchSeverity}
                      onChange={(e) => {
                        if (!e) return;
                        setValue("severity", e);
                      }}
                    />
                    <p className="text-red-600 text-sm">
                      {errors.severity?.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="form-label">Hypothesis</div>
              <DropdownWithActions
                onQuery={(e) => {
                  return fetchHypothesisOptions(e, watch("incident"));
                }}
                label="Hypothesis"
                name="hypothesis"
                value={selectedHypothesis}
                setValue={setValue}
                creatable={true}
                displayOption={({ option }) =>
                  option?.description || option?.value
                }
                dependentValue={selectedIncident?.value}
              />
              <p className="text-red-600 text-sm">
                {/* @ts-ignore:next-line */}
                {errors.hypothesis?.description?.message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end mt-4 py-4 px-8 rounded-t-lg bg-gray-100">
            <button
              type="submit"
              className={`${
                !isSubmitting
                  ? "text-white bg-blue-600 hover:bg-blue-700"
                  : "text-gray-400 bg-gray-200"
              } rounded font-medium p-2 px-4 shadow-sm transition`}
            >
              {isSubmitting ? "Linking.." : "Link"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
