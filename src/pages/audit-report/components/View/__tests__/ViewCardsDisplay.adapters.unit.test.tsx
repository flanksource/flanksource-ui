import { render } from "@testing-library/react";
import ViewCardsDisplay from "../ViewCardsDisplay";
import ViewCard from "../ViewCard";
import type { ViewColumnDef } from "../../../types";

jest.mock("../ViewCard", () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));

jest.mock("../../DynamicDataTable", () => ({
  hiddenColumnTypes: ["row_attributes", "grants"]
}));

const mockedViewCard = ViewCard as jest.Mock;

describe("ViewCardsDisplay adapters", () => {
  beforeEach(() => {
    mockedViewCard.mockClear();
  });

  it("adapts object rows before passing them to ViewCard", () => {
    const columns: ViewColumnDef[] = [
      { name: "name", type: "string" },
      { name: "duration", type: "duration" },
      { name: "created", type: "datetime" },
      { name: "metric", type: "gauge", gauge: { min: 0, max: 100 } },
      { name: "grants", type: "grants" },
      { name: "attrs", type: "row_attributes" }
    ];

    const rows = [
      {
        name: "svc-a",
        duration: "7000",
        created: "2024-02-20T08:00:00Z",
        metric: 88,
        grants: { role: "viewer" },
        attrs: {
          metric: {
            max: 120
          }
        }
      }
    ];

    render(<ViewCardsDisplay columns={columns} rows={rows} />);

    expect(mockedViewCard).toHaveBeenCalledTimes(1);

    const firstCallProps = mockedViewCard.mock.calls[0][0];
    const adaptedRow = firstCallProps.row;

    expect(adaptedRow.name).toBe("svc-a");
    expect(adaptedRow.duration).toBe(7000);
    expect(adaptedRow.created).toBeInstanceOf(Date);
    expect(adaptedRow.metric).toBe(88);

    // Hidden/internal columns should not be included in card row payload
    expect(adaptedRow.grants).toBeUndefined();

    // row_attributes should be available to card renderers via __rowAttributes
    expect(adaptedRow.__rowAttributes).toEqual({
      metric: {
        max: 120
      }
    });
  });
});
