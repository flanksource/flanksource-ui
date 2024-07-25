import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import SelectDropdown from "@flanksource-ui/ui/Dropdowns/SelectDropdown";
import { TextInput } from "@flanksource-ui/ui/FormControls/TextInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { createEvidence } from "../../../api/services/evidence";
import { createHypothesisOld } from "../../../api/services/hypothesis";
import { createIncident } from "../../../api/services/incident";
import { Evidence, EvidenceType } from "../../../api/types/evidence";
import { HypothesisStatus } from "../../../api/types/hypothesis";
import {
  Incident,
  IncidentStatus,
  NewIncident
} from "../../../api/types/incident";
import { useUser } from "../../../context";
import { Events, sendAnalyticEvent } from "../../../services/analytics";
import { Button } from "../../../ui/Buttons/Button";
import { toastError } from "../../Toast/toast";
import { severityOptions, typeOptions } from "../AttachEvidenceDialog";
import { incidentStatusItems, severityItems } from "../data";

const incidentStatusOptions = Object.entries(incidentStatusItems).map(
  ([_, { value, description, icon }]) => ({
    value,
    label: description,
    icon
  })
);

const validationSchema = yup
  .object({
    title: yup.string().required(),
    description: yup.string(),
    // communicator_id: yup.string().required(),
    // commander_id: yup.string().required(),
    // tracking: yup.string().email().required(),
    severity: yup
      .string()
      .oneOf(Object.entries(severityItems).map(([_, value]) => value.value))
      .required(),
    status: yup.string().required(),
    type: yup.string().required()
  })
  .required();

type IncidentCreateProps = {
  callback: (incident?: Incident) => void;
  evidence?: Record<string, any>;
} & React.HTMLAttributes<HTMLDivElement>;

export function IncidentCreate({
  callback,
  evidence,
  ...rest
}: IncidentCreateProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const topologyId = params.get("topology");

  const { user } = useUser();
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm<
    Omit<NewIncident, "created_by" | "commander_id" | "communicator_id">
  >({
    defaultValues: {
      title: "",
      description: "",
      // tracking: "",
      severity: "Low",
      status: IncidentStatus.Open,
      type: "availability"
    },
    resolver: yupResolver(validationSchema)
  });

  const type = watch("type");
  const severity = watch("severity");
  const status = watch("status");

  const additionalFields = {
    id: "",
    created_by: "",
    communicator_id: "",
    commander_id: "",
    created_at: "now()",
    updated_at: "now()"
  };

  const onSubmit = async (
    data: Omit<NewIncident, "created_by" | "commander_id" | "communicator_id">
  ) => {
    const payload = { ...data, ...additionalFields };
    payload.id = uuidv4();
    // TODO(ciju): Handle failure cases
    try {
      const { data: incident } = await createIncident(user!, payload);

      const hypothesis = await createHypothesisOld(
        user!,
        uuidv4(),
        payload.id,
        {
          title: payload.title,
          type: "root",
          status: HypothesisStatus.Possible
        }
      );

      if (!hypothesis?.data[0]?.id || (!evidence && !topologyId)) {
        callback();
        return;
      }

      let _evidence: Omit<
        Evidence,
        "created_by" | "created_at" | "hypothesis_id" | "id"
      > = {
        user: user!,
        hypothesisId: hypothesis.data[0].id
      } as any;

      if (evidence) {
        _evidence.evidence = {
          lines: evidence?.lines,
          selected_lines: evidence?.selected_lines
        };
        _evidence.config_id = evidence?.configId;
        _evidence.type = EvidenceType.Config;
        _evidence.description = evidence?.configName;
      }
      if (topologyId) {
        _evidence.component_id = topologyId;
        _evidence.type = EvidenceType.Topology;
        _evidence.description = "Topology";
      }

      await createEvidence(_evidence);

      // Send Intercom event, when incident is created
      sendAnalyticEvent(Events.CreatedIncident);

      if (callback != null) {
        callback(incident);
      } else {
        navigate(`/incidents/${incident?.id}`, { replace: true });
      }
    } catch (e: any) {
      toastError(e);
    }
  };

  return (
    <div className={`max-w-prose ${rest.className || ""}`} {...rest}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <span className="mb-1 mr-4 w-16 text-sm font-bold text-gray-700">
                Type
              </span>
              <SelectDropdown
                name="type"
                className="w-full"
                options={typeOptions}
                value={type}
                onChange={(e) => {
                  if (!e) return;
                  setValue("type", e);
                }}
              />
              <p className="text-sm text-red-600">{errors.type?.message}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <Controller
              control={control}
              name="title"
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <TextInput
                    label="Title"
                    id="title"
                    className="w-full"
                    onChange={onChange}
                    value={value}
                  />
                );
              }}
            />
            <p className="text-sm text-red-600">{errors.title?.message}</p>
          </div>
          <div className="flex flex-col">
            <Controller
              control={control}
              name="description"
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <TextInput
                    label="Description"
                    id="description"
                    className="w-full"
                    onChange={onChange}
                    value={value}
                  />
                );
              }}
            />
            <p className="text-sm text-red-600">
              {errors.description?.message}
            </p>
          </div>

          <div className="flex flex-col">
            <span className="mb-1 mr-4 w-16 text-sm font-bold text-gray-700">
              Severity
            </span>
            <SelectDropdown
              name="severity"
              className="w-full"
              options={severityOptions}
              value={severity}
              onChange={(e) => {
                if (!e) return;
                setValue("severity", e);
              }}
            />
            <p className="text-sm text-red-600">{errors.severity?.message}</p>
          </div>

          <div className="flex flex-col">
            <span className="mb-1 mr-4 w-16 text-sm font-bold text-gray-700">
              Status
            </span>
            <SelectDropdown
              name="status"
              className="w-full"
              options={incidentStatusOptions}
              value={status}
              onChange={(e) => {
                if (!e) return;
                setValue("status", e);
              }}
            />
            <p className="text-sm text-red-600">{errors.severity?.message}</p>
          </div>
        </div>
        <div className="flex w-full justify-end rounded bg-gray-100 px-5 py-4">
          <Button
            type="submit"
            className="btn-secondary float-right px-3 py-2"
            text="Create"
          />
        </div>
      </form>
    </div>
  );
}
