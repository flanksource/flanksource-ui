import React from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import {
  HiOutlineChevronDoubleUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp
} from "react-icons/hi";
import { components } from "react-select";
import { RowDetail } from "./RowDetail";
import { Select } from "../Select";
import { Avatar } from "../Avatar";
import { IncidentPriority } from "../../constants/incident-priority";

const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex flex-wrap">
      {props.data.icon({ className: "mr-2 mt-1" })}
      {children}
    </div>
  </components.SingleValue>
);
const Option = ({ children, ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row">
      {props.data.icon({ className: "mr-2 mt-1" })}
      {children}
    </div>
  </components.Option>
);
const CommandersPerson = ({ ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex flex-row gap-2">
      <Avatar srcList={props.data.avatar} size="sm" />
      {props.data.label.split(" ")[0]}
    </div>
  </components.SingleValue>
);
const OptionPersonsCommanders = ({ ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row gap-2">
      <Avatar srcList={props.data.avatar} size="sm" />
      {props.data.label.split(" ")[0]}
    </div>
  </components.Option>
);
const RespondentsPerson = ({ ...props }) => (
  <components.MultiValueLabel {...props}>
    <div className="flex flex-row gap-2 ">
      <Avatar srcList={props.data.avatar} size="sm" />
      {props.data.label.split(" ")[0]}
    </div>
  </components.MultiValueLabel>
);

const OptionPersonsRespondents = ({ ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row gap-1">
      <Avatar srcList={props.data.avatar} size="sm" />
      {props.data.label.split(" ")[0]}
    </div>
  </components.Option>
);
export const priorities = [
  {
    label: "Low",
    value: IncidentPriority.Low,
    icon: function IconToProps(props) {
      return <HiOutlineChevronDown color="green" {...props} />;
    }
  },
  {
    label: "Medium",
    value: IncidentPriority.Medium,
    icon: function IconToProps(props) {
      return <HiOutlineChevronUp color="red" {...props} />;
    }
  },
  {
    label: "High",
    value: IncidentPriority.High,
    icon: function IconToProps(props) {
      return <HiOutlineChevronDoubleUp color="red" {...props} />;
    }
  }
];

export const personCommanders = [
  {
    label: "Lindsay Walton",
    value: "Lindsay Walton",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  {
    label: "Eduardo Benz",
    value: "Eduardo Benz",
    avatar:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
  }
];
export const personRespondents = [
  {
    label: "Lindsay Walton",
    value: "Lindsay Walton",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80"
  },
  {
    label: "Eduardo Benz",
    value: "Eduardo Benz",
    avatar:
      "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
  }
];
export const Details = () => {
  const { control, getValues } = useForm({
    defaultValues: {
      tracking: "123456",
      started: "01.01.2022",
      duration: "13 days",
      chartRoomTitle: "#Slack",
      chartRoom: "https://google.com.ua",
      statusPageTitle: "StatusPage.io",
      statusPage: "https://www.atlassian.com/software/statuspage",
      priority: IncidentPriority.High,
      commanders: "Lindsay Walton",
      respondents: "Eduardo Benz"
    }
  });

  return (
    <div className="px-6 pt-3.5">
      <div className="flex justify-between mb-7">
        <h2 className="mt-0.5 text-2xl font-medium leading-7 text-dark-gray">
          Details
        </h2>
        <button
          type="button"
          className="btn-secondary btn-secondary-sm text-dark-blue"
        >
          Share
        </button>
      </div>
      <RowDetail
        title="Chart Room"
        value={
          <a
            href={getValues("chartRoom")}
            className="underline text-dark-blue text-sm font-normal"
          >
            {getValues("chartRoomTitle")}
          </a>
        }
      />
      <RowDetail
        title="Status Page"
        value={
          <a
            href={getValues("statusPage")}
            className="underline text-dark-blue text-sm font-normal"
          >
            {getValues("statusPageTitle")}
          </a>
        }
      />
      <RowDetail
        title="Respondents"
        value={
          <Select
            name="respondents"
            control={control}
            components={{
              MultiValueLabel: RespondentsPerson,
              Option: OptionPersonsRespondents
            }}
            styles={{
              multiValue: (base) => ({
                ...base,
                backgroundColor: "white"
              }),
              multiValueRemove: () => ({
                display: "none"
              }),
              clearIndicator: () => ({
                display: "none"
              }),
              multiValueLabel: () => ({
                display: "flex",
                // flexWrap: "wrap",
                fontSize: 14,
                gap: 4
              })
            }}
            options={personRespondents}
            isMulti
          />
        }
      />
      <RowDetail
        title="Commanders"
        value={
          <Select
            name="commanders"
            control={control}
            components={{
              SingleValue: CommandersPerson,
              Option: OptionPersonsCommanders
            }}
            options={personCommanders}
          />
        }
      />
      <RowDetail
        title="Tracking"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {getValues("tracking")}
          </span>
        }
      />
      <RowDetail
        title="Started"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {getValues("started")}
          </span>
        }
      />
      <RowDetail
        title="Duration"
        value={
          <span className="text-dark-gray text-sm font-normal">
            {getValues("duration")}
          </span>
        }
      />
      <RowDetail
        title="Priority"
        value={
          <Select
            name="priority"
            control={control}
            components={{ SingleValue, Option }}
            options={priorities}
          />
        }
      />

      <button type="button" className="btn-primary mt-0.5 w-full">
        Mark as resolved
      </button>
    </div>
  );
};

Details.propTypes = {};
