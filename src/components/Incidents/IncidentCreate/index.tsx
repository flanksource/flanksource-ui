import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import {
  Evidence,
  EvidenceType,
  createEvidence
} from "../../../api/services/evidence";
import {
  HypothesisStatus,
  createHypothesisOld
} from "../../../api/services/hypothesis";
import {
  Incident,
  IncidentStatus,
  NewIncident,
  createIncident
} from "../../../api/services/incident";
import { useUser } from "../../../context";
import { Events, sendAnalyticEvent } from "../../../services/analytics";
import { Button } from "../../Button";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";
import { TextInput } from "../../TextInput";
import { toastError } from "../../Toast/toast";
import { incidentStatusItems, severityItems, typeItems } from "../data";

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
    watch
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
        <div className="p-5">
          <div className="mb-4">
            <ReactSelectDropdown
              control={control}
              label="Type"
              name="type"
              className="w-full"
              labelClass="block text-sm font-bold text-gray-700 mb-2"
              containerClassName="flex flex-col space-y-1"
              items={typeItems}
              value={type}
            />
            <p className="text-red-600 text-sm">{errors.type?.message}</p>
          </div>
          <div className="mb-4">
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
            <p className="text-red-600 text-sm">{errors.title?.message}</p>
          </div>
          <div className="mb-4">
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
            <p className="text-red-600 text-sm">
              {errors.description?.message}
            </p>
          </div>
          {/* <div className="mb-4">
          <Controller
            control={control}
            name="communicator_id"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <TextInput
                  label="Communicator"
                  id="communicator_id"
                  className="w-full"
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
          <p className="text-red-600 text-sm">
            {errors.communicator_id?.message}
          </p>
        </div>
        <div className="mb-4">
          <Controller
            control={control}
            name="commander_id"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <TextInput
                  label="Commander"
                  id="commander_id"
                  className="w-full"
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
          <p className="text-red-600 text-sm">{errors.commander_id?.message}</p>
        </div> */}
          {/* <div className="mb-4">
          <Controller
            control={control}
            name="tracking"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <TextInput
                  label="Tracking"
                  id="tracking"
                  type="email"
                  placeholder="example@company.com"
                  className="w-full"
                  onChange={onChange}
                  value={value}
                />
              );
            }}
          />
          <p className="text-red-600 text-sm">{errors.tracking?.message}</p>
        </div> */}

          <div className="mb-4">
            {/* have a look at this */}
            <ReactSelectDropdown
              control={control}
              label="Severity"
              name="severity"
              className="w-full"
              items={severityItems}
              containerClassName="flex flex-col space-y-1"
              labelClass="block text-sm font-bold text-gray-700 mb-2"
              value={severity}
            />
            <p className="text-red-600 text-sm">{errors.severity?.message}</p>
          </div>
          <div className="mb-4">
            <ReactSelectDropdown
              control={control}
              label="Status"
              name="status"
              className="w-full"
              items={incidentStatusItems}
              labelClass="block text-sm font-bold text-gray-700 mb-2"
              containerClassName="flex flex-col space-y-1"
              value={status}
            />
            <p className="text-red-600 text-sm">{errors.status?.message}</p>
          </div>
        </div>
        <div className="flex justify-end bg-gray-100 px-5 py-4 w-full rounded">
          <Button
            type="submit"
            className="px-3 py-2 btn-secondary float-right"
            text="Create"
          />
        </div>
      </form>
    </div>
  );
}
