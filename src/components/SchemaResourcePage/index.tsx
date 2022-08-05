import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

import { createResource, getAll } from "../../api/schemaResources";
import { useUser } from "../../context";
import { BreadcrumbNav } from "../BreadcrumbNav";
import { SearchLayout } from "../Layout";
import { Modal } from "../Modal";
import { SchemaResource } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { SchemaResourceList } from "./SchemaResourceList";

export function SchemaResourcePage({
  resourceInfo
}: {
  resourceInfo: SchemaResource;
}) {
  const { user } = useUser();
  const [list, setList] = useState([]);
  const { table, name, href } = resourceInfo;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    getAll(resourceInfo).then((res) => {
      console.log(res);
      setList(res.data);
    });
  }, [resourceInfo]);

  return (
    <SearchLayout
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
    >
      <div className="self-center max-w-screen-xl">
        <SchemaResourceList items={list} baseUrl={href} />
      </div>

      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        size="full"
        title={`Create New ${capitalize(table)}`}
      >
        <div className="mx-4 my-8">
          <SchemaResourceEdit
            edit
            onSubmit={(data) =>
              createResource(resourceInfo, { ...data, created_by: user?.id })
            }
          />
        </div>
      </Modal>
    </SearchLayout>
  );
}
