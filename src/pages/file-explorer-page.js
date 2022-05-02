import React, { useState, useMemo } from "react";
import { TreeView } from "../components/FileExplorer";
import files from "../components/FileExplorerTable/files.json"
import { TableFileView } from "../components/FileExplorerTable";
import { Icon } from "../components/Icon";
import DocViewer from "react-doc-viewer";
import Moment from 'moment';
//import fs from 'fs';

// A third party file-viewer component to render the selected files, purely for demo purposes
import { FileViewer } from "react-file-viewer-v2";


export const FileExplorerPage = () => {

  //Use state to transfer the selected file between the child/parent components
  const [selectedFile, setSelectedFile] = useState({});

  const changeFilePath = (file) => {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        // Do something with your data
        console.log(data);
        setSelectedFile(data);
      });
  }



  function formatSize(numberString) {
    let number = parseFloat(numberString);
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
