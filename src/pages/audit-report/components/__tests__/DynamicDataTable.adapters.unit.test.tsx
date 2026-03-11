import { render } from "@testing-library/react";
import DynamicDataTable from "../DynamicDataTable";
import type { ViewColumnDef } from "../../types";

jest.mock("../../../../ui/MRTDataTable/MRTDataTable", () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));

const mockedMRTDataTable = jest.requireMock(
  "../../../../ui/MRTDataTable/MRTDataTable"
).default as jest.Mock;

describe("DynamicDataTable adapters", () => {
  beforeEach(() => {
    mockedMRTDataTable.mockClear();
  });

  it("adapts row objects for MRTDataTable with native-type conversion", () => {
    const columns: ViewColumnDef[] = [
      { name: "name", type: "string" },
      { name: "duration", type: "duration" },
      { name: "created", type: "datetime" },
      { name: "metric", type: "gauge", gauge: { min: 0, max: 100 } },
      { name: "secret", type: "string", hidden: true },
      { name: "grants", type: "grants" },
      { name: "attrs", type: "row_attributes" }
    ];

    const rows = [
      {
        name: "svc-a",
        duration: "5000",
        created: "2024-01-15T10:00:00Z",
        metric: Array.from(
          new TextEncoder().encode(JSON.stringify({ current: 42 }))
        ),
        secret: "should-not-be-visible",
        grants: { role: "viewer" },
        attrs: {
          name: {
            url: "/catalog/123"
          }
        }
      }
    ];

    render(<DynamicDataTable columns={columns} rows={rows} pageCount={1} />);

    expect(mockedMRTDataTable).toHaveBeenCalled();

    const props = mockedMRTDataTable.mock.calls.at(-1)?.[0];
    expect(props.data).toHaveLength(1);

    const adaptedRow = props.data[0];

    expect(adaptedRow.name).toBe("svc-a");
    expect(adaptedRow.duration).toBe(5000);
    expect(adaptedRow.created).toBeInstanceOf(Date);
    expect(adaptedRow.metric).toEqual({ current: 42 });

    // Hidden/internal columns should not be part of visible row payload
    expect(adaptedRow.secret).toBeUndefined();
    expect(adaptedRow.grants).toBeUndefined();

    // row_attributes should be lifted to __rowAttributes
    expect(adaptedRow.__rowAttributes).toEqual({
      name: {
        url: "/catalog/123"
      }
    });
  });
});
