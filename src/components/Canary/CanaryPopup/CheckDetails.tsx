import React, { Suspense, useMemo, useRef } from "react";
import { useCanaryGraphQuery } from "../../../api/query-hooks/health";
import { HealthCheck } from "../../../api/types/health";
import { isCanaryUI } from "../../../context/Environment";
import {
  capitalizeFirstLetter,
  toFixedIfNecessary
} from "../../../utils/common";
import { relativeDateTime } from "../../../utils/date";
import mixins from "../../../utils/mixins.module.css";
import { DropdownStandaloneWrapper } from "../../Dropdown/StandaloneWrapper";
import { TimeRange, timeRanges } from "../../Dropdown/TimeRange";
import { Head } from "../../Head/Head";
import { Duration } from "../renderers";
import { CanaryCheckDetailsSpecTab } from "./CanaryCheckDetailsSpec";
import CheckLabels from "./CheckLabels";
import { CheckStat } from "./CheckStat";
import { StatusHistory } from "./StatusHistory/StatusHistory";
import { calculateDefaultTimeRangeValue } from "./Utils/calculateDefaultTimeRangeValue";
import { PopupTabs } from "./tabs";
import { getUptimePercentage } from "./utils";

const CanaryStatusChart = React.lazy(() =>
  import("../CanaryStatusChart").then(({ CanaryStatusChart }) => ({
    default: CanaryStatusChart
  }))
);

type CheckDetailsProps = React.HTMLProps<HTMLDivElement> & {
  check?: Partial<HealthCheck>;
  timeRange: string;
};

export function CheckDetails({ check, ...rest }: CheckDetailsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const timeRange = useMemo(
    () => calculateDefaultTimeRangeValue(check),
    [check]
  );

  const { data } = useCanaryGraphQuery(timeRange, check);

  const lastRun = relativeDateTime(check?.lastRuntime!).replace(" ago", "");

  const nextRun = check?.next_runtime
    ? relativeDateTime(check?.next_runtime!).replace(" ago", "")
    : "-";

  const uptimeValue = toFixedIfNecessary(
    getUptimePercentage(data)?.toString()!,
    0
  );

  const validUptime =
    !Number.isNaN(check?.uptime?.passed) &&
    !Number.isNaN(check?.uptime?.failed);

  const severityValue = check?.severity ?? check?.spec?.severity ?? "-";

  if (!check) {
    return null;
  }

  const suffix = isCanaryUI ? "" : " | Mission Control";

  return (
    <>
      {check.name && <Head prefix={check.name} suffix={suffix} />}
      <div {...rest} ref={containerRef}>
        <div className="flex flex-col" ref={statsRef}>
          <CheckLabels check={check} />
          <div className="flex flex-row flex-wrap">
            <CheckStat
              containerClassName="w-52 mb-4"
              title="Uptime"
              value={
                !Number.isNaN(uptimeValue)
                  ? `${toFixedIfNecessary(uptimeValue.toString(), 2)}%`
                  : "-"
              }
              append={
                validUptime &&
                !Number.isNaN(uptimeValue) && (
                  <div className="flex flex-col justify-center mx-2 mt-0.5">
                    <span className="text-xs text-green-700 ">
                      {data?.uptime?.passed} passed
                    </span>
                    <span className="text-xs text-red-600">
                      {data?.uptime?.failed} failed
                    </span>
                  </div>
                )
              }
            />
            <CheckStat
              containerClassName="w-32 mb-4"
              title="Latency (95%)"
              value={<Duration ms={data?.latency?.p95} />}
            />
            <CheckStat
              containerClassName="w-32 mb-4"
              title="Latency  (97%)"
              value={<Duration ms={data?.latency?.p97} />}
            />
            <CheckStat
              containerClassName="w-32 mb-4"
              title="Latency  (99%)"
              value={<Duration ms={data?.latency?.p99} />}
            />
            <CheckStat
              containerClassName="w-32 mb-4"
              title="Severity"
              value={capitalizeFirstLetter(severityValue)}
            />
            <CheckStat
              containerClassName="w-32 mb-4"
              title="Last Run"
              value={undefined}
              append={
                <div className="flex flex-col justify-center">
                  <span className="">
                    <strong>{lastRun}</strong>{" "}
                    <span className="text-xs font-normal">ago</span>
                  </span>
                  <span className="text-gray-400">
                    <strong>{nextRun}</strong>{" "}
                    <span className="text-xs font-normal">(next run)</span>
                  </span>
                </div>
              }
            />
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2 pr-2">
              <span className="text-lg font-medium">Health overview</span>
              <DropdownStandaloneWrapper
                className="w-48"
                paramKey="timeRange"
                dropdownElem={<TimeRange name="time-range" />}
                defaultValue={timeRange ?? timeRanges[1].value}
                name="timeRange"
              />
            </div>
            <div className="w-full h-52 overflow-visible">
              <Suspense fallback={<div>Loading..</div>}>
                <CanaryStatusChart timeRange={timeRange} check={check} />
              </Suspense>
            </div>
          </div>
        </div>
        <PopupTabs
          shareHeight={false}
          style={{
            flexDirection: "column",
            overflowY: "hidden"
          }}
          className="flex-1 flex"
          contentStyle={{
            marginTop: "-1px",
            display: "flex",
            flexDirection: "column",
            overflowY: "hidden",
            overflowX: "hidden",
            height: "100%"
          }}
          tabs={{
            statusHistory: {
              label: "Status history",
              content: (
                <div
                  key="status-history"
                  className={`border border-b-0 border-gray-300 bg-white overflow-y-auto flex flex-col flex-1 relative -mb-px ${mixins.appleScrollbar}`}
                >
                  <StatusHistory timeRange={timeRange} check={check} />
                </div>
              ),
              class:
                "flex-1 flex flex-col overflow-y-hidden border-b h-full border-gray-300"
            },
            specs: {
              label: "Spec",
              content: <CanaryCheckDetailsSpecTab check={check} />,
              class: `flex-1 flex flex-col overflow-y-auto  border border-gray-300 ${mixins.appleScrollbar}`
            }
          }}
        />
      </div>
    </>
  );
}
