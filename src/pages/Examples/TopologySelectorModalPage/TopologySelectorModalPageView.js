import React from "react";
import PropTypes from "prop-types";
import { TopologySelectorModal } from "../../../components/TopologySelectorModal/TopologySelectorModal";

export const TopologySelectorModalPageView = ({
  modal,
  setModal,
  topologies
}) => (
  <div>
    <button
      type="button"
      className="py-3 px-6 bg-dark-blue rounded-6px text-white mb-4"
      onClick={() => {
        setModal(true);
      }}
    >
      Open Modal
    </button>
    <TopologySelectorModal
      handleModalClose={() => setModal(false)}
      isOpen={modal}
      topologies={topologies}
      title="Add Card"
      submitButtonTitle="Add"
      onSubmit={(data) => {
        console.log("array of checked cards ids:", data);
      }}
      defaultChecked={[topologies[0][0].id]}
    />
  </div>
);

TopologySelectorModalPageView.propTypes = {
  modal: PropTypes.bool.isRequired,
  setModal: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  topologies: PropTypes.array.isRequired
};
