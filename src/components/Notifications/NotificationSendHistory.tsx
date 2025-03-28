import { NotificationSendHistoryApiResponse } from "@flanksource-ui/api/types/notifications";
import { Age } from "@flanksource-ui/ui/Age";
import MRTDataTable from "@flanksource-ui/ui/MRTDataTable/MRTDataTable";
import { MRT_ColumnDef } from "mantine-react-table";
import { useSearchParams } from "react-router-dom";
import NotificationDetailsModal from "./NotificationDetailsModal";
import NotificationResourceDisplay from "./NotificationResourceDisplay";
import { NotificationStatusCell } from "./NotificationsStatusCell";
import NotificationRecipientLink from "./NotificationRecipientLink";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext
} from "react";
import { Badge } from "@flanksource-ui/ui/Badge/Badge";
import { BsChevronRight, BsChevronDown } from "react-icons/bs";

type ExtendedNotificationResponse = NotificationSendHistoryApiResponse & {
  _isChild?: boolean;
};

type NotificationTableContextType = {
  expandedParents: Set<string>;
  hasChildrenMap: Record<string, NotificationSendHistoryApiResponse[]>;
  toggleExpandRow: (parentId: string) => void;
};

const NotificationTableContext =
  createContext<NotificationTableContextType | null>(null);

// Use context in column definitions
const notificationSendHistoryColumns: MRT_ColumnDef<ExtendedNotificationResponse>[] =
  [
    {
      header: "Age",
      accessorKey: "created_at",
      size: 70,
      Cell: ({ row }) => {
        const dateString = row.original.created_at;
        const count = row.original.count;
        const firstObserved = row.original.first_observed;
        const isChild = row.original._isChild;
        const sendHistoryID = row.original.id;
        const tableContext = useContext(NotificationTableContext);

        if (!tableContext) {
          return <Age from={dateString} />;
        }

        const { expandedParents, hasChildrenMap } = tableContext;
        const { toggleExpandRow } = tableContext;
        const hasChildren =
          !isChild && hasChildrenMap[sendHistoryID]?.length > 0;
        const isExpanded = hasChildren && expandedParents.has(sendHistoryID);

        return (
          <div className="flex items-center">
            {hasChildren && !isChild && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpandRow(sendHistoryID);
                }}
                className="flex min-w-[24px] items-center justify-center rounded p-1.5 hover:bg-gray-100"
              >
                {isExpanded ? (
                  <BsChevronDown className="h-3 w-3" />
                ) : (
                  <BsChevronRight className="h-3 w-3" />
                )}
              </button>
            )}

            <div
              className={`text-xs ${!isChild && hasChildren ? "ml-2" : "ml-8"}`}
            >
              <Age from={dateString} />
              {(count || 1) > 1 && (
                <span className="inline-block pl-1 text-gray-500">
                  (x{count} over <Age format={"short"} from={firstObserved} />)
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: "Resource",
      accessorKey: "resource.name",
      size: 250,
      Cell: ({ row }) => {
        const isChild = row.original._isChild;
        const sendHistoryID = row.original.id;
        const tableContext = useContext(NotificationTableContext);

        if (!tableContext) {
          return <NotificationResourceDisplay notification={row.original} />;
        }

        const { hasChildrenMap } = tableContext;
        const hasChildren = !isChild && hasChildrenMap[sendHistoryID];
        const childCount = hasChildrenMap[sendHistoryID]?.length || 0;

        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className={`relative flex flex-row items-center`}
          >
            <NotificationResourceDisplay notification={row.original} />

            {hasChildren && !isChild && childCount > 0 && (
              <Badge text={childCount} className="ml-2" />
            )}
          </div>
        );
      }
    },
    {
      header: "Status",
      size: 100,
      Cell: ({ row }) => {
        return (
          <div className={`flex items-center gap-2`}>
            <NotificationStatusCell row={row} />
          </div>
        );
      }
    },
    {
      header: "Event",
      accessorKey: "source_event",
      size: 100,
      Cell: ({ row }) => {
        const sourceEvent = row.original.source_event;
        return <span>{sourceEvent}</span>;
      }
    },
    {
      header: "Recipient",
      size: 200,
      Cell: ({ row }) => {
        const { playbook_run, person_id, connection_id } = row.original;
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <NotificationRecipientLink
              playbook_run={playbook_run}
              person_id={person_id}
              connection_id={connection_id}
            />
          </div>
        );
      }
    }
  ];

type NotificationSendHistoryListProps = {
  data: NotificationSendHistoryApiResponse[];
  isLoading: boolean;
  refresh?: () => void;
  pageCount: number;
  sendHistoryRowCount: number;
};

// Filter out child notifications, keeping only parents and standalone notifications
function filterParentAndStandaloneNotifications(
  notifications: NotificationSendHistoryApiResponse[]
): NotificationSendHistoryApiResponse[] {
  const parentIds = new Set<string>();

  notifications.forEach((notification) => {
    if (notification.parent_id) {
      parentIds.add(notification.parent_id);
    }
  });

  return notifications.filter((notification) => {
    const isChild = !!notification.parent_id;
    return !isChild;
  });
}

export default function NotificationSendHistoryList({
  data,
  isLoading,
  pageCount,
  sendHistoryRowCount
}: NotificationSendHistoryListProps) {
  const [searchParams, setSearchParam] = useSearchParams();
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );
  const [childNotifications, setChildNotifications] = useState<
    Record<string, NotificationSendHistoryApiResponse[]>
  >({});

  // State to track which notifications have children (parent notifications)
  const [hasChildrenMap, setHasChildrenMap] = useState<
    Record<string, NotificationSendHistoryApiResponse[]>
  >({});

  const id = searchParams.get("id") ?? undefined;
  const isOpen = searchParams.has("id");

  // Filter out child notifications to show only parents and standalone notifications
  const nonChildNotifications = useMemo(() => {
    return filterParentAndStandaloneNotifications(data);
  }, [data]);

  // Load children for a parent notification (memoized to avoid dependency issues)
  const loadChildNotifications = useCallback(
    (parentId: string) => {
      if (!childNotifications[parentId]) {
        const children = data.filter((n) => n.parent_id === parentId);
        setChildNotifications((prev) => ({
          ...prev,
          [parentId]: children
        }));

        setHasChildrenMap((prev) => ({
          ...prev,
          [parentId]: children
        }));
      }
    },
    [childNotifications, data]
  );

  // Initialize potential parents by checking all notifications
  // This will initiate a check for all top-level notifications to see if they have children
  useEffect(() => {
    const checkForChildren = () => {
      const potentialParentIds = nonChildNotifications.map((n) => n.id);
      for (const parentId of potentialParentIds) {
        if (!childNotifications[parentId] && !hasChildrenMap[parentId]) {
          loadChildNotifications(parentId);
        }
      }
    };

    if (!isLoading && nonChildNotifications.length > 0) {
      checkForChildren();
    }
  }, [
    nonChildNotifications,
    isLoading,
    childNotifications,
    hasChildrenMap,
    loadChildNotifications
  ]);

  const displayData = useMemo(() => {
    let result = [...nonChildNotifications];

    // For all the expanded parents, we insert their children right after them.
    expandedParents.forEach((parentId) => {
      const parentIndex = result.findIndex((item) => item.id === parentId);
      if (parentIndex >= 0 && childNotifications[parentId]) {
        const newResult = [...result];
        const children = childNotifications[parentId].map((child) => ({
          ...child,
          _isChild: true
        }));

        newResult.splice(parentIndex + 1, 0, ...children);
        result = newResult;
      }
    });

    return result;
  }, [nonChildNotifications, expandedParents, childNotifications]);

  const handleToggleExpandRow = (parentId: string) => {
    const newExpandedParents = new Set(expandedParents);

    if (expandedParents.has(parentId)) {
      newExpandedParents.delete(parentId);
    } else {
      newExpandedParents.add(parentId);
      if (!childNotifications[parentId]) {
        loadChildNotifications(parentId);
      }
    }

    setExpandedParents(newExpandedParents);
  };

  const tableContextValue: NotificationTableContextType = {
    expandedParents,
    hasChildrenMap,
    toggleExpandRow: handleToggleExpandRow
  };

  return (
    <NotificationTableContext.Provider value={tableContextValue}>
      <MRTDataTable
        data={displayData}
        columns={notificationSendHistoryColumns}
        isLoading={isLoading}
        onRowClick={(row) => {
          const notification = row as ExtendedNotificationResponse;
          searchParams.set("id", notification.id);
          setSearchParam(searchParams);
        }}
        manualPageCount={pageCount}
        totalRowCount={sendHistoryRowCount}
        enableServerSidePagination
        enableServerSideSorting
      />
      {id && (
        <NotificationDetailsModal
          isOpen={isOpen}
          onClose={() => {
            searchParams.delete("id");
            setSearchParam(searchParams);
          }}
          id={id}
        />
      )}
    </NotificationTableContext.Provider>
  );
}
