import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { createEvidence } from "../../api/services/evidence";
import {
  createHypothesis,
  Hypothesis,
  HypothesisNodeType,
  HypothesisStatus,
  searchHypothesis
} from "../../api/services/hypothesis";
import {
  createIncident,
  searchIncident,
  IncidentSeverity,
  IncidentStatus
} from "../../api/services/incident";
import { useUser } from "../../context";
import { EvidenceAttachment } from "../../api/services/evidence";
import { TextInput } from "../TextInput";
import { Modal } from "../Modal";
import { DropdownWithActions } from "../Dropdown/DropdownWithActions";
import { INCIDENT_SEVERITY_OPTIONS } from "../../constants/incidentOptions";
import { RadioOptionsGroup } from "../RadioOptionsGroup";
import { IncidentStatusTag } from "../IncidentStatusTag";
import { IncidentSeverityTag } from "../IncidentSeverityTag";
import { IItem } from "../../types/IItem";
import { toastSuccess } from "../Toast/toast";
import { Link } from "react-router-dom";

interface Props {
  title: string;
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
  };
}

interface IFormValues {
  title: string;
  severity: IncidentSeverity;
  incident?: IExtendedItem;
  hypothesis?: IItem;
  description?: string;
}

/* Can't mention nested sybling properpty in when condition, in yup. See
https://github.com/jquense/yup/issues/935. So, we check reference sybling
(`incident`) in hypothesis, instead of `incident.id` in hypothesis.id.
Rudamentary hacky checks like if it's a new incident, show differnt error
message than if an incident is selected. */
const validationSchema = yup
  .object({
    description: yup.string().required(),
    incident: yup
      .object()
      .shape({
        value: yup.string().nullable(),
        description: yup.string()
      })
      .test(
        "is-incident",
        "Please search and select an incident or fill title to create one.",
        (incident) => {
          return Boolean(incident?.value || incident?.description);
        }
      ),
    hypothesis: yup
      .object()
      .shape({
        value: yup.string(),
        description: yup.string()
      })
      .when("incident", (incident) => {
        if (!incident?.value) {
          return yup.object().shape({
            description: yup
              .string()
              .required("Please fill a title for the hypothesis.")
          });
        }
        return yup.object().shape({
          value: yup.string().nullable(),
          description: yup
            .string()
            .required(
              "Please select a hypothesis or fill title to create a new one."
            )
        });
      }),
    severity: yup.number().when("incident.value", (value) => {
      if (!value)
        return yup
          .mixed()
          .oneOf([
            IncidentSeverity.Low,
            IncidentSeverity.Medium,
            IncidentSeverity.High
          ]);
      return yup.number().nullable();
    })
  })
  .required();

export function AttachEvidenceDialog({
  title,
  evidence: evidenceAttachment,
  type,
  callback = () => {},
  isOpen,
  onClose
}: Props & Partial<EvidenceAttachment>) {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
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
      severity: IncidentSeverity.Low
    },
    resolver: yupResolver(validationSchema)
  });

  /* @ts-ignore:next-line */
  const selectedHypothesis = watch("hypothesis");
  /* @ts-ignore:next-line */
  const selectedIncident = watch("incident");

  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIncidentOptions = useCallback((query: string) => {
    const fn = async (query: string): Promise<IExtendedItem[]> => {
      const { data, error } = await searchIncident(query || "");

      if (error || !Array.isArray(data)) {
        console.error(error || "No data?");
        return [];
      }
      return toOpts(data, (x) => ({
        details: {
          rootId: x.hypothesis?.find(
            (h: Hypothesis) => h.type === HypothesisNodeType.Root
          )?.id,
          status: x.status,
          severity: x.severity
        }
      }));
    };
    return fn(query);
  }, []);

  const fetchHypothesisOptions = async (query: string): Promise<IItem[]> => {
    if (!selectedIncident?.value) {
      return [];
    }

    const { data, error } = await searchHypothesis(
      selectedIncident?.value as string,
      query || ""
    );
    if (error || !Array.isArray(data)) {
      console.error(error || "No data?");
      return [];
    }
    return toOpts(data);
  };

  const onSubmit = async (data: IFormValues) => {
    if (!user) return;
    let { hypothesis: hypothesisData, incident: incidentData } = data;
    let incidentId = incidentData?.value as string;
    let hypothesisId = hypothesisData?.value as string;

    const isNewIncident = !incidentId;
    setIsSubmitting(true);

    if (isNewIncident) {
      const { data: incidentResp, error } = await createIncident(user, {
        title: incidentData?.description || "",
        severity: data.severity,
        description: ""
      });

      if (error || !incidentResp) {
        console.error("Incident creation failed", incidentResp);
        return;
      }

      incidentId = incidentResp.id;
    }

    if (!hypothesisData?.value) {
      /* type should be root, if it's the first for an incident? */
      const nodeDetails = isNewIncident
        ? { type: HypothesisNodeType.Root }
        : {
            type: HypothesisNodeType.Factor,
            parent_id: incidentData?.details?.rootId
          };

      const params = {
        user,
        incident_id: incidentId,
        title: hypothesisData?.description,
        status: HypothesisStatus.Possible,
        ...nodeDetails
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
      hypothesisId: hypothesisId,
      evidence: evidenceAttachment,
      type,
      description: data.description
    };

    createEvidence(evidence)
      .then(() => {
        toastSuccess(
          <div>
            Evidence was attached successfully.{" "}
            <Link
              className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              to={`/incidents/${incidentId}`}
            >
              Click to open incident
            </Link>
            .
          </div>,
          { position: "top-center", duration: 10000 }
        );
        callback(true);
      })
      .catch(() => callback(false))
      .finally(() => {
        setIsSubmitting(false);
        onClose();
      });
  };

  return (
    <Modal
      title={
        <div className="text-xl font-medium text-gray-800">
          {title || "Attach Evidence"}
        </div>
      }
      open={isOpen}
      onClose={onClose}
      size="slightly-small"
      bodyClass=""
    >
      <div className="pt-7">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-8">
            <div className="mb-4">
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Evidence description"
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
            <div className="mb-4">
              <div className="block text-sm font-bold text-gray-700 mb-2">
                Incident
              </div>
              <DropdownWithActions
                onQuery={fetchIncidentOptions}
                label="Incident"
                name="incident"
                value={selectedIncident}
                setValue={setValue}
                displayValue={(value) => value?.description || ""}
                displayOption={({ option }) => (
                  <div className="flex space-x-4 justify-between w-full">
                    <div className="flex space-x-4">
                      <IncidentSeverityTag
                        iconOnly
                        severity={option.details.severity}
                      />
                      <div>{option?.description}</div>
                    </div>
                    <IncidentStatusTag status={option.details.status} />
                  </div>
                )}
              />
              <p className="text-red-600 text-sm">{errors.incident?.message}</p>
              {!selectedIncident?.value && (
                <div className="space-y-2 pt-4 pl-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 mb-1 mr-4 w-16">
                      Severity
                    </span>
                    <Controller
                      control={control}
                      name="severity"
                      render={({ field: { onChange, value } }) => (
                        <div className="w-full max-w-md pl-2">
                          <RadioOptionsGroup
                            name="severity"
                            options={INCIDENT_SEVERITY_OPTIONS}
                            value={value}
                            onChange={onChange}
                          />
                        </div>
                      )}
                    />
                    <p className="text-red-600 text-sm">
                      {errors.severity?.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="block text-sm font-bold text-gray-700 mb-2">
                Hypothesis
              </div>
              <DropdownWithActions
                onQuery={fetchHypothesisOptions}
                label="Hypothesis"
                name="hypothesis"
                value={selectedHypothesis}
                setValue={setValue}
                displayValue={({ description }) => description || ""}
                displayOption={({ option }) => option?.description}
              />
              <p className="text-red-600 text-sm">
                {/* @ts-ignore:next-line */}
                {errors.hypothesis?.description.message}
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
              {isSubmitting ? "Adding.." : "Add Evidence"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
