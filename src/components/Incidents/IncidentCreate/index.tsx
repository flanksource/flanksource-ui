import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import {
  createEvidence,
  Evidence,
  EvidenceType
} from "../../../api/services/evidence";
import {
  createHypothesisOld,
  HypothesisStatus
} from "../../../api/services/hypothesis";
import { createIncident, Incident } from "../../../api/services/incident";
import { useUser } from "../../../context";
import { ReactSelectDropdown } from "../../ReactSelectDropdown";
import { TextInput } from "../../TextInput";
import { toastError } from "../../Toast/toast";
import { severityItems, statusItems, typeItems } from "../data";

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
  evidence: Record<string, any>;
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
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      // tracking: "",
      severity: "Low",
      status: "open",
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

  const onSubmit = async (data: Record<string, any>) => {
    const payload: Record<string, any> = { ...data, ...additionalFields };
    payload.id = uuidv4();
    // TODO(ciju): Handle failure cases
    try {
      // @ts-expect-error
      const { data: incident, error } = await createIncident(user!, payload);

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

      let _evidence: Evidence = {
        // @ts-expect-error
        user,
        id: uuidv4(),
        hypothesisId: hypothesis.data[0].id
      };

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
    <div className={`max-w-prose py-7 ${rest.className || ""}`} {...rest}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <ReactSelectDropdown
            control={control}
            label="Type"
            name="type"
            className="w-full"
            labelClass="block text-sm font-bold text-gray-700 mb-2"
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
          <p className="text-red-600 text-sm">{errors.description?.message}</p>
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
            items={statusItems}
            labelClass="block text-sm font-bold text-gray-700 mb-2"
            value={status}
          />
          <p className="text-red-600 text-sm">{errors.status?.message}</p>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
