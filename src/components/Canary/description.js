import { format } from "timeago.js";
import { Labels } from "./labels";
import { Badge } from "../Badge";
import { Latency, Uptime, Duration, Labels } from "./renderers";
import { DescriptionCard } from "../DescriptionCard";
import { Table } from "../Table";
import { CanaryStatus } from "./status";
import { isEmpty } from "./utils";

export function CanaryDescription({ check }) {
  const statii = check.checkStatuses != null ? check.checkStatuses : [];
  const data = [];
  statii.forEach((status) => {
    data.push({
      key: `${check.key}.${check.description}`,
      age: format(`${status.time} UTC`),
      message: (
        <>
          {" "}
          <CanaryStatus status={status} />
          {status.message}{" "}
          {!isEmpty(status.error) &&
            status.error.split("\n").map((item) => (
              <>
                {item}
                <br />
              </>
            ))}
        </>
      ),
      duration: <Duration ms={status.duration} />
    });
  });

  const items = [
    {
      key: `${check.key}name`,
      name: "Name",
      value: (
        <span>
          {check.namespace}/{check.name}
        </span>
      )
    },
    {
      key: `${check.key}namespace`,
      name: "Namespace",
      value: <Badge text={check.namespace} />
    },
    {
      key: `${check.key}latency`,
      name: "Latency",
      value: <Latency check={check} />
    },
    {
      key: `${check.key}uptime`,
      name: "Uptime",
      value: <Uptime check={check} />
    },
    {
      key: `${check.key}owner`,
      name: "Owner",
      value: check.owner
    },
    {
      key: `${check.key}severity`,
      name: "Severity",
      value: check.severity
    },
    {
      key: `${check.key}labels`,
      name: "Labels",
      value: <Labels labels={check.labels} />
    },
    {
      key: `${check.key}runner`,
      name: "Runner",
      value: <Labels labels={check.runnerLabels} />
    },

    {
      key: `${check.key}interval`,
      name: "Interval",
      value: check.interval > 0 ? check.interval : check.schedule
    },
    {
      key: `${check.key}type`,
      name: "Type",
      value: check.type
    },
    {
      key: `${check.key}endpoint`,
      name: "Endpoint",
      value: check.endpoint,
      colspan: 2,
      colstart: 1
    },
    {
      key: `${check.key}checks`,
      name: "Checks",
      value: (
        <Table
          id={`${check.key}-table`}
          data={data}
          columns={["Age", "Duration", "Message"]}
        />
      ),
      colspan: 2,
      colstart: 1
    }
  ];
  return <DescriptionCard items={items} />;
}
