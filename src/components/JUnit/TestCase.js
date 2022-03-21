import React from "react";
import PropTypes from "prop-types";
import { IoAlert, IoCheckmark } from "react-icons/io5";

export function TestCase({ name, status, onSelect }) {
  return (
    <div>
      <button
        type="button"
        className="py-1 px-1 border border-gray-200 flex items-center"
        onClick={onSelect}
      >
        {status === "passed" ? (
          <IoCheckmark color="green" className="mr-1" />
        ) : (
          <IoAlert color="red" />
        )}
        <span>{name}</span>
      </button>
    </div>
  );
}

TestCase.propTypes = {
  status: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func
};

TestCase.defaultProps = {
  onSelect: () => null
};
