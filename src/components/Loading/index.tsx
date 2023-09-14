import clsx from "clsx";
import { Oval } from "react-loading-icons";

type Props = {
  text?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function Loading({ text = "Loading...", className, ...props }: Props) {
  return (
    <div
      className={clsx("flex justify-center items-center", className)}
      {...props}
    >
      <Oval stroke="gray" height="1.5em" />
      <span className="text-sm ml-3">{text}</span>
    </div>
  );
}
