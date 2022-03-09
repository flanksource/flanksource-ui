import React, { useState } from "react";
import { MinimalLayout } from "../../../components/Layout";
import { ModalView } from "./modal-view";

export const ModalPage = () => {
  const [isOpenSmallModal, setOpenSmallModal] = useState(false);
  const [isOpenMediumModal, setOpenMediumModal] = useState(false);
  const [isOpenFullModal, setOpenFullModal] = useState(false);

  const toggleSmallModal = () => {
    setOpenSmallModal((value) => !value);
  };
  const toggleMediumModal = () => {
    setOpenMediumModal((value) => !value);
  };
  const toggleFullModal = () => {
    setOpenFullModal((value) => !value);
  };

  return (
    <MinimalLayout>
      <ModalView
        isOpenSmallModal={isOpenSmallModal}
        isOpenMediumModal={isOpenMediumModal}
        isOpenFullModal={isOpenFullModal}
        toggleSmallModal={toggleSmallModal}
        toggleMediumModal={toggleMediumModal}
        toggleFullModal={toggleFullModal}
      />
    </MinimalLayout>
  );
};
