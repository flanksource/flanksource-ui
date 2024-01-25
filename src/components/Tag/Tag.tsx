import clsx from "clsx";

type TagProps = React.HTMLProps<HTMLDivElement>;

export function Tag({ children, className, ...props }: TagProps) {
  return (
    <div
      className={clsx(
        "text-center align-baseline min-w-8 text-2xs rounded-4px font-bold break-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
