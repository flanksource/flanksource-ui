import { fetchFeatureFlagsAPI } from "../../api/services/properties";
import { featureToParentMap } from "./features";

export type FeatureFlag = {
  description: string;
  name: string;
  source: string;
  type: string;
  value: string;
};

export type PropertyDBObject = {
  name: string;
  value: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

class PermissionService {
  async loadProperties() {
    return await fetchFeatureFlagsAPI();
  }

  isFeatureDisabled(featureName: string, properties: FeatureFlag[]): boolean {
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
