import { useState, useEffect } from "react";
import { FolderIcon, FolderOpenIcon } from "@heroicons/react/solid";
import { Icon } from "../Icon";
import { useTable, useFilters } from "react-table";


//Simple recursive TreeView Component
export const TableFileView = ({ columns, data }) => {

    //use the state to keep track of open/closed folders
    const [isExpanded, toggleExpanded] = useState(false);

    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
        setFilter
    } = useTable({
            columns,
            data
        },
        useFilters);

    // Create a state
    const [filterInput, setFilterInput] = useState("");

    // Update the state when input changes
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter("path", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
        setFilterInput(value);
    };


    return (
        <>
            <input
                value={filterInput}
                onChange={handleFilterChange}
                placeholder={"Search by file name"}
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr className="section-table-headline"
                            {...headerGroup.getHeaderGroupProps()}>
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
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td className="folder-table-headline"
                                        {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );

}
