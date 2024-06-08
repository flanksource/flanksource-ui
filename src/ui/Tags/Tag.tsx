import clsx from "clsx";

type TagProps = React.HTMLProps<HTMLDivElement> & {
  variant?: "gray";
};

export function Tag({
  children,
  className = "flex flex-row px-1 py-0.5 rounded-md text-xs whitespace-nowrap break-inside-avoid-column",
  variant,
  ...props
}: TagProps) {
  return (
    <div
      className={clsx(
        className,
        variant === "gray" && "bg-gray-100 text-gray-600"
      )}
      {...props}
    >
      {children}
    </div>
  );
}
