import { RbacManifest } from "@flanksource-ui/api/types/rbacResources";
import { JSONViewer } from "@flanksource-ui/ui/Code/JSONViewer";
import YAML from "yaml";

// Shows a stored object as the manifest the API and kubectl accept.
export function RbacObjectYaml({
  manifest
}: {
  manifest: RbacManifest<unknown>;
}) {
  return (
    <div className="rounded border border-gray-300 bg-gray-50">
      <JSONViewer
        code={YAML.stringify(manifest)}
        format="yaml"
        showLineNo={false}
      />
    </div>
  );
}
