import { fetchProperties } from "../../api/services/properties";
import { featureToParentMap } from "./features";

export type Property = {
  name: string;
  value: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

class PermissionService {
  async loadProperties() {
    return await fetchProperties();
  }

  isFeatureDisabled(featureName: string, properties: Property[]): boolean {
    const name = `${featureName}.disable`;
    const parentResource =
      featureToParentMap[featureName as keyof typeof featureToParentMap];
    let isDisabled = Boolean(
      properties?.find((item) => item.name === name && item.value === "true")
    );
    if (isDisabled || !parentResource) {
      return isDisabled;
    }
    return this.isFeatureDisabled(parentResource, properties);
  }
}

export const permissionService = new PermissionService();
