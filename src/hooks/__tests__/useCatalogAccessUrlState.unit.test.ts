import { resolveCatalogAccessMode } from "../useCatalogAccessUrlState";

describe("resolveCatalogAccessMode", () => {
  it.each([
    ["", "group-config"],
    ["mode=group-config", "group-config"],
    ["mode=group-user", "group-user"],
    ["groupBy=config", "group-config"],
    ["groupBy=user", "group-user"],
    ["mode=flat", "group-config"],
    ["groupBy=none", "group-config"]
  ])("resolves %s to %s", (query, expected) => {
    expect(resolveCatalogAccessMode(new URLSearchParams(query))).toBe(expected);
  });

  it("uses the flat view when a grouped row has been selected", () => {
    expect(
      resolveCatalogAccessMode(
        new URLSearchParams(
          "mode=group-config&external_user_id=include:user-id"
        )
      )
    ).toBe("flat");
  });
});
