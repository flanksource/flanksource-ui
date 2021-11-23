import React from "react";
import {
  capitalizeFirstLetter,
  toFixedIfNecessary
} from "../../../utils/common";
import { usePrevious } from "../../../utils/hooks";
import { Badge } from "../../Badge";
import { Icon } from "../../Icon";
import { toFormattedDuration } from "../renderers";

export function CheckTitle({ check, ...rest }) {
  const prevCheck = usePrevious(check);
  const validCheck = check || prevCheck;

  return (
    <div className="flex flex-row mb-6">
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
            className="text-gray-800 text-2xl font-semibold whitespace-nowrap overflow-ellipsis overflow-hidden  pr-4"
          >
            {validCheck?.name}
          </span>
          <span
            className="hidden sm:block"
            title={`Namespace for ${validCheck?.name}`}
            style={{ paddingTop: "1px" }}
          >
            <Badge text={validCheck?.namespace} />
          </span>
        </div>
        {true && (
          <div
            title={`Endpoint for ${validCheck?.name}`}
            className="text-sm text-gray-400 mt-0.5"
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
  const latencyValue = validCheck?.latency?.rolling1h
    ? `${val}${unit}`
    : "None";
  const uptimeValue = getUptimePercentage(validCheck);
  const validUptime =
    !Number.isNaN(validCheck?.uptime?.passed) &&
    !Number.isNaN(validCheck?.uptime?.failed);
  const severityValue = validCheck?.severity || "None";

  return (
    <div className>
      {/* stats section */}
      <div className="flex flex-row flex-wrap mb-2">
        <CheckStat
          containerClass="w-52 mb-4"
          title="Uptime"
          value={
            validUptime ? `${toFixedIfNecessary(uptimeValue, 2)}%` : "None"
          }
          append={
            validUptime && (
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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md font-medium">Health overview</span>
          <span className="text-sm font-medium">(time dropdown)</span>
        </div>
        <div className="bg-gray-100 w-full h-52" />
      </div>
      {/* check details section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md font-medium">Check details</span>
        </div>
        <div className="bg-gray-100 w-full h-52" />
      </div>

      {/* check details section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md font-medium">Check details</span>
        </div>
        <div className="bg-gray-100 w-full h-52" />
      </div>
      {/* check details section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md font-medium">Check details</span>
        </div>
        <div className="bg-gray-100 w-full h-52" />
      </div>
      {/* check details section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md font-medium">Check details</span>
        </div>
        <div className="bg-gray-100 w-full h-52" />
      </div>
    </div>
  );
}

function CheckStat({ title, value, append, containerClass, ...rest }) {
  return (
    <div className={`flex flex-col ${containerClass}`}>
      <div className="text-md font-medium">{title}</div>
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
