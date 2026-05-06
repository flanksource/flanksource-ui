export function ExtraDot({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="h-2 w-2 shrink-0 rounded-full bg-gray-300" />
      <span className="whitespace-nowrap text-xs text-gray-400">{text}</span>
    </span>
  );
}
