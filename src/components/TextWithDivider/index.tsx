import clsx from "clsx";
import "./index.css";

type TextWithDividerProps = {
  text: string;
} & React.HTMLProps<HTMLDivElement>;

export function TextWithDivider({ text, className }: TextWithDividerProps) {
  return <div className={clsx("text-divider", className)}>{text}</div>;
}
