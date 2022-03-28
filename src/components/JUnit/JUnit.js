import React, { useState } from "react";
import PropTypes from "prop-types";
import { ModalTestCase } from "./ModalTestCase";
import { JUnitTable } from "./JUnitTable";

export function JUnit({ suites, duration, failed, passed }) {
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  return (
    <div>
      <div>
        <div>duration: {duration}</div>
        <div>failed: {failed}</div>
        <div>passed: {passed}</div>
      </div>

      <JUnitTable suites={suites} onSelecteTestCase={setSelectedTestCase} />

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
