import React, { Suspense, useMemo, useRef } from "react";
import { useCanaryGraphQuery } from "../../../api/query-hooks/health";
import { HealthCheck } from "../../../api/types/health";
import {
  capitalizeFirstLetter,
  toFixedIfNecessary
} from "../../../utils/common";
import { usePrevious } from "../../../utils/hooks";
import mixins from "../../../utils/mixins.module.css";
import { DropdownStandaloneWrapper } from "../../Dropdown/StandaloneWrapper";
import { TimeRange, timeRanges } from "../../Dropdown/TimeRange";
import { Duration } from "../renderers";
import { CanaryCheckDetailsSpecTab } from "./CanaryCheckDetailsSpec";
import CheckLabels from "./CheckLabels";
import { CheckStat } from "./CheckStat";
import { StatusHistory } from "./StatusHistory/StatusHistory";
import { PopupTabs } from "./tabs";
import { getUptimePercentage } from "./utils";
import dayjs from "dayjs";
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

  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  const timeRange = useMemo(() => {
    // get time passed since last runtime
    const lapsedTime = dayjs(validCheck?.lastRuntime!).diff(dayjs(), "minute");
    // if passed time is less than 1 hour, use 1 hour time range
    if (lapsedTime < 60) {
      return "1h";
    }
    // if passed time is less than 3 hours, use 3 hours time range
    if (lapsedTime < 180) {
      return "3h";
    }

    // if passed time is less than 6 hours, use 6 hours time range
    if (lapsedTime < 360) {
      return "6h";
    }

    // if passed time is less than 12 hours, use 12 hours time range
    if (lapsedTime < 720) {
      return "12h";
    }

    // if passed time is less than 1 day, use 1 day time range
    if (lapsedTime < 1440) {
      return "1d";
    }

    // if passed time is less than 2 days, use 2 days time range
    if (lapsedTime < 2880) {
      return "2d";
    }

    // if passed time is less than 3 days, use 3 days time range
    if (lapsedTime < 4320) {
      return "3d";
    }

    // if passed time is less than 1 week, use 1 week time range
    if (lapsedTime < 10080) {
      return "1w";
    }

    // if passed time is less than 2 weeks, use 2 weeks time range
    if (lapsedTime < 20160) {
      return "2w";
    }

    // if passed time is less than 3 weeks, use 3 weeks time range
    if (lapsedTime < 30240) {
      return "3w";
    }

    // if passed time is less than 1 month, use 1 month time range
    if (lapsedTime < 43200) {
      return "1mo";
    }

    // if passed time is less than 2 months, use 2 months time range
    if (lapsedTime < 86400) {
      return "2mo";
    }

    // if passed time is less than 3 months, use 3 months time range
    if (lapsedTime < 129600) {
      return "3mo";
    }

    // if passed time is less than 6 months, use 6 months time range
    if (lapsedTime < 259200) {
      return "6mo";
    }

    // if passed time is less than 1 year, use 1 year time range
    if (lapsedTime < 525600) {
      return "1y";
    }

    // if passed time is less than 2 years, use 2 years time range
    if (lapsedTime < 1051200) {
      return "2y";
    }

    // if passed time is less than 3 years, use 3 years time range
    if (lapsedTime < 1576800) {
      return "3y";
    }

    // if passed time is more than 3 years, use 3 years time range
    if (lapsedTime > 1576800) {
      return "5y";
    }

    return "1h";
  }, [validCheck?.lastRuntime]);

  const { data } = useCanaryGraphQuery(timeRange, validCheck);

  const uptimeValue = toFixedIfNecessary(
    getUptimePercentage(data)?.toString()!,
    0
  );

  const validUptime =
    !Number.isNaN(validCheck?.uptime?.passed) &&
    !Number.isNaN(validCheck?.uptime?.failed);

  const severityValue =
    validCheck?.severity ?? validCheck?.spec?.severity ?? "-";

  if (validCheck == null) {
    return null;
  }

  return (
    <div {...rest} ref={containerRef}>
      <div className="flex flex-col" ref={statsRef}>
        <CheckLabels check={validCheck} />
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
            containerClassName="w-40 mb-4"
            title="Latency (95%)"
            value={<Duration ms={data?.latency?.p95} />}
          />
          <CheckStat
            containerClassName="w-40 mb-4"
            title="Latency  (97%)"
            value={<Duration ms={data?.latency?.p97} />}
          />
          <CheckStat
            containerClassName="w-40 mb-4"
            title="Latency  (99%)"
            value={<Duration ms={data?.latency?.p99} />}
          />
          <CheckStat
            containerClassName="w-40 mb-4"
            title="Severity"
            value={capitalizeFirstLetter(severityValue)}
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
              <CanaryStatusChart timeRange={timeRange} check={validCheck} />
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
                <StatusHistory timeRange={timeRange} check={validCheck} />
              </div>
            ),
            class:
              "flex-1 flex flex-col overflow-y-hidden border-b h-full border-gray-300"
          },
          specs: {
            label: "Spec",
            content: <CanaryCheckDetailsSpecTab check={validCheck} />,
            class: `flex-1 flex flex-col overflow-y-auto  border border-gray-300 ${mixins.appleScrollbar}`
          }
        }}
      />
    </div>
  );
}
