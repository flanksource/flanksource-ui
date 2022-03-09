import React from "react";
import { Modal } from "../../../components/Modal";

export const ModalView = ({
  isOpenSmallModal,
  isOpenMediumModal,
  isOpenFullModal,
  toggleSmallModal,
  toggleMediumModal,
  toggleFullModal
}) => (
  <div>
    <button
      type="button"
      className="btn-primary mr-3"
      onClick={toggleSmallModal}
    >
      Small modal
    </button>
    <button
      type="button"
      className="btn-primary mr-3"
      onClick={toggleMediumModal}
    >
      Medium modal
    </button>
    <button
      type="button"
      className="btn-primary mr-3"
      onClick={toggleFullModal}
    >
      Full modal
    </button>
    <Modal
      onClose={toggleSmallModal}
      open={isOpenSmallModal}
      size="small"
      title="Small Modal"
    >
      <div className="p-12 bg-red-800" />
    </Modal>
    <Modal
      onClose={toggleMediumModal}
      open={isOpenMediumModal}
      size="medium"
      title="Medium Modal"
    >
      <div className="p-12 bg-red-800" />
    </Modal>
    <Modal
      onClose={toggleFullModal}
      open={isOpenFullModal}
      size="full"
      title="Full Modal"
    >
      <div className="p-12 bg-red-50" />
      <div className="p-12 bg-red-100" />
      <div className="p-12 bg-red-200" />
      <div className="p-12 bg-red-300" />
      <div className="p-12 bg-red-400" />
      <div className="p-12 bg-red-500" />
      <div className="p-12 bg-red-600" />
      <div className="p-12 bg-red-700" />
      <div className="p-12 bg-red-800" />
      <div className="p-12 bg-red-900" />
    </Modal>
  </div>
);
