import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { createResource, getAll } from "src/api/schemaResources";
import { useUser } from "src/context";
import { SearchLayout } from "../Layout";
import { Modal } from "../Modal";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { SchemaResourceList } from "./SchemaResourceList";

export function SchemaResourcePage({
  resourceInfo
}: {
  resourceInfo: { table: string; name: string; href: string };
}) {
  const { user } = useUser();
  const [list, setList] = useState([]);
  const { table, name, href } = resourceInfo;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    getAll(table).then((res) => {
      console.log(res);
      setList(res.data);
    });
  }, [table]);

  return (
    <SearchLayout
      title={
        <div className="flex items-center flex-shrink-0">
          <div className="text-xl font-semibold mr-4 whitespace-nowrap">
            {name}
          </div>
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
            createResource(table, { ...data, created_by: user?.id })
          }
        />
      </Modal>
    </SearchLayout>
  );
}
