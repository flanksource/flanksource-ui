import React from "react";
import { Modal } from "../../../components/Modal";

export const ModalView = ({
  text,
  toggleText,
  isOpenSmallModal,
  isOpenMediumModal,
  isOpenFullModal,
  toggleSmallModal,
  toggleMediumModal,
  toggleFullModal
}) => (
  <div>
    <div className="form-check mb-5">
      <input
        className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
        type="checkbox"
        id="flexCheckDefault"
        onClick={toggleText}
      />
      <label
        className="form-check-label inline-block text-gray-800"
        htmlFor="flexCheckDefault"
      >
        Long text
      </label>
    </div>
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
      {text}
    </Modal>
    <Modal
      onClose={toggleMediumModal}
      open={isOpenMediumModal}
      size="medium"
      title="Medium Modal"
    >
      {text}
    </Modal>
    <Modal
      onClose={toggleFullModal}
      open={isOpenFullModal}
      size="full"
      title="Full Modal"
    >
      {text}
    </Modal>
  </div>
);
