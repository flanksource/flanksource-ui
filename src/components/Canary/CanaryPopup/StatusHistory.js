import React from "react";
import { format } from "timeago.js";
import { CanaryStatus, Duration } from "../renderers";
import { isEmpty } from "../utils";
import { Table } from "../../Table";

export function StatusHistory({ check, sticky = "false" }) {
  const statii = check
    ? check.checkStatuses != null
      ? check.checkStatuses
      : []
    : [];
  const data = [];
  statii.forEach((status) => {
    data.push({
      key: `${check.key}.${check.description}`,
      age: format(`${status.time} UTC`),
      message: (
        <>
          <CanaryStatus status={status} /> {status.message}{" "}
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

  return (
    check && (
      <Table
        id={`${check.key}-table`}
        data={data}
        columns={["Age", "Duration", "Message"]}
        sticky={sticky}
      />
    )
  );
}
