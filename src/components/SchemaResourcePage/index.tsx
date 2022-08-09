import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";

import {
  createResource,
  getAll,
  SchemaResourceI
} from "../../api/schemaResources";
import { useUser } from "../../context";
import { BreadcrumbNav } from "../BreadcrumbNav";
import { SearchLayout } from "../Layout";
import { Modal } from "../Modal";
import { SchemaResourceType } from "./resourceTypes";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { SchemaResourceList } from "./SchemaResourceList";

export function SchemaResourcePage({
  resourceInfo
}: {
  resourceInfo: SchemaResourceType;
}) {
  const { user } = useUser();
  const [list, setList] = useState([]);
  const [reload, setReload] = useState(1);
  const { table, name, href } = resourceInfo;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    getAll(resourceInfo).then((res) => {
      setList(res.data);
    });
  }, [resourceInfo, reload]);

  const onSubmit = async (data: Partial<SchemaResourceI>) => {
    await createResource(resourceInfo, { ...data, created_by: user?.id });
    setReload((x) => x + 1);
    setModalIsOpen(false);
  };

  const onClose = () => setModalIsOpen(false);

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
      <div className="self-center m-auto">
        <SchemaResourceList items={list} baseUrl={href} />
      </div>

      <Modal
        open={modalIsOpen}
        onClose={onClose}
        size="full"
        title={`Create New ${capitalize(table)}`}
      >
        <div className="mx-4 my-8">
          <SchemaResourceEdit edit onSubmit={onSubmit} onCancel={onClose} />
        </div>
      </Modal>
    </SearchLayout>
  );
}
