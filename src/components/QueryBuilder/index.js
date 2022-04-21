import React, { useEffect, useState } from "react";
import history from "history/browser";
import { TrashIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import {
  createSavedQuery,
  deleteSavedQuery,
  getAllSavedQueries
} from "../../api/services/configs";
import { decodeUrlSearchParams, updateParams } from "../Canary/url";
import { Dropdown } from "../Dropdown";
import { Modal } from "../Modal";
import { toastError } from "../Toast/toast";

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
  const [searchParams, setSearchParams] = useState(
    decodeUrlSearchParams(window.location.search)
  );
  useEffect(() => {
    history.listen(({ location }) => {
      setSearchParams(decodeUrlSearchParams(location.search));
    });
  }, []);
  const { query } = searchParams;

  //   const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryList, setQueryList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [presetTextValue, setPresetTextValue] = useState("");
  const [savePresetIsLoading, setSavePresetIsLoading] = useState(false);

  const fetchQueries = () => {
    getAllSavedQueries().then((res) => {
      setQueryList(res.data);
      setSelectedQuery(null);
    });
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    if (selectedQuery) {
      const queryObj = queryList.find((o) => o.id === selectedQuery);
      if (queryObj) {
        const { query } = queryObj;
        updateParams({ query });
      }
    } else {
      updateParams({ query: "" });
    }
  }, [selectedQuery, queryList]);

  const handleSearch = (value) => {
    updateParams({ query: value });
  };

  const handleQuerySave = () => {
    setSavePresetIsLoading(true);
    createSavedQuery(query, { description: presetTextValue })
      .then((res) => {
        toast(res.statusText);
        fetchQueries();
      })
      .catch((err) => {
        toastError(err);
      })
      .finally(() => {
        setModalIsOpen(false);
        setSavePresetIsLoading(false);
      });
  };
  const handleQueryDelete = (presetID) => {
    deleteSavedQuery(presetID).then((res) => {
      const { status } = res;
      if (status === 200 || status === 201) {
        toast("Preset deleted");
        fetchQueries();
      }
    });
  };

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
        {selectedQuery && (
          <button
            className="border border-gray-300 rounded-md px-1.5 py-1.5 text-sm  whitespace-nowrap text-white bg-red-500 mr-2"
            type="button"
            onClick={() => handleQueryDelete(selectedQuery)}
          >
            <TrashIcon height={18} width={18} />
          </button>
        )}
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
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
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
            defaultValue={presetTextValue}
            className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-400 block py-2 sm:text-sm border-gray-300 rounded-md mr-2 mb-2"
            style={{ minWidth: "300px" }}
            placeholder="Preset name"
            onChange={(e) => setPresetTextValue(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button
              disabled={presetTextValue.length <= 0 || savePresetIsLoading}
              className={`border border-gray-300 rounded-md px-3 py-2 text-sm whitespace-nowrap ${
                presetTextValue.length <= 0 || savePresetIsLoading
                  ? "bg-gray-200  text-gray-400 cursor-not-allowed"
                  : "bg-indigo-700 text-gray-50 cursor-pointer"
              }`}
              type="button"
              onClick={() => handleQuerySave()}
            >
              Save as preset
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
