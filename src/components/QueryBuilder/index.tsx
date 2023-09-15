import React, {
  ChangeEvent,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { Menu, Transition } from "@headlessui/react";
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
import { TextWithDivider } from "../TextWithDivider";
import { ClickableSvg } from "../ClickableSvg/ClickableSvg";
import { FaCog } from "react-icons/fa";

type QueryBuilderProps = {
  refreshConfigs: (configs: any[]) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const QueryBuilderFC: React.FC<QueryBuilderProps> = ({
  refreshConfigs,
  className,
  ...props
}) => {
  const [params, setParams] = useSearchParams();
  const query = params.get("query") || "";
  const [selectedQuery, setSelectedQuery] = useState<
    Record<string, any> | undefined
  >();
  const [queryList, setQueryList] = useState<
    {
      id: string;
      description?: string;
      query: string;
    }[]
  >([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [savedQueryValue, setSavedQueryValue] = useState("");
  const { loading, setLoading } = useLoader();
  const optionCategories = useMemo(() => {
    const actions = [];
    const savedQueryLoadActions: {
      id: string;
      label?: string;
      type: string;
      context: Record<string, any>;
    }[] = [];

    if (!selectedQuery) {
      actions.push({
        id: "save",
        label: "Save",
        type: "action_save",
        context: {}
      });
    }

    if (selectedQuery) {
      actions.push({
        id: "update",
        label: "Update",
        type: "action_update",
        context: {}
      });
      actions.push({
        id: "save_as",
        label: "Save As",
        type: "action_save",
        context: {}
      });
      actions.push({
        id: "delete",
        label: "Delete",
        type: "action_delete",
        context: {}
      });
    }

    queryList.forEach((queryItem) => {
      savedQueryLoadActions.push({
        id: queryItem.id,
        label: queryItem.description,
        type: "action_saved_query",
        context: {
          ...queryItem
        }
      });
    });
    return {
      actions,
      savedQueryLoadActions
    };
  }, [queryList, selectedQuery]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const result = await getAllSavedQueries();
      setQueryList(result?.data || []);
      setSelectedQuery(undefined);
    } catch (ex: any) {
      toastError(ex);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueries();
    if (query) {
      handleRunQuery(query);
    }
  }, []);

  const handleSearch = (query: string) => {
    setParams({
      query
    });
  };

  const handleQueryBuilderAction = (option: {
    id: string;
    type: string;
    context: Record<string, any>;
  }) => {
    if (option.type === "action_save") {
      handleSaveQuery();
    } else if (option.type === "action_saved_query") {
      setSelectedQuery(option.context);
      setParams({
        query: option.context.query
      });
      handleRunQuery(option.context.query);
    } else if (option.type === "action_update") {
      updateQuery();
    } else if (option.type === "action_delete") {
      handleQueryDelete(selectedQuery?.id);
    }
  };

  const handleSaveQuery = () => {
    setSavedQueryValue("");
    if (!query) {
      toastError("Please provide query details");
      return;
    }
    setModalIsOpen(true);
  };

  const handleRunQuery = async (queryToRun: string) => {
    if (!queryToRun) {
      toastError("Please provide a query before running");
      return;
    }
    refreshConfigs([]);
    try {
      const result = await getConfigsByQuery(queryToRun);
      refreshConfigs(result);
    } catch (ex: any) {
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
      await fetchQueries();
    } catch (ex: any) {
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
      await updateSavedQuery(selectedQuery!.id, { query });
      toastSuccess(
        `${selectedQuery?.description || query} updated successfully`
      );
      await fetchQueries();
    } catch (ex: any) {
      toastError(ex);
    }
    setModalIsOpen(false);
    setLoading(false);
  };

  const handleQueryDelete = async (queryId: string) => {
    const query = queryList.find((o) => o.id === queryId);
    const queryName = query?.description || query?.query;
    setLoading(true);
    try {
      const res = await deleteSavedQuery(queryId);
      if (!res?.error) {
        toastSuccess(`${queryName} deleted successfully`);
        await fetchQueries();
        setSelectedQuery(undefined);
      }
    } catch (ex: any) {
      toastError(ex);
    }
    setLoading(false);
  };

  const onModalClose = useCallback(() => {
    setModalIsOpen(false);
  }, []);

  const onSavedQueryValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSavedQueryValue(e.target.value);
    },
    []
  );

  return (
    <div className={clsx("flex flex-col", className)} {...props}>
      <div className="flex">
        <TextInputClearable
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="sm:text-sm border-gray-300"
          placeholder="Search configs by using custom queries written here"
          onSubmit={(e) => handleRunQuery(query)}
          style={{ width: "750px" }}
          onClear={() => {
            setSelectedQuery(undefined);
            setParams({});
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRunQuery(query);
            }
          }}
        />
        <QueryBuilderActionMenu
          optionCategories={optionCategories}
          onOptionClick={handleQueryBuilderAction}
        />
      </div>
      <Modal
        open={modalIsOpen}
        onClose={onModalClose}
        title="Save Current Query"
        size="small"
      >
        <div className="flex flex-col pt-5 pb-3 max-w-lg">
          <input
            type="text"
            value={savedQueryValue}
            className="w-full shadow-sm focus:ring-blue-500 focus:border-blue-400 block py-2 sm:text-sm border-gray-300 rounded-md mr-2 mb-2"
            placeholder="Query name"
            onChange={onSavedQueryValueChange}
          />
          <div className="flex justify-end mt-3">
            <button
              className="border border-gray-300 rounded-md px-3 py-2 text-sm whitespace-nowrap bg-blue-700 text-gray-50 cursor-pointer"
              type="button"
              onClick={saveQuery}
              disabled={loading}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

type QueryBuilderActionMenuProps = {
  onOptionClick: (option: any) => void;
  optionCategories: {
    actions: {
      id: string;
      label?: string;
    }[];
    savedQueryLoadActions: {
      id: string;
      label?: string;
    }[];
  };
};

function QueryBuilderActionMenu({
  onOptionClick,
  optionCategories
}: QueryBuilderActionMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left items-center">
      <Menu.Button className="inline-flex justify-center w-full pl-3 bg-warm-gray-50 text-sm font-medium text-gray-700">
        <ClickableSvg>
          <FaCog className="content-center w-6 h-6" />
        </ClickableSvg>
      </Menu.Button>
      {/* @ts-ignore */}
      <Transition
        // @ts-ignore
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <TextWithDivider
            className="text-gray-500 text-md font-semibold"
            text="Actions"
          />
          {optionCategories.actions.map((option) => {
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
          {!!optionCategories.savedQueryLoadActions.length && (
            <TextWithDivider
              className="text-gray-500 text-md font-semibold"
              text="Saved Queries"
            />
          )}
          {optionCategories.savedQueryLoadActions.map((option) => {
            return (
              <Menu.Item key={option.id}>
                {({ active }) => (
                  <div
                    className={clsx(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm",
                      "cursor-pointer break-words"
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
      </Transition>
    </Menu>
  );
}

export const QueryBuilder = memo(QueryBuilderFC);
