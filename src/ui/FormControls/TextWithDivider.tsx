import clsx from "clsx";

type TextWithDividerProps = {
  text: string;
} & React.HTMLProps<HTMLDivElement>;

export function TextWithDivider({ text, className }: TextWithDividerProps) {
  return (
    <div className={clsx("flex items-center", className)}>
      <span className="mr-1.5 h-px flex-grow bg-neutral-200" />
      <span>{text}</span>
      <span className="ml-1.5 h-px flex-grow bg-neutral-200" />
    </div>
  );
}
