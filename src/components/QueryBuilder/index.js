import { Fragment, useEffect, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/solid";
import { BiCog } from "react-icons/bi";
import toast from "react-hot-toast";
import {
  createSavedQuery,
  deleteSavedQuery,
  getAllSavedQueries
} from "../../api/services/configs";
import { Dropdown } from "../Dropdown";
import { Modal } from "../Modal";
import { toastError } from "../Toast/toast";
import { useSearchParams } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function QueryBuilderActionMenu({ onSelect, options }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full p-3 bg-white text-sm font-medium text-gray-700">
          <BiCog className="content-center" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {options.map((option) => {
              return (
                <Menu.Item key={option}>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                      onClick={() => onSelect(option)}
                    >
                      {option}
                    </a>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

const QueryEditorMenuActions = {
  editor: "Show Editor",
  savedQueryList: "Show Saved Queries",
  saveQuery: "Save Query",
  runQuery: "Run Query"
};

export const QueryBuilder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query } = searchParams;

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryList, setQueryList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [presetTextValue, setPresetTextValue] = useState("");
  const [savePresetIsLoading, setSavePresetIsLoading] = useState(false);
  const [queryAction, setQueryAction] = useState(
    QueryEditorMenuActions.savedQueryList
  );
  const options = useMemo(() => {
    if (QueryEditorMenuActions.editor === queryAction) {
      return [
        QueryEditorMenuActions.runQuery,
        QueryEditorMenuActions.saveQuery,
        QueryEditorMenuActions.savedQueryList
      ];
    } else if (QueryEditorMenuActions.savedQueryList === queryAction) {
      return [QueryEditorMenuActions.editor];
    }
  }, [queryAction]);

  const fetchQueries = () => {
    getAllSavedQueries().then((res) => {
      setQueryList(res?.data || []);
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
        setSearchParams({ ...searchParams, query });
      }
    } else {
      setSearchParams({ ...searchParams, query: "" });
    }
  }, [selectedQuery, queryList]);

  const handleSearch = (value) => {
    setSearchParams({ ...searchParams, query: value });
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
    <div className="flex flex-col">
      {queryAction === QueryEditorMenuActions.savedQueryList && (
        <div className="flex items-center">
          <Dropdown
            emptyable
            className="w-full mr-2"
            items={exampleQueries}
            onChange={(value) => setSelectedQuery(value)}
            value={selectedQuery}
            prefix={
              <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                Preset Query:
              </div>
            }
          />
          {selectedQuery && (
            <button
              className="px-1.5 py-1.5 text-sm  whitespace-nowrap text-white bg-red-500 mr-2"
              type="button"
              onClick={() => handleQueryDelete(selectedQuery)}
            >
              <TrashIcon height={18} width={18} />
            </button>
          )}
          {/* <button
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white whitespace-nowrap text-gray-800"
            type="button"
            onClick={() => setModalIsOpen(true)}
          >
            Save current to preset
          </button> */}
          <QueryBuilderActionMenu options={options} onSelect={setQueryAction} />
        </div>
      )}
      {queryAction === QueryEditorMenuActions.editor && (
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-400 block py-2 sm:text-sm border-gray-300 rounded-md"
            style={{ minWidth: "300px" }}
            placeholder="Query text (name, namespace, type, or description)"
          />
          <QueryBuilderActionMenu options={options} onSelect={setQueryAction} />
        </div>
      )}
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
