import React, { Suspense, useState } from "react";

import clsx from "clsx";

import { PopupTabs } from "./tabs";
import { Badge } from "../../Badge";
import { CheckStat } from "./CheckStat";
import { DetailField } from "./DetailField";
import { StatusHistory } from "./StatusHistory";
import { AccordionBox } from "../../AccordionBox";
// import { TimeRangePicker } from "../../TimeRangePicker";

import { Duration } from "../renderers";
import { getUptimePercentage } from "./utils";
import { usePrevious } from "../../../utils/hooks";
import {
  toFixedIfNecessary,
  capitalizeFirstLetter
} from "../../../utils/common";

import mixins from "../../../utils/mixins.module.css";

export function fixedZero(val: number) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type: string) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === "today") {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [now, new Date(now.getTime() + (oneDay - 1000))];
  }

  if (type === "week") {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [beginTime, new Date(beginTime + (7 * oneDay - 1000))];
  }

  const year = now.getFullYear();

  if (type === "month") {
    const month = now.getMonth();
    const nextDate = new Date(now.setMonth(now.getMonth() + 1));
    const nextYear = nextDate.getFullYear();
    const nextMonth = nextDate.getMonth();

    return [
      new Date(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      new Date(
        new Date(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      )
    ];
  }

  return [
    new Date(`${year}-01-01 00:00:00`),
    new Date(`${year}-12-31 23:59:59`)
  ];
}

const CanaryStatusChart = React.lazy(() =>
  import("../CanaryStatusChart").then(({ CanaryStatusChart }) => ({
    default: CanaryStatusChart
  }))
);

export function CheckDetails({ check, ...rest }) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  const [rangeType, setRangeType] = useState<string>("month");
  const [rangePickerValue, setRangePickerValue] = useState(
    getTimeDistance("month")
  );

  if (validCheck == null) {
    return null;
  }
  const uptimeValue = toFixedIfNecessary(getUptimePercentage(validCheck), 0);
  const validUptime =
    !Number.isNaN(validCheck?.uptime?.passed) &&
    !Number.isNaN(validCheck?.uptime?.failed);
  const severityValue = validCheck?.severity || "-";
  const statusHistoryList = validCheck?.checkStatuses;

  const details = {
    Name:
      validCheck?.name ||
      validCheck?.canary_name ||
      validCheck?.endpoint ||
      "-",
    Type: validCheck?.type || "-",
    Labels:
      validCheck?.labels &&
      Object.entries(validCheck?.labels).map((entry) => {
        const key = entry[0];
        let value = entry[1];
        if (value === "true" || value === true) {
          value = "";
        }
        return (
          <Badge className="mr-1 mb-1" key={key} text={key} value={value} />
        );
      }),
    Owner: validCheck?.owner || "-",
    Interval: validCheck?.interval || "-",
    Location: validCheck?.location || "-",
    Schedule: validCheck?.schedule || "-"
  };

  function handleRangePickerChange(
    newRangePickerValue: ReturnType<typeof getTimeDistance>,
    type?: string
  ) {
    if (!rangePickerValue) {
      setRangePickerValue(getTimeDistance(type ?? "month"));
      return;
    }
    if (type && rangePickerValue) {
      setRangeType(type);
      return;
    }
    setRangePickerValue(newRangePickerValue);
  }

  return (
    <div {...rest}>
      {/* stats section */}
      <div className="flex flex-row flex-wrap mb-2">
        <CheckStat
          containerClass="w-52 mb-4"
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
          containerClass="w-40 mb-4"
          title="Latency (95%)"
          value={<Duration ms={validCheck.latency.p95} />}
        />
        <CheckStat
          containerClass="w-40 mb-4"
          title="Latency  (97%)"
          value={<Duration ms={validCheck.latency.p97} />}
        />
        <CheckStat
          containerClass="w-40 mb-4"
          title="Latency  (99%)"
          value={<Duration ms={validCheck.latency.p99} />}
        />
        <CheckStat
          containerClass="w-40 mb-4"
          title="Severity"
          value={capitalizeFirstLetter(severityValue)}
        />
      </div>
      {/* chart section */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium">Health overview</span>
          <div className="flex flex-col">
            {[
              { id: 1, value: "today", label: "Today" },
              { id: 2, value: "week", label: "Week" },
              { id: 3, value: "month", label: "Month" },
              { id: 4, value: "year", label: "Year" }
            ].map((v) => (
              <span
                className={clsx(
                  "text-sm font-medium hover:bg-blue-100 cursor-pointer flex",
                  v.value === rangeType ? "bold" : "inherit"
                )}
                onClick={() =>
                  handleRangePickerChange(getTimeDistance(v.value), v.value)
                }
              >
                {v.label}
              </span>
            ))}
            {/* <TimeRangePicker
              style={{ width: 256 }}
              from={rangePickerValue[0].toString()}
              to={rangePickerValue[2].toString()}
              onChange={(v) => handleRangePickerChange(v)}
            /> */}
          </div>
        </div>
        <div className="w-full h-52 overflow-visible">
          <Suspense fallback={<div>Loading..</div>}>
            <CanaryStatusChart check={validCheck} />
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
                className={`border border-b-0 border-gray-300 bg-gray-50 overflow-hidden overflow-y-auto h-full relative -mb-px ${mixins.appleScrollbar}`}
              >
                {statusHistoryList && statusHistoryList.length > 0 ? (
                  <StatusHistory check={validCheck} sticky />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-md">
                    No status history available
                  </div>
                )}
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
                          value={value}
                        />
                      ))}
                    </div>
                  }
                />
              </div>
            ),
            class: `flex flex-col overflow-y-auto  border border-gray-300 ${mixins.appleScrollbar}`
          }
        }}
      />
    </div>
  );
}
