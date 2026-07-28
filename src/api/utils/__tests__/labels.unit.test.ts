import { buildLabelFilterQueries } from "../labels";

describe("label filter queries", () => {
  it("quotes JSON path keys containing a slash", () => {
    expect(
      buildLabelFilterQueries("labels", "topic/mission-control____true:1")
    ).toEqual(['labels->>"topic/mission-control".eq.true']);
  });
});
