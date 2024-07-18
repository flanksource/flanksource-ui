import clsx from "clsx";
import { HiOutlineRefresh } from "react-icons/hi";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";

interface IProps extends React.ComponentPropsWithoutRef<"button"> {
  onClick: () => void;
  className?: string;
  animate?: boolean | undefined;
}

export function RefreshButton({
  onClick,
  className,
  animate,
  ...rest
}: IProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={clsx(
        "mr-2 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none",
        className
      )}
      {...rest}
    >
      <span className="sr-only">Refresh</span>
      <ClickableSvg styleFill={false}>
        <HiOutlineRefresh
          className={clsx("h-6 w-6", animate ? "animate-spin" : "")}
          aria-hidden="true"
        />
      </ClickableSvg>
    </button>
  );
}
