import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { TopologyCard } from "../TopologyCard";
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

  const toggleChecked = (id) => {
    setChecked((prevState) =>
      prevState.includes(id)
        ? prevState.filter((i) => i !== id)
        : [...prevState, id]
    );
  };

  const action = (
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
  );

  const counterAction = (
    <p className={cx("flex items-center", footerTextClassName)}>
      <span>{`${checked.length} cards selected`}</span>
    </p>
  );

  const actions = [!hideCounter && counterAction, action];

  return (
    <Modal
      open={isOpen}
      onClose={handleModalClose}
      title={title}
      titleClass={cx("text-2xl", titleClassName)}
      footerClassName={footerClassName}
      actions={actions}
    >
      <div className="grid grid-cols-4">
        {topologies.map((item) => (
          <TopologyCard
            size="small"
            topology={item}
            key={item.id}
            selectionMode
            selected={checked.includes(item.id)}
            onSelectionChange={() => toggleChecked(item.id)}
          />
        ))}
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
