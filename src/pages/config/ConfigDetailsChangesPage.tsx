import { useParams } from "react-router-dom";
import { ConfigChangeHistory } from "../../components/ConfigChangeHistory";
import { InfoMessage } from "../../components/InfoMessage";
import { SearchLayout } from "../../components/Layout";
import ConfigSidebar from "../../components/ConfigSidebar";
import { ConfigsDetailsBreadcrumbNav } from "../../components/BreadcrumbNav/ConfigsDetailsBreadCrumb";
import {
  useGetConfigChangesByConfigIdQuery,
  useGetConfigByIdQuery
} from "../../api/query-hooks";
import { Head } from "../../components/Head/Head";
import TabbedLinks from "../../components/Tabs/TabbedLinks";
import { useConfigDetailsTabs } from "../../components/ConfigsPage/ConfigTabsLinks";
import { useMemo, useRef, useState } from "react";
import useRunTaskOnPropChange from "../../hooks/useRunTaskOnPropChange";

export function ConfigDetailsChangesPage() {
  const { id } = useParams();
  const [{ pageIndex, pageSize }, setPageState] = useState({
    pageIndex: 0,
    pageSize: 50
  });

  const {
    data: historyData,
    isLoading,
    isRefetching,
    error,
    refetch
  } = useGetConfigChangesByConfigIdQuery(id!, pageIndex, pageSize);
  const totalEntries = (historyData as any)?.totalEntries;
  const pageCount = totalEntries ? Math.ceil(totalEntries / pageSize) : -1;

  const pagination = useMemo(() => {
    return {
      setPagination: setPageState,
      pageIndex,
      pageSize,
      pageCount,
      remote: true,
      enable: true,
      loading: isLoading || isRefetching
    };
  }, [pageIndex, pageSize, pageCount, isLoading, isRefetching]);

  const { data: configItem, error: itemError } = useGetConfigByIdQuery(id!);
  const marginBottom = 24;
  const contentRef = useRef<HTMLDivElement>(null);
  const element = contentRef.current;
  const contentDivHeight = contentRef.current?.parentElement
    ? document.body.clientHeight -
      contentRef.current.parentElement.getBoundingClientRect().top -
      marginBottom
    : 0;
  const configTabList = useConfigDetailsTabs();

  useRunTaskOnPropChange(
    () => {
      return contentDivHeight;
    },
    () => {
      if (!element) {
        return;
      }
      element.parentElement?.style.setProperty(
        "max-height",
        `${contentDivHeight}px`
      );
    }
  );

  if (error) {
    const errorMessage =
      typeof error === "symbol"
        ? error
        : error?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  if (itemError) {
    const errorMessage =
      typeof itemError === "symbol"
        ? itemError
        : itemError?.message ?? "Something went wrong";

    return <InfoMessage message={errorMessage} />;
  }

  return (
    <>
      <Head prefix={configItem ? `Config Changes - ${configItem.name}` : ""} />
      <SearchLayout
        title={
          <div className="flex space-x-2">
            <span className="text-lg">
              <ConfigsDetailsBreadcrumbNav configId={id} />
            </span>
          </div>
        }
        onRefresh={refetch}
        loading={isLoading}
        contentClass="p-0 h-full overflow-y-hidden"
      >
        <div className={`flex flex-row h-full`}>
          <TabbedLinks
            tabLinks={configTabList}
            contentClassName="bg-white border border-t-0 border-gray-300 flex-1 p-2"
          >
            <div
              className={`flex flex-col flex-1 p-6 pb-0 h-full`}
              ref={contentRef}
            >
              <div className="flex flex-col items-start overflow-y-auto">
                <ConfigChangeHistory
                  data={historyData?.data ?? []}
                  isLoading={isLoading}
                  pagination={pagination}
                />
              </div>
            </div>
          </TabbedLinks>
          <ConfigSidebar />
        </div>
      </SearchLayout>
    </>
  );
}
