import { ConfigChange } from "@flanksource-ui/api/types/configs";
import { Age } from "@flanksource-ui/ui/Age";
import { ChangeIcon } from "@flanksource-ui/ui/Icons/ChangeIcon";
import { relativeDateTime } from "@flanksource-ui/utils/date";
import dayjs from "dayjs";
import { useMemo } from "react";
import {
  ChartShallowDataShape,
  ChartTooltip,
  ChartZoomPan,
  LinearXAxis,
  LinearXAxisTickLabel,
  LinearXAxisTickLine,
  LinearXAxisTickSeries,
  LinearYAxis,
  LinearYAxisTickLabel,
  LinearYAxisTickSeries,
  ScatterPlot,
  ScatterPoint,
  ScatterSeries
} from "reaviz";
import ConfigsTypeIcon from "../ConfigsTypeIcon";

type ConfigChangesGraphProps = {
  changes: ConfigChange[];
  onItemClicked?: (change: ConfigChange) => void;
};

export default function ConfigChangesGraph({
  changes,
  onItemClicked = () => {}
}: ConfigChangesGraphProps) {
  const data: ChartShallowDataShape[] = useMemo(() => {
    // group changes by config_id, then map to a scatter plot point
    return changes.map((change) => {
      return {
        key: dayjs(change.first_observed).toDate(),
        data: change.config?.name!,
        metadata: change
      };
    });
  }, [changes]);

  return (
    <div className="h-full w-full">
      <ScatterPlot
        data={data}
        zoomPan={<ChartZoomPan />}
        yAxis={
          <LinearYAxis
            type="category"
            tickSeries={
              <LinearYAxisTickSeries
                label={
                  <LinearYAxisTickLabel
                    padding={3}
                    fontSize={12}
                    format={(v) => {
                      return v;
                    }}
                  />
                }
              />
            }
          />
        }
        xAxis={
          <LinearXAxis
            type="time"
            scale={{ type: "time" }}
            tickSeries={
              <LinearXAxisTickSeries
                line={<LinearXAxisTickLine position="center" />}
                label={
                  <LinearXAxisTickLabel
                    padding={3}
                    format={(v) => {
                      return relativeDateTime(v);
                    }}
                  />
                }
              />
            }
          />
        }
        series={
          <ScatterSeries
            point={
              <ScatterPoint
                tooltip={
                  <ChartTooltip
                    followCursor={true}
                    content={(data: any) => {
                      const count = (data.metadata as ConfigChange).count;
                      const firstObserved = (data.metadata as ConfigChange)
                        .first_observed;
                      const summary = (data.metadata as ConfigChange).summary;

                      return (
                        <div className="flex flex-col gap-1 rounded-lg bg-gray-100 p-2 text-black shadow-sm">
                          <ConfigsTypeIcon
                            config={(data.metadata as ConfigChange).config}
                          >
                            {(data.metadata as ConfigChange).config?.name}
                          </ConfigsTypeIcon>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-row items-center justify-center gap-2 text-xs">
                              <span className="flex flex-row items-center gap-1 font-semibold">
                                <ChangeIcon change={data.metadata} />
                                {(data.metadata as ConfigChange).change_type}
                              </span>
                              <span className="font-semibold">
                                <Age
                                  from={
                                    (data.metadata as ConfigChange)
                                      .first_observed
                                  }
                                />
                                {(count || 1) > 1 && (
                                  <span className="inline-block pl-1 text-gray-500">
                                    (x{count} over <Age from={firstObserved} />)
                                  </span>
                                )}
                              </span>
                            </div>
                            <p>{summary}</p>
                          </div>
                        </div>
                      );
                    }}
                  />
                }
                className={"bg-gray-500"}
                size={20}
                symbol={(data) => {
                  const change = data.metadata;
                  return <ChangeIcon change={change} />;
                }}
                onClick={(data) => {
                  onItemClicked(data.metadata as ConfigChange);
                }}
              />
            }
          />
        }
      />
    </div>
  );
}
