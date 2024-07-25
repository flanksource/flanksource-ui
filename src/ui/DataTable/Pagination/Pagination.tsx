import clsx from "clsx";
import { UsePaginationInstanceProps, UsePaginationState } from "react-table";
import { Loading } from "../../Loading";

export type PaginationType = "lean" | "complete" | "virtual";

export type PaginationProps = React.HTMLProps<HTMLDivElement> &
  Omit<UsePaginationInstanceProps<{}>, "page"> & {
    state: UsePaginationState<{}>;
    loading?: boolean;
    paginationType: PaginationType;
  };

const itemsPerPage = [5, 10, 25, 50, 100, 150, 200, 250, 300, 500, 1000];

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
  paginationType,
  className
}: PaginationProps) => {
  return (
    <nav className={clsx("isolate rounded-md px-4", className)}>
      <div className="inline-block pr-2">
        <div className="text-gray-700">
          <div className="inline-block pr-2 font-bold">
            Page {pageIndex + 1} of {pageOptions.length}
          </div>
          <div
            className={clsx(
              "mt-1 inline-block rounded-md pr-2 shadow-sm",
              paginationType === "complete" ? "" : "hidden"
            )}
          >
            <span className="inline-block items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-4 py-2 text-gray-500">
              Go to page
            </span>
            <input
              type="number"
              className="w-24 rounded-none rounded-r-md border-gray-300 px-4 py-2"
              value={pageIndex + 1}
              min={1}
              max={pageCount}
              readOnly={pageCount === 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(+page);
              }}
            />
          </div>
          <select
            className={clsx(
              "w-35 inline-block rounded-md border-gray-300 py-2 pl-3 pr-10 shadow-sm",
              paginationType === "complete" ? "" : "hidden"
            )}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {itemsPerPage.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="inline-flex items-center -space-x-px">
        <button
          className={clsx(
            "inline-block rounded-l-md border border-gray-300 bg-white px-2 py-2 text-gray-500 disabled:opacity-50",
            canPreviousPage && "hover:bg-gray-100"
          )}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className={clsx(
            "inline-block border border-gray-300 bg-white px-2 py-2 text-gray-500 disabled:opacity-50",
            canPreviousPage && "hover:bg-gray-100"
          )}
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        <button
          className={clsx(
            "inline-block border border-gray-300 bg-white px-2 py-2 text-gray-500 disabled:opacity-50",
            canNextPage && "hover:bg-gray-100"
          )}
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
        <button
          className={clsx(
            "inline-block rounded-r-md border border-gray-300 bg-white px-4 py-2 text-gray-500 disabled:opacity-50",
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
