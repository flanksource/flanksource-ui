import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import * as topologyApi from "../../../api/services/topology";
import { CanaryStatusChart } from "../CanaryStatusChart";

jest.mock("../../../api/services/topology", () => ({
  getCanaryGraph: jest.fn()
}));

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ScatterChart: ({
    children,
    data
  }: {
    children: React.ReactNode;
    data: { time: string }[];
  }) => (
    <div data-testid="canary-status-chart" data-times={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Scatter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CartesianGrid: () => null,
  Cell: () => null,
  Tooltip: () => null,
  XAxis: () => null,
  YAxis: () => null
}));

const statuses = [
  { time: "2025-01-01T10:00:00Z", status: true, duration: 100 },
  { time: "2025-01-01T10:01:00Z", status: false, duration: 300 },
  { time: "2025-01-01T10:02:00Z", status: true, duration: 200 }
];

const graphData = {
  duration: 200,
  runnerName: "runner",
  status: statuses,
  latency: { rollingIn: 200 },
  uptime: { passed: 2, failed: 1 }
};

const queryKey = ["canaryGraph", "check-1", "1h"];

function renderChart(queryClient: QueryClient) {
  return render(
    <QueryClientProvider client={queryClient}>
      <CanaryStatusChart
        check={{ id: "check-1" }}
        timeRange="1h"
        width={600}
        height={300}
      />
    </QueryClientProvider>
  );
}

describe("CanaryStatusChart", () => {
  it("preserves cached graph data across unmounts while keeping display order stable", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Infinity
        }
      }
    });
    (topologyApi.getCanaryGraph as jest.Mock).mockResolvedValue({
      data: graphData
    });

    const expectedDisplayOrder = [...statuses].reverse();
    const view = renderChart(queryClient);

    expect(await screen.findByTestId("canary-status-chart")).toHaveAttribute(
      "data-times",
      JSON.stringify(expectedDisplayOrder)
    );
    expect(queryClient.getQueryData(queryKey)).toEqual(graphData);
    expect(graphData.status).toEqual(statuses);

    view.unmount();
    renderChart(queryClient);

    expect(await screen.findByTestId("canary-status-chart")).toHaveAttribute(
      "data-times",
      JSON.stringify(expectedDisplayOrder)
    );
    expect(queryClient.getQueryData(queryKey)).toEqual(graphData);
    expect(graphData.status).toEqual(statuses);
    expect(topologyApi.getCanaryGraph).toHaveBeenCalledTimes(1);
  });
});
