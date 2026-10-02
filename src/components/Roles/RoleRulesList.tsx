import { RoleRule } from "@flanksource-ui/api/types/roles";

// Rules of a Role that can't be edited in the UI, e.g. one from a Kubernetes CRD.
export default function RoleRulesList({ rules }: { rules: RoleRule[] }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="form-label">Rules</label>
      <div className="overflow-x-auto rounded-md border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">Rule</th>
              <th className="px-3 py-2">Action</th>
              <th className="px-3 py-2">Resource scope</th>
              <th className="px-3 py-2">Target scope</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.name} className="border-t border-gray-200">
                <td className="px-3 py-2">
                  <div>{rule.name}</div>
                  {rule.description && (
                    <div className="text-xs text-gray-500">
                      {rule.description}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className="font-mono">{rule.action}</span>
                  {rule.deny && (
                    <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-800">
                      deny
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">{rule.resource?.scopeRef}</td>
                <td className="px-3 py-2">{rule.target?.scopeRef ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
