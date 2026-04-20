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
            className="shrink-0 text-gray-300 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
            title="Copy"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(alias);
            }}
          >
            <iconify-icon icon="codicon:copy" className="text-sm" />
          </button>
        </li>
      ))}
    </ul>
  );
}
