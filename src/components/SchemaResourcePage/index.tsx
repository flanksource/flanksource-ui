import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useGetSettingsAllQuery } from "../../api/query-hooks/settingsResourcesHooks";
import { BreadcrumbNav, BreadcrumbRoot } from "../BreadcrumbNav";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import { Modal } from "../Modal";
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";
import { SchemaResourceType } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { SchemaResourceList } from "./SchemaResourceList";
import ConfigScrapperSpecEditor from "../SpecEditor/ConfigScrapperSpecEditor";
import HealthSpecEditor from "../SpecEditor/HealthSpecEditor";
import { useSettingsCreateResource } from "../../api/query-hooks/mutations/useSettingsResourcesMutations";

export function SchemaResourcePage({
  resourceInfo
}: {
  resourceInfo: SchemaResourceType & { href: string };
}) {
  const { name, href } = resourceInfo;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    data: list,
    refetch,
    isLoading
  } = useGetSettingsAllQuery(resourceInfo);

  const { mutate: createResource } = useSettingsCreateResource(
    resourceInfo,
    () => {
      refetch();
      setModalIsOpen(false);
    }
  );

  const onClose = () => setModalIsOpen(false);

  return (
    <>
      <Head prefix={resourceInfo ? `Settings - ${resourceInfo.name}` : ""} />
      <SearchLayout
        loading={isLoading}
        title={
          <BreadcrumbNav
            list={[
              <BreadcrumbRoot link={`/settings/${resourceInfo.table}`}>
                {name}
              </BreadcrumbRoot>,
              <button
                type="button"
                className=""
                onClick={() => setModalIsOpen(true)}
              >
                <AiFillPlusCircle size={32} className="text-blue-600" />
              </button>
            ]}
          />
        }
        contentClass="p-6"
      >
        <div className="m-auto">
          <div className="flex flex-col p-6 pb-0 flex-1 w-full overflow-y-auto">
            {isLoading && (
              <TableSkeletonLoader className="max-w-screen-xl mx-auto" />
            )}
            {!isLoading && (
              <SchemaResourceList
                items={list || []}
                baseUrl={href}
                table={resourceInfo.table}
              />
            )}
          </div>
        </div>

        <Modal
          open={modalIsOpen}
          onClose={onClose}
          bodyClass="flex flex-col flex-1 overflow-y-auto"
          size="full"
          title={`Add ${resourceInfo.name}`}
        >
          {resourceInfo.table === "config_scrapers" ? (
            <ConfigScrapperSpecEditor
              onSubmit={(val) => createResource(val)}
              resourceInfo={resourceInfo}
            />
          ) : resourceInfo.table === "canaries" ? (
            <HealthSpecEditor
              onSubmit={(val) => createResource(val)}
              resourceInfo={resourceInfo}
            />
          ) : (
            <SchemaResourceEdit
              isModal
              onSubmit={async (val) => createResource(val)}
              onCancel={onClose}
              resourceInfo={resourceInfo}
            />
          )}
        </Modal>
      </SearchLayout>
    </>
  );
}
