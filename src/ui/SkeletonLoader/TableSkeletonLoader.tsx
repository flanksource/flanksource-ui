import clsx from "clsx";

type TableSkeletonLoaderProps = React.HTMLProps<HTMLDivElement>;

export default function TableSkeletonLoader({
  className,
  ...props
}: TableSkeletonLoaderProps) {
  return (
    <div
      className={clsx(
        "flex flex-row w-full animate-pulse justify-center",
        className
      )}
      {...props}
    >
      <div className="flex flex-col flex-1 w-full">
        <div className="flex flex-col space-y-2 flex-1 py-4">
          {Array.of(1, 2, 3, 4, 5, 6, 7, 8).map((v) => (
            <div className="w-full p-2 h-8 bg-gray-200 rounded" key={v}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
