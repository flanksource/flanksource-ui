import clsx from "clsx";
import { HiOutlineRefresh } from "react-icons/hi";

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
        "bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none mr-2",
        className
      )}
      {...rest}
    >
      <span className="sr-only">Refresh</span>
      <HiOutlineRefresh
        className={clsx("h-6 w-6", animate ? "animate-spin" : "")}
        aria-hidden="true"
      />
    </button>
  );
}
