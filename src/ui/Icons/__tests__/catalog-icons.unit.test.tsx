import { findByName as resolveIcon } from "../Icon";

describe("Catalog type icons", () => {
  it.each([
    "Tailscale",
    "tailscale",
    "Tailscale::Device",
    "Kubernetes::Tailscale::Connector"
  ])("maps %s to the inverted Tailscale icon", (type) => {
    const tailscaleIcon = resolveIcon("tailscale-inverted");
    expect(tailscaleIcon).toBeDefined();
    expect(resolveIcon(type)).toBe(tailscaleIcon);
  });

  it.each(["CNPG", "cnpg", "CNPG::Cluster", "Kubernetes::CNPG::Cluster"])(
    "maps %s to the CloudNativePG icon",
    (type) => {
      const cnpgIcon = resolveIcon("cloudnative-pg");
      expect(cnpgIcon).toBeDefined();
      expect(resolveIcon(type)).toBe(cnpgIcon);
    }
  );
});
