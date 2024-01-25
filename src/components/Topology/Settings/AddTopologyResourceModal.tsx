import { useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { Modal } from "../../../ui/Modal";
import AddTopologyResource from "./AddTopologyResource";

type Props = {
  onClose?: () => void;
};

export default function AddTopologyResourceModal({
  onClose = () => {}
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [modalTitle, setModalTitle] = useState("Create Topology");

  const isModalOpen = searchParams.get("openCreateForm") === "true";

  const setModalIsOpen = (isOpen: boolean) => {
    if (isOpen) {
      searchParams.set("openCreateForm", "true");
    } else {
      searchParams.delete("openCreateForm");
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      <button type="button" className="" onClick={() => setModalIsOpen(true)}>
        <AiFillPlusCircle size={32} className="text-blue-600" />
      </button>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setModalIsOpen(false);
          onClose();
        }}
        bodyClass="flex flex-col flex-1 overflow-y-auto"
        size="full"
        title={modalTitle}
      >
        <AddTopologyResource
          isModal
          onSuccess={() => {
            setModalIsOpen(false);
            onClose();
          }}
          setModalTitle={setModalTitle}
        />
      </Modal>
    </>
  );
}
