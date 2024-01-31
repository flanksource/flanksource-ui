import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSettingsCreateResource } from "../../api/query-hooks/mutations/useSettingsResourcesMutations";
import { Modal } from "../../ui/Modal";
import ConfigScrapperSpecEditor from "../SpecEditor/ConfigScrapperSpecEditor";
import HealthSpecEditor from "../SpecEditor/HealthSpecEditor";
import { SchemaResourceEdit } from "./SchemaResourceEdit";
import { SchemaResourceType } from "./resourceTypes";

type Props = {
  resourceInfo: SchemaResourceType;
  onClose?: () => void;
};

export default function AddSchemaResourceModal({
  resourceInfo,
  onClose = () => {}
}: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { mutate: createResource } = useSettingsCreateResource(
    resourceInfo!,
    () => {
      setModalIsOpen(false);
    }
  );

  return (
    <>
      <button type="button" className="" onClick={() => setModalIsOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>

      <Modal
        open={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
          onClose();
        }}
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
    </>
  );
}
