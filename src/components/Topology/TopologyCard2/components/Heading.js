import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";

export const Heading = ({ size }) => {
  return (
    <div className={cx("heading", size)}>
      <div className="heading-protocol">
        <span>http://</span>
      </div>
      <div className="heading-name">
        <h6>Pet Service</h6>
        <span title="jobs-demo">jobs-demo</span>
      </div>
    </div>
  );
};

Heading.propTypes = {
  size: PropTypes.string.isRequired
};
