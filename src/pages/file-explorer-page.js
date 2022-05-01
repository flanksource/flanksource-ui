import React, { useState, useMemo } from "react";
import { TreeView } from "../components/FileExplorer";
import files from "../components/FileExplorerTable/files.json"
import { TableFileView } from "../components/FileExplorerTable";
import { Icon } from "../components/Icon";

// A third party file-viewer component to render the selected files, purely for demo purposes
import { FileViewer } from "react-file-viewer-v2";


export const FileExplorerPage = () => {

  //Use state to transfer the selected file between the child/parent components
  const [selectedFile, setSelectedFile] = useState({});

  const changeFilePath = (file) => {
      setSelectedFile(file);
      console.log(file);
  }

  const onError = e => {
    console.log(e, "error in file-viewer");
  };

  // Custom component to render Genres 
  const IconCell = ({ icon }) => {
    return (
      <>
        <Icon name={icon} className="h-5 w-5 text-gray-500-1" size="xs" />
      </>
    )
  };


  /* 
    - Columns is a simple array right now, but it will contain some logic later on. It is recommended by react-table to memoize the columns data
    - Here in this example, we have grouped our columns into two headers. react-table is flexible enough to create grouped table headers
    "path": "data/JordanAtanasovCV.pdf",
            "size": "102400",
            "createdDate": "2022-01-01",
            "lastModified": "2022-02-02",
            "icon": "star"
  */
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
            accessor: "size"
          },
          {
            Header: "Created",
            accessor: "createdDate"
          },
          {
            Header: "Last Modified",
            accessor: "lastModified"
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
    </>
  );
};
