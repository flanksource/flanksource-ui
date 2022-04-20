import React, { useEffect, useState } from "react";
import { getAllSavedQueries } from "../../api/services/configs";
import { Dropdown } from "../Dropdown";
import { Modal } from "../Modal";

//   const columnSelectDropdownStyles = {
//     valueContainer: (provided) => ({
//       ...provided
//     }),
//     option: (provided) => ({
//       ...provided,
//       fontSize: "14px"
//     }),
//     multiValueLabel: (provided) => ({
//       ...provided,
//       fontSize: "12px"
//     }),
//     container: (provided) => ({
//       ...provided
//     })
//   };

export const QueryBuilder = () => {
  //   const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryList, setQueryList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    getAllSavedQueries().then((res) => {
      setQueryList(res.data);
    });
  }, []);

  const exampleQueries = queryList.reduce(
    (acc, current) => {
      acc[current.id] = {
        id: current.id,
        name: current.id,
        description: current.description,
        value: current.id
      };
      return acc;
    },
    {
      null: {
        id: null,
        name: "None",
        description: "None",
        value: null
      }
    }
  );

  return (
    <div
      className="flex flex-col border border-gray-300 rounded-md p-4 pb-2 mt-4"
      style={{ maxWidth: "1200px", minWidth: "700px" }}
    >
      <div className="flex items-center mb-4 -mt-8">
        <Dropdown
          emptyable
          className="w-full mr-2"
          items={exampleQueries}
          onChange={(value) => setSelectedQuery(value)}
          value={selectedQuery}
          prefix={
            <>
              <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                Preset Query:
              </div>
            </>
          }
        />
        <button
          className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white whitespace-nowrap text-gray-800"
          type="button"
          onClick={() => setModalIsOpen(true)}
        >
          Save current to preset
        </button>
      </div>

      <div className="flex flex-wrap">
        <input
          type="text"
          className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-400 block py-2 sm:text-sm border-gray-300 rounded-md mb-2"
          style={{ minWidth: "300px" }}
          placeholder="Query text (name, namespace, type, or description)"
        />
        {/* <MultiSelectDropdown
            placeholder="Columns"
            className="w-full mr-2 mb-2"
            styles={columnSelectDropdownStyles}
            options={columns} // should be dynamic
            onChange={(selected) => setSelectedColumns(selected)}
            value={selectedColumns}
          /> */}
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title="Save Current Query as Preset"
        size="small"
      >
        <div className="flex flex-col pt-5 pb-3 max-w-lg" style={{}}>
          <input
            type="text"
            className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-400 block py-2 sm:text-sm border-gray-300 rounded-md mr-2 mb-2"
            style={{ minWidth: "300px" }}
            placeholder="Preset name"
          />
          <div className="flex justify-end mt-3">
            <button
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white whitespace-nowrap text-gray-800"
              type="button"
              onClick={() => setModalIsOpen(true)}
            >
              Save as preset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
