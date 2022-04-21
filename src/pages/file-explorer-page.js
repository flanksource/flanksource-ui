import React, { useState } from "react";
import { TreeView } from "../components/FileExplorer";
import files from "../components/FileExplorer/files.json"

// A third party file-viewer component to render the selected files, purely for demo purposes
import { FileViewer } from "react-file-viewer-v2";


export const FileExplorerPage = () => {
  
  //Use state to transfer the selected file between the child/parent components
  const [selectedFile, setSelectedFile] = useState({});

  const changeFilePath = (file) => {
    if (file.type !== 'folder') {
      setSelectedFile(file);
    }
  }

  const onError = e => {
    console.log(e, "error in file-viewer");
  };

  return (
    <>
      <div className="file-explorer-container">
        <div className="section-headline">browse files</div>
        <TreeView source={files} stateChanger={changeFilePath} />
      </div>
      <div className="file-viewer-container">
        <FileViewer fileType={selectedFile.type} filePath={selectedFile.path} onError={onError} />
      </div>
    </>
  );
};
