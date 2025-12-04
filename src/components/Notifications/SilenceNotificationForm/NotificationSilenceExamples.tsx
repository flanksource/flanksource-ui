import { ChevronRightIcon } from "@heroicons/react/outline";
import { ReactNode, useState } from "react";

const filterExamples = [
  {
    code: `config.type == "AWS::RDS::DBInstance" && jsonpath("$['account-name']", tags) == "flanksource" && config.config.Engine == "postgres"`,
    description:
      "Silence planned maintenance and brief healthy/unhealthy flaps for RDS Postgres instances in flanksource account"
  },
  {
    code: 'name == "postgresql" && config.type == "Kubernetes::StatefulSet"',
    description: "Silence notifications from all postgresql statefulsets"
  },
  {
    code: 'name.startsWith("my-app-")',
    description: "Silence notifications from pods starting with 'my-app-'"
  },
  {
    code: `matchQuery(.config, "type=Kubernetes::Pod,Kubernetes::Deployment")`,
    description: "Silence notifications from all pods and deployments"
  },
  {
    code: `jsonpath("$['Expected-Fail']", labels) == "true"`,
    description:
      "Silence notifications from health checks that are expected to fail"
  },
  {
    code: '"helm.sh/chart" in labels',
    description: "Silence notifications from resources of a Helm chart"
  }
];

const selectorsExamples = [
  {
    title: "Silence notifications from all jobs with low severity",
    code: `selectors:
  - types:
      - Kubernetes::Job
    tagSelector: severity=low
`
  },
  {
    title: "Silence notifications from ap-south-1 region for the test account",
    code: `selectors:
  - tagSelector: region=ap-south-1,account=830064254263
`
  },
  {
    title: "Silence health checks expected to fail",
    code: `selectors:
  - labelSelector: Expected-Fail=true
`
  },
  {
    title:
      "Silence notifications from pods starting with specific name pattern",
    code: `selectors:
  - types:
      - Kubernetes::Pod
    nameSelector: my-app-*
`
  },
  {
    title: "Silence notifications from resources of a specific Helm chart",
    code: `selectors:
  - tagSelector: helm.sh/chart=my-app-1.0.0
`
  }
];

function ExampleSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-sm text-gray-700 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left text-blue-700 hover:text-blue-800"
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronRightIcon
          className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
        />
        <span className="font-medium">{title}</span>
      </button>
      {open && <div className="mt-3 space-y-3">{children}</div>}
    </div>
  );
}

export function FilterExamples() {
  return (
    <ExampleSection title="Examples">
      {filterExamples.map((example, index) => (
        <div
          key={`${example.code}-${index}`}
          className="overflow-hidden rounded-md border border-gray-200 bg-white"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
            <p className="text-sm font-medium text-gray-700">
              {example.description}
            </p>
          </div>
          <div className="p-3">
            <code className="block overflow-x-auto rounded border bg-gray-50 p-2 font-mono text-xs text-gray-800">
              {example.code}
            </code>
          </div>
        </div>
      ))}
    </ExampleSection>
  );
}

export function SelectorExamples() {
  return (
    <ExampleSection title="Examples">
      {selectorsExamples.map((example, index) => (
        <div
          key={`${example.title}-${index}`}
          className="overflow-hidden rounded-md border border-gray-200 bg-white"
        >
          <div className="border-b border-gray-200 bg-gray-50 px-3 py-2">
            <p className="text-sm font-medium text-gray-700">{example.title}</p>
          </div>
          <div className="p-3">
            <pre className="overflow-x-auto whitespace-pre-wrap rounded border bg-gray-50 p-2 font-mono text-xs text-gray-800">
              {example.code}
            </pre>
          </div>
        </div>
      ))}
    </ExampleSection>
  );
}
