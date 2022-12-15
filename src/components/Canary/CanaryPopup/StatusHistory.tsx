import React from "react";
import { format } from "timeago.js";
import { CanaryStatus, Duration } from "../renderers";
import { Table } from "../../Table";
import { HealthCheck } from "../../../types/healthChecks";

type StatusHistoryProps = {
  check: Pick<Partial<HealthCheck>, "id" | "checkStatuses" | "description">;
  sticky?: boolean;
};

export function StatusHistory({ check, sticky = false }: StatusHistoryProps) {
  const statii = check?.checkStatuses ? check.checkStatuses : [];

  const data = statii.map((status) => {
    return {
      key: `${check.id}.${check.description}`,
      age: format(`${status.time} UTC`),
      message: (
        <>
          {/* @ts-expect-error */}
          <CanaryStatus status={status} /> {status.message}{" "}
          {status.error &&
            status.error.split("\n").map((item) => (
              <>
                {item}
                <br />
              </>
            ))}
        </>
      ),
      duration: <Duration ms={status.duration} />
    };
  });

  return (
    check && (
      <Table
        id={`${check.id}-table`}
        data={data}
        columns={["Age", "Duration", "Message"]}
        sticky={sticky}
      />
    )
  );
}
