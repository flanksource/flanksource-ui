import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useGetSettingsAllQuery } from "../../api/query-hooks/settingsResourcesHooks";
import { createResource, SchemaResourceI } from "../../api/schemaResources";
import { useUser } from "../../context";
import { BreadcrumbNav } from "../BreadcrumbNav";
import { Head } from "../Head/Head";
import { SearchLayout } from "../Layout";
import { Modal } from "../Modal";
import TableSkeletonLoader from "../SkeletonLoader/TableSkeletonLoader";
import { SchemaResourceType } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { SchemaResourceList } from "./SchemaResourceList";

export function SchemaResourcePage({
  resourceInfo
}: {
  resourceInfo: SchemaResourceType & { href: string };
}) {
  const { user } = useUser();
  const { name, href } = resourceInfo;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    data: list,
    refetch,
    isLoading
  } = useGetSettingsAllQuery(resourceInfo);

  const onSubmit = async (data: Partial<SchemaResourceI>) => {
    if (resourceInfo.table === "canaries") {
      await createResource(resourceInfo, {
        ...data,
        created_by: user?.id
      });
    } else {
      await createResource(resourceInfo, {
        ...data,
        created_by: user?.id
      });
    }
    refetch();
    setModalIsOpen(false);
  };

  const onClose = () => setModalIsOpen(false);

  return (
    <>
      <Head prefix={resourceInfo ? `Settings - ${resourceInfo.name}` : ""} />
      <SearchLayout
        loading={isLoading}
        title={
          <BreadcrumbNav
            list={[
              name,
              <button
                type="button"
                className=""
                onClick={() => setModalIsOpen(true)}
              >
                <AiFillPlusCircle size={36} color="#326CE5" />
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
          bodyClass=""
          size="full"
          title={`Create New ${resourceInfo.name}`}
        >
          <SchemaResourceEdit
            resourceName={resourceInfo.name}
            isModal
            edit
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </Modal>
      </SearchLayout>
    </>
  );
}
