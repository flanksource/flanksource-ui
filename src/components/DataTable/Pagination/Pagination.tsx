import clsx from "clsx";
import { UsePaginationInstanceProps, UsePaginationState } from "react-table";
import { Loading } from "../../Loading";

type PaginationProps = React.HTMLProps<HTMLDivElement> &
  Omit<UsePaginationInstanceProps<{}>, "page"> & {
    state: UsePaginationState<{}>;
    loading?: boolean;
  };

export const Pagination = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  state: { pageIndex, pageSize },
  loading,
  className
}: PaginationProps) => {
  return (
    <nav className={clsx("isolate rounded-md", className)}>
      <div className="inline-block pr-2">
        <div className="text-gray-700">
          <div className="inline-block pr-2 font-bold">
            Page {pageIndex + 1} of {pageOptions.length}
          </div>
          <div className="mt-1 inline-block rounded-md shadow-sm pr-2">
            <span className="px-4 py-2 inline-block items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              Go to page
            </span>
            <input
              type="number"
              className="rounded-none rounded-r-md border-gray-300 px-4 py-2 w-24"
              value={pageIndex + 1}
              min={1}
              max={pageCount}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(+page);
              }}
            />
          </div>
          <select
            className="rounded-md w-20 border-gray-300 py-2 pl-3 pr-10 shadow-sm inline-block"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="inline-block -space-x-px">
        <button
          className={clsx(
            "disabled:opacity-50 inline-block rounded-l-md border border-gray-300 bg-white px-2 py-2 text-gray-500",
            canPreviousPage && "hover:bg-gray-100"
          )}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className={clsx(
            "disabled:opacity-50 inline-block border border-gray-300 bg-white px-2 py-2 text-gray-500",
            canPreviousPage && "hover:bg-gray-100"
          )}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        <button
          className={clsx(
            "disabled:opacity-50 inline-block border border-gray-300 bg-white px-2 py-2 text-gray-500",
            canNextPage && "hover:bg-gray-100"
          )}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
        <button
          className={clsx(
            "disabled:opacity-50 inline-block rounded-r-md border border-gray-300 bg-white px-4 py-2 text-gray-500",
            canNextPage && "hover:bg-gray-100"
          )}
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
        {loading && (
          <div className="inline-block">
            <Loading text="loading data..." />
          </div>
        )}
      </div>
    </nav>
  );
};
