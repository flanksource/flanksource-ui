import { Rback } from "../axios";
import { RbacManifest, RbacResource } from "../types/rbacResources";

function objectPath(resource: RbacResource, namespace: string, name: string) {
  return `/${resource}/${encodeURIComponent(namespace)}/${encodeURIComponent(name)}`;
}

// The response is the stored object, with error and error_reason set when it's
// saved but not in effect, e.g. a Role whose Scope doesn't exist.
export async function createRbacObject<T>(
  resource: RbacResource,
  manifest: RbacManifest<unknown>
): Promise<T> {
  const response = await Rback.post<T>(`/${resource}`, manifest);
  return response.data;
}

export async function updateRbacObject<T>(
  resource: RbacResource,
  manifest: RbacManifest<unknown>
): Promise<T> {
  const { namespace, name } = manifest.metadata;
  const response = await Rback.put<T>(
    objectPath(resource, namespace, name),
    manifest
  );
  return response.data;
}

export async function deleteRbacObject(
  resource: RbacResource,
  namespace: string,
  name: string
): Promise<void> {
  await Rback.delete(objectPath(resource, namespace, name));
}
