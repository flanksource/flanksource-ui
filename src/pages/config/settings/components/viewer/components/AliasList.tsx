interface Props {
  aliases?: string[];
}

export function AliasList({ aliases }: Props) {
  if (!aliases || aliases.length === 0) return null;
  return (
    <ul className="list-inside list-disc space-y-0.5 pl-1">
      {aliases.map((alias, i) => (
        <li
          key={i}
          className="group flex items-center gap-1 font-mono text-xs text-gray-600"
        >
          <span className="flex-1 break-all">{alias}</span>
          <button
            type="button"
            className="shrink-0 text-gray-300 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
            title="Copy"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                if (navigator.clipboard?.writeText) {
                  await navigator.clipboard.writeText(alias);
                  return;
                }

                const textarea = document.createElement("textarea");
                textarea.value = alias;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
              } catch {
                // no-op: avoid throwing from the UI interaction path
              }
            }}
          >
            <iconify-icon icon="codicon:copy" className="text-sm" />
          </button>
        </li>
      ))}
    </ul>
  );
}
