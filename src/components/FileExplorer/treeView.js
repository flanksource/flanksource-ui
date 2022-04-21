import { useState, useEffect } from "react";
import { FolderIcon, FolderOpenIcon } from "@heroicons/react/solid";
import { Icon } from "../Icon";


//Simple recursive TreeView Component
export const TreeView = ({ stateChanger, source }) => {

    //use the state to keep track of open/closed folders
    const [isExpanded, toggleExpanded] = useState(false);

    //First render the base of the recursion - the file element
    if (source.type !== 'folder') {

        return (
            <div className="file" onClick={() => {
                stateChanger(source);
            }}>
                <Icon name={source.icon} className="h-5 w-5 text-gray-500-1" size="xs" />
                <h3 className="file-headline">
                    {
                        //Check the name property, if no name property - get the name from the file path
                        source.name ? source.name : source.path.split("/").pop()
                    }
                </h3>
            </div>
        )
    }

    return (
        <div className="folder">
            <h2 className="folder-headline" onClick={() =>
                toggleExpanded(!isExpanded)
            }
            >
                {
                    isExpanded ?
                        <FolderOpenIcon className="h-5 w-5 text-gray-500" />
                        :
                        <FolderIcon className="h-5 w-5 text-gray-500" />
                }
                {
                    //Check the name property, if no name property - get the name from the file path
                    source.name ? source.name : source.path.split("/").pop()
                }
            </h2>
            {   //recursively render the component for any child elemnts
                isExpanded && source.items.map((item) => <TreeView stateChanger={stateChanger} source={item} />)
            }
        </div>
    );
}
