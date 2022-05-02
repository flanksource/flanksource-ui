import React, { useState, useMemo } from "react";
import files from "../components/FileExplorerTable/files.json"
import { TableFileView } from "../components/FileExplorerTable";
import { Icon } from "../components/Icon";


export const FileExplorerPage = () => {

  //Use state to transfer the selected file between the child/parent components
  const [selectedFile, setSelectedFile] = useState("");

  const changeFilePath = (file) => {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        console.log(data);
        setSelectedFile(data);
      });
  }

  /*------ Section Helpers ------*/

  function formatSize(numberString) {
    if (numberString > 1024) {
      numberString = numberString / 1024;
      return numberString + "MB";
    }
    else {
      return "0." + numberString + "MB";
    }
  }

  function formatDate(dateString) {
    try {
      const year = +dateString.substring(0, 4);
      const month = +dateString.substring(6, 7);
      const day = +dateString.substring(7, 9);

      console.log(new Date(year, month - 1, day).toDateString());

      return new Date(year, month - 1, day).toDateString();
    }
    catch {
      return dateString
    }
  }

  // Custom component, rendering the Icon of the file
  const IconCell = ({ icon }) => {
    return (
      <>
        <Icon name={icon} className="h-5 w-5 text-gray-500-1" size="xs" />
      </>
    )
  };

  const columns = useMemo(
    () => [
      {
        Header: "Files",
        columns: [
          {
            Header: "Type",
            accessor: "icon",
            Cell: ({ cell: { value } }) => <IconCell icon={value} />
          },
          {
            Header: "Name",
            accessor: "path"
          }
        ]
      },
      {
        Header: "Details",
        columns: [
          {
            Header: "Size",
            accessor: "size",
            Cell: ({ cell: { value } }) => <div> {formatSize(value)} </div>
          },
          {
            Header: "Created",
            accessor: "createdDate",
            Cell: ({ cell: { value } }) => <div> {formatDate(value)} </div>
          },
          {
            Header: "Last Modified",
            accessor: "lastModified",
            Cell: ({ cell: { value } }) => <div> {formatDate(value)} </div>
          }
        ]
      }
    ],
    []
  );

  return (
    <>
      <div className="file-explorer-container">
        <TableFileView columns={columns} data={files} stateChanger={changeFilePath} />
      </div>
      <div className="file-viewer-container">
        <textarea value={selectedFile} onChange={changeFilePath} className="file-display" multiline={true} />
      </div>
    </>
  );
};
