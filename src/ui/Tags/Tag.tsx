import clsx from "clsx";

type TagProps = React.HTMLProps<HTMLDivElement> & {
  variant?: "gray" | "blue";
};

export function Tag({
  children,
  className = "flex flex-row px-1 py-0.5 rounded-md text-xs whitespace-nowrap break-inside-avoid-column",
  variant = "gray",
  ...props
}: TagProps) {
  return (
    <div
      className={clsx(
        className,
        variant === "gray" && "bg-gray-100 text-gray-600",
        variant === "blue" && "bg-blue-100 text-blue-800"
      )}
      {...props}
    >
      {children}
    </div>
  );
}
