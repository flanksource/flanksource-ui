// Guards the PostgREST query built for the config list.
// Ordering must reference table columns, since select aliases are not in scope there.
import { prepareConfigListQuery } from "..";

describe("prepareConfigListQuery", () => {
  it("orders cost columns by their table column, not the select alias", () => {
    const query = new URLSearchParams(
      prepareConfigListQuery({ sortBy: "cost_30d", sortOrder: "desc" })
    );

    expect(query.get("order")).toBe("cost_total_30d.desc");
  });

  it("orders unaliased columns by the column the table sorts on", () => {
    const query = new URLSearchParams(
      prepareConfigListQuery({ sortBy: "name", sortOrder: "asc" })
    );

    expect(query.get("order")).toBe("name.asc");
  });

  it("breaks ties on name when ordering by type", () => {
    const query = new URLSearchParams(
      prepareConfigListQuery({ sortBy: "type", sortOrder: "asc" })
    );

    expect(query.get("order")).toBe("type,name.asc");
  });
});
