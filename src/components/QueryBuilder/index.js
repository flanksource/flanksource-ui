import { Fragment, useEffect, useMemo, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MdDelete } from "react-icons/md";
import { BiCog } from "react-icons/bi";
import clsx from "clsx";
import { useSearchParams } from "react-router-dom";
import {
  createSavedQuery,
  deleteSavedQuery,
  getAllSavedQueries,
  getConfigsByQuery,
  updateSavedQuery
} from "../../api/services/configs";
import { Modal } from "../Modal";
import { toastError, toastSuccess } from "../Toast/toast";
import { useLoader } from "../../hooks";
import { TextInputClearable } from "../TextInputClearable";

export const QueryBuilder = ({ refreshConfigs, className, ...props }) => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("query") || "");
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [queryList, setQueryList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [savedQueryValue, setSavedQueryValue] = useState("");
  const { loading, setLoading } = useLoader();

  const options = useMemo(
    () =>
      queryList.map((q) => ({
        ...q,
        id: q.id,
        label: q.description,
        context: { ...q }
      })),
    [queryList, selectedQuery]
  );

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
    if (params.get("query")) {
      handleRunQuery();
    }
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    setParams({
      query: value
    });
  };

  const handleQueryBuilderAction = (option) => {
    setSelectedQuery(option.context);
    setQuery(option.context.query);
  };

  const handleSaveQuery = () => {
    setSavedQueryValue("");
    if (!query) {
      toastError("Please provide query details");
      return;
    }
    setModalIsOpen(true);
  };

  const handleRunQuery = async () => {
    const queryToRun = query;
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
    if (!savedQueryValue) {
      toastError("Please provide query name");
      return;
    }
    setLoading(true);
    try {
      await createSavedQuery(query, { description: savedQueryValue });
      toastSuccess(`${savedQueryValue || query} saved successfully`);
      setQuery("");
      setParams({});
      fetchQueries();
    } catch (ex) {
      toastError(ex);
    }
    setModalIsOpen(false);
    setLoading(false);
  };

  const updateQuery = async () => {
    if (!query) {
      toastError("Please provide query");
      return;
    }
    setLoading(true);
    try {
      await updateSavedQuery(selectedQuery.id, { query });
      toastSuccess(
        `${selectedQuery.description || query} updated successfully`
      );
      setQuery("");
      setSelectedQuery("");
      setParams({});
      fetchQueries();
    } catch (ex) {
      toastError(ex);
    }
    setModalIsOpen(false);
    setLoading(false);
  };

  const handleQueryDelete = async (queryId) => {
    const query = queryList.find((o) => o.id === queryId);
    const queryName = query?.description || query?.query;
    setLoading(true);
    try {
      const res = await deleteSavedQuery(queryId);
      const { status } = res;
      if (status === 200 || status === 201) {
        toastSuccess(`${queryName} deleted successfully`);
        fetchQueries();
        setQuery("");
        setSelectedQuery();
      }
    } catch (ex) {
      toastError(ex);
    }
    setLoading(false);
  };

  const actions = selectedQuery
    ? [
        {
          id: "update",
          element: <div onClick={updateQuery}>Update</div>
        },
        {
          id: "save_as",
          element: <div onClick={handleSaveQuery}>Save as</div>
        }
      ]
    : [
        {
          id: "save",
          element: <div onClick={handleSaveQuery}>Save</div>
        }
      ];

  return (
    <div className={clsx("flex flex-col", className)} {...props}>
      <div className="flex">
        <TextInputClearable
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="sm:text-sm border-gray-300"
          placeholder="Search configs by using custom queries written here"
          onSubmit={handleRunQuery}
          style={{ width: "500px" }}
          onClear={(e) => {
            setSelectedQuery();
            setQuery("");
            setParams({});
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRunQuery();
            }
          }}
        />
        {selectedQuery && (
          <button
            className="px-1.5 py-1.5 text-lg whitespace-nowrap text-white text-red-500 mr-2"
            type="button"
            onClick={() => handleQueryDelete(selectedQuery.id)}
          >
            <MdDelete height={18} width={18} />
          </button>
        )}
        <QueryBuilderActionMenu
          actions={actions}
          options={options}
          onOptionClick={handleQueryBuilderAction}
        />
      </div>
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
              className={`border border-gray-300 rounded-md px-3 py-2 text-sm whitespace-nowrap bg-indigo-700 text-gray-50 cursor-pointer}`}
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

function QueryBuilderActionMenu({ onOptionClick, options, actions, children }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center w-full p-3 bg-white text-sm font-medium text-gray-700">
        <BiCog className="content-center" />
      </Menu.Button>
      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
        <div className="py-1">
          <Menu.Items
            as="section"
            className="border border-0 border-b-2 border-gray-400"
          >
            {(actions || []).map((action) => (
              <Menu.Item
                className="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                key={action.id}
              >
                {action.element}
              </Menu.Item>
            ))}
          </Menu.Items>

          <Menu.Items as="section">
            {options.map((option) => {
              return (
                <Menu.Item key={option.id}>
                  {({ active }) => (
                    <div
                      className={clsx(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm",
                        "cursor-pointer"
                      )}
                      onClick={() => onOptionClick(option)}
                    >
                      {option.label}
                    </div>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </div>
      </Menu.Items>
    </Menu>
  );
}
