import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

import { createResource, getAll } from "../../api/schemaResources";
import { useUser } from "../../context";
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
        <div className="flex items-center flex-shrink-0">
          <div className="text-xl font-semibold mr-4 whitespace-nowrap">
            {name}
          </div>
          /
          <div className="flex">
            <button
              type="button"
              className=""
              onClick={() => setModalIsOpen(true)}
            >
              <AiFillPlusCircle size={36} color="#326CE5" />
            </button>
          </div>
        </div>
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
        <SchemaResourceEdit
          onSubmit={(data) =>
            createResource(resourceInfo, { ...data, created_by: user?.id })
          }
        />
      </Modal>
    </SearchLayout>
  );
}
