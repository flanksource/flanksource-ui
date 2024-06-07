import { useCanaryGraphQuery } from "@flanksource-ui/api/query-hooks/health";
import { HealthCheck } from "@flanksource-ui/api/types/health";
import { isCanaryUI } from "@flanksource-ui/context/Environment";
import { Age } from "@flanksource-ui/ui/Age";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { Stat } from "@flanksource-ui/ui/stats";
import {
  capitalizeFirstLetter,
  toFixedIfNecessary
} from "@flanksource-ui/utils/common";
import mixins from "@flanksource-ui/utils/mixins.module.css";
import { useAtom } from "jotai";
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useSearchParams } from "react-router-dom";
import { Head } from "../../../ui/Head";
import { DropdownStandaloneWrapper } from "../../Dropdown/StandaloneWrapper";
import { TimeRange, timeRanges } from "../../Dropdown/TimeRange";
import { refreshCheckModalAtomTrigger } from "../ChecksListing";
import { Duration } from "../renderers";
import { CanaryCheckDetailsSpecTab } from "./CanaryCheckDetailsSpec";
import { CheckDetailsTabs } from "./CheckDetailsTabs";
import CheckLabels from "./CheckLabels";
import CheckRelationships from "./CheckRelationships";
import { StatusHistory } from "./StatusHistory/StatusHistory";
import { calculateDefaultTimeRangeValue } from "./Utils/calculateDefaultTimeRangeValue";
import { getUptimePercentage } from "./utils";

const Tall = ({ children }: { children: JSX.Element }) => {
  const isTall = useMediaQuery({ minHeight: 992 });
  return isTall ? children : null;
};
const Short = ({ children }: { children: JSX.Element }) => {
  const isShort = useMediaQuery({ maxHeight: 992 });
  return isShort ? children : null;
};

const CanaryStatusChart = React.lazy(() =>
  import("../CanaryStatusChart").then(({ CanaryStatusChart }) => ({
    default: CanaryStatusChart
  }))
);

const CanaryChart = ({
  timeRange,
  check,
  title = "",
  height = "h-52"
}: {
  timeRange: string;
  check: HealthCheck;
  height: string;
  title?: string;
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-2 pr-2">
        {title !== "" && <span className="text-lg font-medium">{title}</span>}
      </div>
      <div className={`w-full ${height} overflow-visible`}>
        <Suspense fallback={<div>Loading...</div>}>
          <CanaryStatusChart timeRange={timeRange} check={check} />
        </Suspense>
      </div>
    </>
  );
};

type CheckDetailsProps = React.HTMLProps<HTMLDivElement> & {
  check?: HealthCheck;
  timeRange: string;
};

export function CheckDetails({ check, ...rest }: CheckDetailsProps) {
  const [refetchTrigger] = useAtom(refreshCheckModalAtomTrigger);
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isShort = useMediaQuery({ maxHeight: 992 });
  const [searchParams] = useSearchParams({
    timeRange: calculateDefaultTimeRangeValue(check)
  });

  const timeRange = useMemo(() => {
    return (
      searchParams.get("timeRange") ?? calculateDefaultTimeRangeValue(check)
    );
  }, [searchParams, check]);

  const { data, refetch } = useCanaryGraphQuery(timeRange, check);

  // Refetch the data when the refetchTrigger changes
  useEffect(() => {
    if (refetchTrigger) {
      refetch();
    }
  }, [refetch, refetchTrigger]);

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
            <Stat
              containerClassName="w-44 mb-4"
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
            <Stat
              containerClassName="w-32 mb-4"
              title="Latency (95%)"
              value={<Duration ms={data?.latency?.p95} />}
            />
            <Stat
              containerClassName="w-32 mb-4"
              title="Latency  (97%)"
              value={<Duration ms={data?.latency?.p97} />}
            />
            <Stat
              containerClassName="w-32 mb-4"
              title="Latency  (99%)"
              value={<Duration ms={data?.latency?.p99} />}
            />
            <Stat
              containerClassName="w-32 mb-4"
              title="Severity"
              value={capitalizeFirstLetter(severityValue)}
            />
            <Stat
              containerClassName="w-28 mb-4"
              title="Last Run"
              value={undefined}
              append={
                <div className="flex flex-col justify-center">
                  <span className="text-sm">
                    <Age from={check.last_runtime} suffix={true} />
                  </span>
                  <span className="text-sm font-medium text-gray-500 pt-1">
                    Transitioned
                  </span>
                  <span className="text-sm">
                    <Age from={check.last_transition_time} suffix={true} />{" "}
                  </span>
                </div>
              }
            />

            <Stat
              containerClassName="w-24 mb-4"
              title="Next Run"
              value={undefined}
              append={
                <div className="flex flex-col justify-center">
                  <span className="text-sm">
                    <Age from={check.next_runtime} suffix={true} />
                  </span>
                </div>
              }
            />

            <Stat
              containerClassName="w-20 mb-4 pb-1"
              title="Time Range"
              value={undefined}
              valueContainerClassName="mt-1"
              append={
                <DropdownStandaloneWrapper
                  className="w-30"
                  paramKey="timeRange"
                  dropdownElem={<TimeRange name="time-range" />}
                  defaultValue={timeRange ?? timeRanges[1].value}
                  name="timeRange"
                />
              }
            />
          </div>

          <Tall>
            <div className="mb-3">
              <CanaryChart
                title="Health Overview"
                check={check}
                timeRange={timeRange}
                height="h-52"
              />
            </div>
          </Tall>
        </div>

        <CheckDetailsTabs
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
              label: "History",
              content: <StatusHistory timeRange={timeRange} check={check} />,
              class: `flex-1 flex flex-col h-full`
            },
            graph: {
              label: "Graph",
              hidden: !isShort,
              content: (
                <Short>
                  <CanaryChart
                    check={check}
                    timeRange={timeRange}
                    height="h-full"
                  />
                </Short>
              ),
              class: `flex-1 flex flex-col overflow-y-auto   ${mixins.appleScrollbar}`
            },
            specs: {
              label: "Spec",
              content: <CanaryCheckDetailsSpecTab check={check} />,
              class: `flex-1 flex flex-col overflow-y-auto  ${mixins.appleScrollbar}`
            },
            related: {
              label: (
                <>
                  Relationships{" "}
                  <Badge
                    text={check.configs.length + (check.components.length ?? 0)}
                    color="gray"
                  />{" "}
                </>
              ),
              content: <CheckRelationships check={check} />,
              class: `flex-1 flex flex-col overflow-y-auto ${mixins.appleScrollbar}`
            }
          }}
        />
      </div>
    </>
  );
}
