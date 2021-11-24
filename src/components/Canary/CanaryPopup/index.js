import React from "react";
import { format } from "timeago.js";
import { usePrevious } from "../../../utils/hooks";
import { Badge } from "../../Badge";
import { Icon } from "../../Icon";
import { Duration, toFormattedDuration } from "../renderers";
import { AccordionBox } from "../../AccordionBox";
import { Table } from "../../Table";
import { CanaryStatus } from "../status";
import { isEmpty } from "../utils";
import {
  capitalizeFirstLetter,
  toFixedIfNecessary
} from "../../../utils/common";

export function CheckTitle({ check, className, ...rest }) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  return (
    <div className={`flex flex-row ${className}`} {...rest}>
      <div className="w-14 flex-shrink-0 pr-3">
        <Icon
          name={validCheck?.icon || validCheck?.type}
          className="w-full h-12"
          size="2xl"
        />
      </div>
      <div className="overflow-hidden mr-10">
        <div className="flex flex-row items-center">
          <span
            title={validCheck?.name}
            className="text-gray-800 text-2xl font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden pr-4"
          >
            {validCheck?.name}
          </span>
          <span
            className="hidden sm:block "
            title={`Namespace for ${validCheck?.name}`}
            style={{ paddingTop: "1px" }}
          >
            <Badge text={validCheck?.namespace} />
          </span>
        </div>
        {true && (
          <div
            title={`Endpoint for ${validCheck?.name}`}
            className="text-sm text-gray-400 mt-0.5 overflow-x-hidden overflow-ellipsis break-all"
          >
            {validCheck?.endpoint}
          </div>
        )}
        <span
          className="block sm:hidden mt-2"
          title={`Namespace for ${validCheck?.name}`}
        >
          <Badge text={validCheck?.namespace} />
        </span>
      </div>
    </div>
  );
}

export function CheckDetails({ check, ...rest }) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  console.log("check > ", validCheck);

  const [val, unit] = toFormattedDuration(validCheck?.latency?.rolling1h);
  const latencyValue = validCheck?.latency?.rolling1h ? `${val}${unit}` : "-";
  const uptimeValue = toFixedIfNecessary(getUptimePercentage(validCheck), 2);
  const validUptime =
    !Number.isNaN(validCheck?.uptime?.passed) &&
    !Number.isNaN(validCheck?.uptime?.failed);
  const severityValue = validCheck?.severity || "-";

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
    Owner: validCheck?.owner || "-"
  };

  const hiddenDetails = {
    Interval: validCheck?.interval || "-",
    Location: validCheck?.location || "-",
    Schedule: validCheck?.schedule || "-"
  };

  return (
    <div {...rest}>
      {/* stats section */}
      <div className="flex flex-row flex-wrap mb-4">
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
      {/* chart section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium">Health overview</span>
          <span className="text-sm font-medium">(time dropdown)</span>
        </div>
        <div className="bg-gray-100 w-full h-52" />
      </div>
      {/* check details section */}
      <div className="mb-10">
        <div className="flex mb-2">
          <span className="text-lg font-medium">Check details</span>
        </div>
        <AccordionBox
          content={
            <div className="flex flex-row flex-wrap">
              {Object.entries(details).map(([label, value]) => (
                <DetailField
                  key={label}
                  className="w-1/2 mb-3"
                  label={label}
                  value={value}
                />
              ))}
            </div>
          }
          hiddenContent={
            <div className="flex flex-row flex-wrap">
              {Object.entries(hiddenDetails).map(([label, value]) => (
                <DetailField
                  key={label}
                  className="w-1/2 mb-3"
                  label={label}
                  value={value}
                />
              ))}
            </div>
          }
        />
      </div>
      {/* status history section */}
      <div className="mb-10">
        <div className="flex mb-2">
          <span className="text-lg font-medium">Status history</span>
        </div>
        <StatusHistory check={validCheck} />
      </div>
    </div>
  );
}

function CheckStat({ title, value, append, containerClass, ...rest }) {
  return (
    <div className={`flex flex-col ${containerClass}`}>
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="flex">
        <span className="text-4xl font-bold">{value}</span>
        {append}
      </div>
    </div>
  );
}

export function getUptimePercentage(check) {
  const uptime = check?.uptime;
  const passed = uptime?.passed;
  const failed = uptime?.failed;
  const valid = !Number.isNaN(passed) && !Number.isNaN(failed);
  return valid ? (passed / (passed + failed)) * 100 : null;
}

function DetailField({ label, value, className, ...rest }) {
  return (
    <div className={`flex flex-col flex-shrink-0 pr-6 ${className}`}>
      <div className="text-sm font-medium text-gray-500 break-all">{label}</div>
      <div className="mt-1 text-sm text-gray-900 break-all">{value}</div>
    </div>
  );
}

function StatusHistory({ check }) {
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
      />
    )
  );
}
