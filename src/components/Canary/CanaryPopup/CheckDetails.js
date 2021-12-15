import React from "react";
import { usePrevious } from "../../../utils/hooks";
import { Badge } from "../../Badge";
import { toFormattedDuration } from "../renderers";
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

export function CheckDetails({ check, ...rest }) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  const [val, unit] = toFormattedDuration(validCheck?.latency?.rolling1h);
  const latencyValue = validCheck?.latency?.rolling1h ? `${val}${unit}` : "-";
  const uptimeValue = toFixedIfNecessary(getUptimePercentage(validCheck), 2);
  const validUptime =
    !Number.isNaN(validCheck?.uptime?.passed) &&
    !Number.isNaN(validCheck?.uptime?.failed);
  const severityValue = validCheck?.severity || "-";
  const statusHistoryList = validCheck?.checkStatuses;

  const details = {
    Name:
      validCheck?.name || validCheck?.canaryName || validCheck?.endpoint || "-",
    Type: validCheck?.type || "-",
    Labels: (
      <>
        {validCheck?.labels &&
          Object.entries(validCheck?.labels).map((entry) => {
            const key = entry[0];
            return <Badge className="mr-1 mb-1" key={key} text={key} />;
          })}
      </>
    ),
    Owner: validCheck?.owner || "-",
    Interval: validCheck?.interval || "-",
    Location: validCheck?.location || "-",
    Schedule: validCheck?.schedule || "-"
  };

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
          containerClass="w-52 mb-4"
          title="Latency"
          value={latencyValue}
        />
        <CheckStat
          containerClass="w-52 mb-4"
          title="Severity"
          value={capitalizeFirstLetter(severityValue)}
        />
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
