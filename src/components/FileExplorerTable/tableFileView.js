import { useState, useEffect } from "react";
import { useTable, useFilters, usePagination } from "react-table";


export const TableFileView = ({ columns, data, stateChanger }) => {
    // Setting up the State
    const [filterInput, setFilterInput] = useState("");

    // Set up react-table 
    const {
        getTableProps,
        getTableBodyProps, // Table body props from react-table
        headerGroups, // Group the table headers
        prepareRow, // Preparing table row - this function is being called for each row before getting the row props
        setFilter,
        // Setting pagination
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
    },
        useFilters,
        usePagination);


    // Update the state on changing the search text
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("path", value);
        setFilterInput(value);
    };

    //Render Table component with Pagination
    return (
        <>
            <input
                className="search-input"
                value={filterInput}
                onChange={handleFilterChange}
                placeholder={"Search by file name"}
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr
                            className="section-table-headline"
                            {...headerGroup.getHeaderGroupProps()}
                        >
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps()}
                                    className="section-headline">
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                {...row.getRowProps()}
                                onClick={() => stateChanger(row.original.path)}
                            >
                                {row.cells.map(cell => {
                                    return <td className="folder-table-headline"
                                        {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="pagination">
                <button
                    className="paging-element"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                >
                    {'<<'}
                </button>
                {' '}
                <button
                    className="paging-element"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    {'<'}
                </button>
                {' '}
                <button
                    className="paging-element"
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                >
                    {'>'}
                </button>
                {' '}
                <button
                    className="paging-element"
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {'>>'}
                </button>
                {' '}
                <span className="paging-element">
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span className="paging-element">
                    | Go to page:{' '}
                    <input
                        className="paging-input"
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                    />
                </span>{' '}
                <select
                    className="paging-element"
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option className="paging-input" key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );

}
