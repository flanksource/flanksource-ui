import { findByName as resolveIcon } from "../Icon";

describe("Catalog type icons", () => {
  it.each(["Tailscale", "tailscale"])(
    "maps %s to the inverted Tailscale icon",
    (type) => {
      const tailscaleIcon = resolveIcon("tailscale-inverted");
      expect(tailscaleIcon).toBeDefined();
      expect(resolveIcon(type)).toBe(tailscaleIcon);
    }
  );

  it.each(["CNPG", "cnpg"])("maps %s to the CloudNativePG icon", (type) => {
    const cnpgIcon = resolveIcon("cloudnative-pg");
    expect(cnpgIcon).toBeDefined();
    expect(resolveIcon(type)).toBe(cnpgIcon);
  });

  it.each([
    "Tailscale::Device",
    "Kubernetes::Tailscale::Connector",
    "CNPG::Cluster",
    "Kubernetes::CNPG::Cluster"
  ])("does not assign a logo to child type %s", (type) => {
    expect(resolveIcon(type)).toBeUndefined();
  });
});
