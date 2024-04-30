import dynamic from "next/dynamic";
import { EvidenceType } from "../../../../api/types/evidence";

const CodeEditor = dynamic(
  () => import("../../../../ui/CodeEditor").then((m) => m.CodeEditor),
  { ssr: false }
);

const doDEvidenceScriptShortcutsOptions = new Map<
  EvidenceType,
  Record<"label" | "description" | "script", string>[]
>([
  [
    EvidenceType.Topology,
    [
      {
        label: "Component is Health",
        description: "Whether the component are healthy",
        script: "status == 'healthy'"
      }
    ]
  ],
  [EvidenceType.Check, []],
  [EvidenceType.Config, []],
  [EvidenceType.Log, []],
  [EvidenceType.ConfigAnalysis, []],
  [EvidenceType.ConfigChange, []]
]);

type Props = {
  value: string | undefined;
  evidenceType: EvidenceType;
  onChange: (value?: string) => void;
};

export function ScriptStep({ value, onChange, evidenceType }: Props) {
  const options = evidenceType
    ? doDEvidenceScriptShortcutsOptions.get(evidenceType)
    : undefined;

  return (
    <div className="flex flex-col space-y-4">
      {options && options.length > 0 && (
        <>
          <div className="font-semibold">Script Shortcuts</div>
          <div className="flex flex-wrap w-full">
            {options.map((option, index) => (
              <div className="flex flex-col p-1" key={index}>
                <button
                  onClick={() => {
                    onChange(option.script);
                  }}
                  key={option.script}
                  className="p-2 text-blue-500 hover:underline"
                >
                  {option.label}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="font-semibold">Script (Optional)</div>
      <div className="flex flex-col space-y-2 h-[min(400px,calc(100vh-500px))]">
        <CodeEditor onChange={onChange} value={value} />
      </div>
    </div>
  );
}
