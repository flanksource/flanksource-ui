import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { TopologyCard } from "../Topology";
import { Modal } from "../Modal";
import { usePrevious } from "../../utils/hooks";

export const TopologySelectorModal = ({
  handleModalClose,
  isOpen,
  footerClassName,
  topologies,
  title,
  titleClassName,
  footerTextClassName,
  submitButtonClassName,
  submitButtonTitle,
  onSubmit,
  hideCounter,
  defaultChecked
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const previousIsOpen = usePrevious(isOpen);

  useEffect(() => {
    if (isOpen && previousIsOpen !== isOpen && defaultChecked) {
      setChecked(defaultChecked);
    }
  }, [defaultChecked, isOpen, previousIsOpen]);

  const toggleChecked = (id, checked) => {
    setChecked((prevState) =>
      checked ? prevState.concat([id]) : prevState.filter((i) => i !== id)
    );
  };
  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      cardClass="w-full"
      contentClass="h-full pt-10 pl-10 pb-10 pr-7 font-inter"
      cardStyle={{ maxWidth: "77.6rem" }}
      closeButtonStyle={{ padding: "2.375rem 2.375rem 0 0" }}
      containerClass="p-4"
      hideActions
    >
      <h1 className={cx("text-2xl font-semibold mb mb-6", titleClassName)}>
        {title}
      </h1>
      <div
        className="grid gap-4 w-full px-0.5 overflow-x-auto"
        style={{ gridTemplateColumns: "repeat(5, minmax(12.375rem, 1fr))" }}
      >
        {topologies.map((topology, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            {topology.map((item) => (
              <TopologyCard
                size="small"
                topology={item}
                key={item.id}
                selectionMode
                selected={checked.indexOf(item.id) > -1}
                onSelectionChange={(state) => {
                  toggleChecked(item.id, state);
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div
        className={cx("flex justify-end mt-7 align-baseline", footerClassName)}
      >
        {!hideCounter && (
          <p className={cx("flex items-center", footerTextClassName)}>
            <span>{`${checked.length} cards selected`}</span>
          </p>
        )}
        <button
          type="button"
          className={cx(
            "py-3 px-6 bg-dark-blue rounded-6px text-white ml-6 hover:bg-warm-blue",
            submitButtonClassName
          )}
          onClick={() => onSubmit(checked)}
          disabled={checked.length === 0}
        >
          {submitButtonTitle}
        </button>
      </div>
    </Modal>
  );
};
TopologySelectorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  hideCounter: PropTypes.bool,
  handleModalClose: PropTypes.func.isRequired,
  footerClassName: PropTypes.string,
  title: PropTypes.string.isRequired,
  titleClassName: PropTypes.string,
  footerTextClassName: PropTypes.string,
  submitButtonClassName: PropTypes.string,
  submitButtonTitle: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
};
TopologySelectorModal.defaultProps = {
  hideCounter: false,
  footerTextClassName: "",
  submitButtonClassName: "",
  titleClassName: "",
  footerClassName: ""
};
