import React, { Suspense, useMemo } from "react";
import { usePrevious } from "../../../utils/hooks";
import { AccordionBox } from "../../AccordionBox";
import {
  capitalizeFirstLetter,
  toFixedIfNecessary
} from "../../../utils/common";
import mixins from "../../../utils/mixins.module.css";
import { PopupTabs } from "./tabs";
import { CheckStat } from "./CheckStat";
import { getUptimePercentage } from "./utils";
import { StatusHistory } from "./StatusHistory";
import { DetailField } from "./DetailField";
import { Duration } from "../renderers";
import { DropdownStandaloneWrapper } from "../../Dropdown/StandaloneWrapper";
import { TimeRange, timeRanges } from "../../Dropdown/TimeRange";
import { HealthCheck } from "../../../types/healthChecks";
import { CanaryCheckDetailsLabel } from "./CanaryCheckDetailsLabel";
import { relativeDateTime } from "../../../utils/date";
import CanaryCheckDetailsUptime from "./CanaryCheckDetailsUptime";
import { CanaryCheckDetailsSpecTab } from "./CanaryCheckDetailsSpec";

const CanaryStatusChart = React.lazy(() =>
  import("../CanaryStatusChart").then(({ CanaryStatusChart }) => ({
    default: CanaryStatusChart
  }))
);

type CheckDetailsProps = React.HTMLProps<HTMLDivElement> & {
  check?: Partial<HealthCheck>;
  timeRange: string;
};

export function CheckDetails({ check, timeRange, ...rest }: CheckDetailsProps) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  const uptimeValue = toFixedIfNecessary(getUptimePercentage(validCheck), 0);
  const validUptime =
    !Number.isNaN(validCheck?.uptime?.passed) &&
    !Number.isNaN(validCheck?.uptime?.failed);
  const severityValue = validCheck?.severity || "-";

  const details: Record<string, React.ReactNode> = useMemo(
    () => ({
      Name:
        validCheck?.name ||
        validCheck?.canary_name ||
        validCheck?.endpoint ||
        "-",
      Type: validCheck?.type || "-",
      Labels: <CanaryCheckDetailsLabel check={validCheck} />,
      Owner: validCheck?.owner || "-",
      Interval: validCheck?.interval || "-",
      Location: validCheck?.location || "-",
      Schedule: validCheck?.schedule || "-",
      Status: validCheck?.status || "-",
      "Last Runtime": validCheck?.lastRuntime
        ? relativeDateTime(validCheck.lastRuntime)
        : "-",
      Uptime: <CanaryCheckDetailsUptime uptime={validCheck?.uptime} />,
      "Created At": validCheck?.createdAt
        ? relativeDateTime(validCheck.createdAt)
        : "-",
      "Updated At": validCheck?.updatedAt
        ? relativeDateTime(validCheck.updatedAt)
        : "-"
    }),
    [validCheck]
  );

  if (validCheck == null) {
    return null;
  }

  return (
    <div {...rest}>
      {/* stats section */}
      <div className="flex flex-row flex-wrap mb-2">
        <CheckStat
          containerClassName="w-52 mb-4"
          title="Uptime"
          value={
            !Number.isNaN(uptimeValue)
              ? `${toFixedIfNecessary(uptimeValue, 2)}%`
              : "-"
          }
          append={
            validUptime &&
            !Number.isNaN(uptimeValue) && (
              <div className="flex flex-col justify-center mx-2 mt-0.5">
                <span className="text-xs text-green-700 ">
                  {validCheck?.uptime?.passed} passed
                </span>
                <span className="text-xs text-red-600">
                  {validCheck?.uptime?.failed} failed
                </span>
              </div>
            )
          }
        />
        <CheckStat
          containerClassName="w-40 mb-4"
          title="Latency (95%)"
          value={<Duration ms={validCheck?.latency?.p95} />}
        />
        <CheckStat
          containerClassName="w-40 mb-4"
          title="Latency  (97%)"
          value={<Duration ms={validCheck?.latency?.p97} />}
        />
        <CheckStat
          containerClassName="w-40 mb-4"
          title="Latency  (99%)"
          value={<Duration ms={validCheck?.latency?.p99} />}
        />
        <CheckStat
          containerClassName="w-40 mb-4"
          title="Severity"
          value={capitalizeFirstLetter(severityValue)}
        />
      </div>
      {/* chart section */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2 pr-2">
          <span className="text-lg font-medium">Health overview</span>
          <DropdownStandaloneWrapper
            className="w-48"
            paramKey="timeRange"
            dropdownElem={<TimeRange name="time-range" />}
            defaultValue={timeRange ?? timeRanges[1].value}
          />
        </div>
        <div className="w-full h-52 overflow-visible">
          <Suspense fallback={<div>Loading..</div>}>
            <CanaryStatusChart timeRange={timeRange} check={validCheck} />
          </Suspense>
        </div>
      </div>
      <PopupTabs
        shareHeight
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden"
        }}
        contentStyle={{
          marginTop: "-1px",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
          overflowX: "hidden"
        }}
        tabs={{
          statusHistory: {
            label: "Status history",
            content: (
              <div
                key="status-history"
                className={`border border-b-0 border-gray-300 bg-gray-50 overflow-hidden h-full relative -mb-px ${mixins.appleScrollbar}`}
              >
                <StatusHistory
                  timeRange={timeRange}
                  check={validCheck}
                  sticky
                />
              </div>
            ),
            class:
              "flex flex-col overflow-y-hidden border-b h-full border-gray-300"
          },
          checkDetails: {
            label: "Check details",
            content: (
              <div key="check-details" className="px-6 py-6">
                <AccordionBox
                  content={
                    <div className="flex flex-row flex-wrap">
                      {Object.entries(details).map(([label, value]) => (
                        <DetailField
                          key={label}
                          className="w-1/2 mb-3 whitespace-nowrap"
                          label={label}
                          value={value as any}
                        />
                      ))}
                    </div>
                  }
                />
              </div>
            ),
            class: `flex flex-col overflow-y-auto  border border-gray-300 ${mixins.appleScrollbar}`
          },
          specs: {
            label: "Spec",
            content: <CanaryCheckDetailsSpecTab check={validCheck} />,
            class: `flex flex-col overflow-y-auto  border border-gray-300 ${mixins.appleScrollbar}`
          }
        }}
      />
    </div>
  );
}
