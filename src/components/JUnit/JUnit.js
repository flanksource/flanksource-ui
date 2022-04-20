import React, { useState } from "react";
import PropTypes from "prop-types";
import { ModalTestCase } from "./ModalTestCase";
import { JUnitTable } from "./JUnitTable";
import { Summary } from "./Summery";

export function JUnit({
  suites,
  duration,
  failed,
  passed,
  hidePassing,
  hideSummary
}) {
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  return (
    <div>
      {!hideSummary && (
        <Summary suites={suites} failed={failed} passed={passed} />
      )}

      <JUnitTable
        suites={suites}
        onSelectTestCase={setSelectedTestCase}
        hidePassing={hidePassing}
      />

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
  passed: PropTypes.number.isRequired,
  hidePassing: PropTypes.bool,
  hideSummary: PropTypes.bool
};

JUnit.defaultProps = {
  hidePassing: true,
  hideSummary: false
};
