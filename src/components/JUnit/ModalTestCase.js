import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../Modal";

export function ModalTestCase({ testCase, onClose }) {
  const { name, status, classname, duration } = testCase || {};
  return (
    <Modal open={!!testCase} title={name} size="small" onClose={onClose}>
      <p>
        Status: <span>{status}</span>
      </p>
      <p>
        Classname: <span>{classname}</span>
      </p>
      <p>
        Duration: <span>{duration}</span>
      </p>
    </Modal>
  );
}

ModalTestCase.propTypes = {
  testCase: PropTypes.shape({
    name: PropTypes.string,
    status: PropTypes.string,
    classname: PropTypes.string,
    duration: PropTypes.number
  }),
  onClose: PropTypes.func.isRequired
};

ModalTestCase.defaultProps = {
  testCase: null
};
