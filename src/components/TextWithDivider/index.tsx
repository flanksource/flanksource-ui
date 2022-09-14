import clsx from "clsx";

type TextWithDividerProps = {
  text: string;
} & React.HTMLProps<HTMLDivElement>;

export function TextWithDivider({ text, className }: TextWithDividerProps) {
  return (
    <div className={clsx("flex items-center", className)}>
      <span className="bg-neutral-200 flex-grow h-px mr-1.5" />
      <span>{text}</span>
      <span className="bg-neutral-200 flex-grow h-px ml-1.5" />
    </div>
  );
}
