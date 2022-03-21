import React, { useState } from "react";
import PropTypes from "prop-types";
import { Suite } from "./Suite";
import { ModalTestCase } from "./ModalTestCase";

export function JUnit({ suites, duration, failed, passed }) {
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  return (
    <div>
      <div>
        <div>duration: {duration}</div>
        <div>failed: {failed}</div>
        <div>passed: {passed}</div>
      </div>

      <div>
        {suites.map(({ name, tests, passed, failed, duration }) => (
          <Suite
            key={name}
            name={name}
            tests={tests}
            passed={passed}
            failed={failed}
            duration={duration}
            onSelectTestCase={setSelectedTestCase}
          />
        ))}
      </div>

      <ModalTestCase
        testCase={selectedTestCase}
        onClose={() => setSelectedTestCase(null)}
      />
    </div>
  );
}

JUnit.propTypes = {
  suites: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      tests: PropTypes.arrayOf(PropTypes.shape({})),
      passed: PropTypes.number,
      failed: PropTypes.number,
      duration: PropTypes.number
    })
  ).isRequired,
  duration: PropTypes.number.isRequired,
  failed: PropTypes.number.isRequired,
  passed: PropTypes.number.isRequired
};
