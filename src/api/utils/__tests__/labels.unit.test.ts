import { buildLabelFilterQueries } from "../labels";

describe("label filter queries", () => {
  it("preserves safe JSON path keys", () => {
    expect(buildLabelFilterQueries("labels", "topic____true:1")).toEqual([
      "labels->>topic.eq.true"
    ]);
  });

  it("quotes JSON path keys containing a slash", () => {
    expect(
      buildLabelFilterQueries("labels", "topic/mission-control____true:1")
    ).toEqual(['labels->>"topic/mission-control".eq.true']);
  });

  it("escapes JSON path keys containing a double quote", () => {
    expect(
      buildLabelFilterQueries("labels", 'topic"mission-control____true:1')
    ).toEqual(['labels->>"topic\\"mission-control".eq.true']);
  });

  it("escapes JSON path keys containing a backslash", () => {
    expect(
      buildLabelFilterQueries("labels", "topic\\mission-control____true:1")
    ).toEqual(['labels->>"topic\\\\mission-control".eq.true']);
  });
});
