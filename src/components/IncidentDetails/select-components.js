import { components } from "react-select";
import React from "react";
import { Avatar } from "../Avatar";

export const IncidentPrioritySingleValue = React.memo(
  ({ children, ...props }) => (
    <components.SingleValue {...props}>
      <div className="flex flex-wrap">
        {props.data.icon({ className: "mr-2 mt-1" })}
        {children}
      </div>
    </components.SingleValue>
  )
);
IncidentPrioritySingleValue.displayName = "IncidentPrioritySingleValue";

export const IncidentPriorityOption = React.memo(({ children, ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row">
      {props.data.icon({ className: "mr-2 mt-1" })}
      {children}
    </div>
  </components.Option>
));
IncidentPriorityOption.displayName = "IncidentPriorityOption";

export const IncidentCommandersSingleValue = React.memo(({ ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex flex-wrap gap-1.5 text-sm align-baseline">
      <Avatar user={props.data} size="sm" />
      <p className="mt-0.5">{props.data.label.split(" ")[0]}</p>
    </div>
  </components.SingleValue>
));
IncidentCommandersSingleValue.displayName = "IncidentCommandersSingleValue";

export const IncidentCommandersOption = React.memo(({ ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row gap-1.5 text-sm">
      <Avatar user={props.data} size="sm" />
      <p className="mt-0.5">{props.data.label.split(" ")[0]}</p>
    </div>
  </components.Option>
));
IncidentCommandersOption.displayName = "IncidentCommandersOption";

export const IncidentRespondentsMultiValueLabel = React.memo(({ ...props }) => (
  <components.MultiValueLabel {...props}>
    <div className="flex flex-wrap gap-1.5 text-sm">
      <Avatar user={props.data} size="sm" />
      <p className="mt-0.5">{props.data.label.split(" ")[0]}</p>
    </div>
  </components.MultiValueLabel>
));
IncidentRespondentsMultiValueLabel.displayName =
  "IncidentRespondentsMultiValueLabel";

export const IncidentRespondentsOption = React.memo(({ ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row gap-1.5 text-sm">
      <Avatar user={props.data} size="sm" />
      <p className="mt-0.5">{props.data.label.split(" ")[0]}</p>
    </div>
  </components.Option>
));
IncidentRespondentsOption.displayName = "IncidentRespondentsOption";
