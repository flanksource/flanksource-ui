import { fetchProperties } from "../../api/services/properties";
import { resourceToParentMap } from "./resources";

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

  isFeatureDisabled(resourceName: string, properties: Property[]): boolean {
    const name = `${resourceName}.disable`;
    const parentResource =
      resourceToParentMap[resourceName as keyof typeof resourceToParentMap];
    let isDisabled = Boolean(
      properties.find((item) => item.name === name && item.value === "true")
    );
    if (isDisabled || !parentResource) {
      return isDisabled;
    }
    return this.isFeatureDisabled(parentResource, properties);
  }
}

export const permissionService = new PermissionService();
