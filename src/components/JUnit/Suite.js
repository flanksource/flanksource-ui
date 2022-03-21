import React, { useState } from "react";
import { IoAlert, IoCaretUpOutline } from "react-icons/io5";
import PropTypes from "prop-types";
import clsx from "clsx";
import { TestCase } from "./TestCase";

export function Suite({
  name,
  passed,
  failed,
  duration,
  tests,
  onSelectTestCase
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleTests = () => {
    setIsOpen((open) => !open);
  };

  return (
    <div className="px-2 border border-gray-400">
      <button
        type="button"
        className="my-2 flex items-center"
        onClick={toggleTests}
      >
        <IoCaretUpOutline
          className={clsx("mr-2 transform duration-300", {
            "rotate-180": !isOpen
          })}
        />
        {!!failed && <IoAlert color="red" />}
        <span>{name}</span>
        <span className="px-2">
          ({passed}/{tests.length})
        </span>
        <span>{duration}ms</span>
      </button>
      {isOpen && (
        <div className="ml-4 mb-2">
          {tests.map((test, index) => (
            <TestCase
              // eslint-disable-next-line react/no-array-index-key
              key={`${test.name}_${index}`}
              name={test.name}
              status={test.status}
              onSelect={() => onSelectTestCase(test)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Suite.propTypes = {
  name: PropTypes.string.isRequired,
  passed: PropTypes.number.isRequired,
  failed: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      status: PropTypes.string
    })
  ),
  onSelectTestCase: PropTypes.func
};

Suite.defaultProps = {
  onSelectTestCase: () => null,
  tests: []
};
