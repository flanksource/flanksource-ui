import { Fragment, useEffect, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MdDelete } from "react-icons/md";
import { BiCog } from "react-icons/bi";
import clsx from "clsx";
import {
  createSavedQuery,
  deleteSavedQuery,
  getAllSavedQueries,
  getConfigsByQuery
} from "../../api/services/configs";
import { Dropdown } from "../Dropdown";
import { Modal } from "../Modal";
import { toastError, toastSuccess } from "../Toast/toast";
import { useLoader } from "../../hooks";

const QueryEditorMenuActions = {
  editor: "Show Editor",
  savedQueryList: "Show Saved Queries",
  saveQuery: "Save Query",
  runQuery: "Run Query"
};

const QueryEditorViewType = {
  editor: "Editor",
  queryList: "Query List"
};

export const QueryBuilder = ({ refreshConfigs, className, ...props }) => {
  const [query, setQuery] = useState("");
  const [queryEditorViewType, setQueryEditorViewType] = useState(
    QueryEditorViewType.editor
  );

  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryList, setQueryList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [savedQueryValue, setSavedQueryValue] = useState("");
  const { loading, setLoading } = useLoader();
  const options = useMemo(() => {
    if (QueryEditorViewType.editor === queryEditorViewType) {
      return [
        QueryEditorMenuActions.runQuery,
        QueryEditorMenuActions.saveQuery,
        QueryEditorMenuActions.savedQueryList
      ];
    } else if (QueryEditorViewType.queryList === queryEditorViewType) {
      return [QueryEditorMenuActions.runQuery, QueryEditorMenuActions.editor];
    } else {
      return [];
    }
  }, [queryEditorViewType]);
  const savedQueriesList = useMemo(() => {
    const data = {
      null: {
        id: null,
        name: "None",
        description: "None",
        value: null
      }
    };
    queryList.forEach((queryItem) => {
      data[queryItem.id] = {
        id: queryItem.id,
        name: queryItem.id,
        description: queryItem.description,
        value: queryItem.id
      };
    });
    return data;
  }, [queryList]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const result = await getAllSavedQueries();
      setQueryList(result?.data || []);
      setSelectedQuery(null);
    } catch (ex) {
      toastError(ex);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
  };

  const handleQueryBuilderAction = (action) => {
    if (action === QueryEditorMenuActions.editor) {
      return setQueryEditorViewType(QueryEditorViewType.editor);
    } else if (action === QueryEditorMenuActions.savedQueryList) {
      setQuery("");
      return setQueryEditorViewType(QueryEditorViewType.queryList);
    } else if (action === QueryEditorMenuActions.runQuery) {
      handleRunQuery();
    } else if (action === QueryEditorMenuActions.saveQuery) {
      handleSaveQuery();
    }
  };

  const handleSaveQuery = () => {
    setSavedQueryValue("");
    if (!query) {
      return toastError("Please provide query details");
    }
    setModalIsOpen(true);
  };

  const handleRunQuery = async () => {
    const queryToRun =
      queryEditorViewType === QueryEditorViewType.editor
        ? query
        : queryList.find((o) => o.id === selectedQuery)?.query;
    if (!queryToRun) {
      toastError("Please provide a query before running");
      return;
    }
    refreshConfigs([]);
    try {
      const result = (await getConfigsByQuery(queryToRun))?.data?.results || [];
      result.forEach((item) => {
        item.tags = JSON.parse(item.tags);
      });
      refreshConfigs(result);
    } catch (ex) {
      toastError(ex.message);
    }
  };

  const saveQuery = async () => {
    setLoading(true);
    try {
      await createSavedQuery(query, { description: savedQueryValue });
      toastSuccess(`${savedQueryValue || query} saved successfully`);
      setQuery("");
      fetchQueries();
    } catch (ex) {
      toastError(ex);
    }
    setModalIsOpen(false);
    setLoading(false);
  };

  const handleQueryDelete = async (queryId) => {
    const query = queryList.find((o) => o.id === selectedQuery);
    const queryName = query?.description || query?.query;
    setLoading(true);
    try {
      const res = await deleteSavedQuery(queryId);
      const { status } = res;
      if (status === 200 || status === 201) {
        toastSuccess(`${queryName} deleted successfully`);
        fetchQueries();
      }
    } catch (ex) {
      toastError(ex);
    }
    setLoading(false);
  };

  return (
    <div className={clsx("flex flex-col w-96", className)} {...props}>
      {queryEditorViewType === QueryEditorViewType.queryList && (
        <div className="flex items-center">
          <Dropdown
            emptyable
            className="w-full mr-2"
            items={savedQueriesList}
            onChange={(value) => setSelectedQuery(value)}
            value={selectedQuery}
            prefix={
              <div className="text-xs text-gray-500 mr-2 whitespace-nowrap">
                Saved Query:
              </div>
            }
          />
          {selectedQuery && (
            <button
              className="px-1.5 py-1.5 text-lg whitespace-nowrap text-white text-red-500 mr-2"
              type="button"
              onClick={() => handleQueryDelete(selectedQuery)}
            >
              <MdDelete height={18} width={18} />
            </button>
          )}
          <QueryBuilderActionMenu
            options={options}
            onSelect={handleQueryBuilderAction}
          />
        </div>
      )}
      {queryEditorViewType === QueryEditorViewType.editor && (
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-400 block py-2 sm:text-sm border-gray-300 rounded-md"
            style={{ minWidth: "300px" }}
            placeholder="Query text (name, namespace, type, or description)"
          />
          <QueryBuilderActionMenu
            options={options}
            onSelect={handleQueryBuilderAction}
          />
        </div>
      )}
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        title="Save Current Query"
        size="small"
      >
        <div className="flex flex-col pt-5 pb-3 max-w-lg" style={{}}>
          <input
            type="text"
            defaultValue={savedQueryValue}
            className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-400 block py-2 sm:text-sm border-gray-300 rounded-md mr-2 mb-2"
            style={{ minWidth: "300px" }}
            placeholder="Query name"
            onChange={(e) => setSavedQueryValue(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button
              disabled={savedQueryValue.length <= 0 || loading}
              className={`border border-gray-300 rounded-md px-3 py-2 text-sm whitespace-nowrap ${
                savedQueryValue.length <= 0 || loading
                  ? "bg-gray-200  text-gray-400 cursor-not-allowed"
                  : "bg-indigo-700 text-gray-50 cursor-pointer"
              }`}
              type="button"
              onClick={() => saveQuery()}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function QueryBuilderActionMenu({ onSelect, options }) {
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
                    <div
                      className={clsx(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm"
                      )}
                      onClick={() => onSelect(option)}
                    >
                      {option}
                    </div>
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
