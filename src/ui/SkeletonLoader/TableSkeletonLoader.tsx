import clsx from "clsx";

type TableSkeletonLoaderProps = React.HTMLProps<HTMLDivElement>;

export default function TableSkeletonLoader({
  className,
  ...props
}: TableSkeletonLoaderProps) {
  return (
    <div
      className={clsx(
        "flex w-full animate-pulse flex-row justify-center",
        className
      )}
      {...props}
    >
      <div className="flex w-full flex-1 flex-col">
        <div className="flex flex-1 flex-col space-y-2 py-4">
          {Array.of(1, 2, 3, 4, 5, 6, 7, 8).map((v) => (
            <div className="h-8 w-full rounded bg-gray-200 p-2" key={v}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
