import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { BsExclamation } from "react-icons/bs";
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from "react-icons/hi";
import { RiLightbulbFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { createEvidence } from "../../../api/services/evidence";
import { createHypothesis } from "../../../api/services/hypothesis";
import { createIncident } from "../../../api/services/incident";
import { useUser } from "../../../context";
import { Dropdown } from "../../Dropdown";
import { TextInput } from "../../TextInput";
import { toastError } from "../../Toast/toast";

const severityItems = {
  0: {
    id: "dropdown-severity-low",
    name: "low",
    icon: <HiOutlineChevronDown color="green" />,
    description: "Low",
    value: 0
  },
  1: {
    id: "dropdown-severity-medium",
    name: "medium",
    icon: <HiOutlineChevronUp color="red" />,
    description: "Medium",
    value: 1
  },
  2: {
    id: "dropdown-severity-high",
    name: "high",
    icon: <HiOutlineChevronDoubleUp color="red" />,
    description: "High",
    value: 2
  }
};

const statusItems = {
  open: {
    id: "dropdown-status-open",
    icon: <RiLightbulbFill />,
    name: "open",
    description: "Open",
    value: "open"
  },
  closed: {
    id: "dropdown-status-closed",
    icon: <AiOutlineClose />,
    name: "closed",
    description: "Closed",
    value: "closed"
  }
};

const typeItems = {
  issue: {
    id: "dropdown-type-issue",
    name: "issue",
    icon: <BsExclamation />,
    description: "Issue",
    value: "issue"
  }
};

const validationSchema = yup
  .object({
    title: yup.string().required(),
    description: yup.string(),
    // communicator_id: yup.string().required(),
    // commander_id: yup.string().required(),
    // tracking: yup.string().email().required(),
    severity: yup.number().required(),
    status: yup.string().required(),
    type: yup.string().required()
  })
  .required();

export function IncidentCreate({ callback, evidence, ...rest }) {
  const navigate = useNavigate();
  const user = useUser();
  const location = useLocation();
  const {
    control,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      // tracking: "",
      severity: 0,
      status: "open",
      type: "issue"
    },
    resolver: yupResolver(validationSchema)
  });

  const additionalFields = {
    id: "",
    created_by: "",
    communicator_id: "",
    commander_id: "",
    created_at: "now()",
    updated_at: "now()"
  };

  const onSubmit = (data) => {
    const payload = { ...data, ...additionalFields };
    payload.id = uuidv4();
    createIncident(user, payload)
      .then((created) => {
        const create = createHypothesis(user, uuidv4(), payload.id, {
          title: payload.title,
          type: "root",
          status: "possible"
        });

        if (location.state && location.state.evidence != null) {
          create.then((hypotheis) => {
            createEvidence(
              user,
              uuidv4(),
              hypotheis.data[0].id,
              location.state.evidence,
              {
                description: "test",
                type: location.state.evidenceType
              }
            );
          });
        }

        if (created)
          if (callback != null) {
            callback(created.data[0]);
          } else {
            navigate(`/incidents/${created.data[0].id}`, { replace: true });
          }
      })
      .catch(toastError);
  };

  return (
    <div className={`py-7 ${rest.className || ""}`} {...rest}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <Dropdown
            control={control}
            label="Severity"
            name="severity"
            className="w-full"
            items={severityItems}
          />
          <p className="text-red-600 text-sm">{errors.severity?.message}</p>
        </div>
        <div className="mb-4">
          <Dropdown
            control={control}
            label="Status"
            name="status"
            className="w-full"
            items={statusItems}
          />
          <p className="text-red-600 text-sm">{errors.status?.message}</p>
        </div>
        <div className="mb-4">
          <Dropdown
            control={control}
            label="Type"
            name="type"
            className="w-full"
            items={typeItems}
          />
          <p className="text-red-600 text-sm">{errors.type?.message}</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
