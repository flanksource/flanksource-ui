import PropTypes from "prop-types";

export const topologyCardCommonPropTypes = {
  selectionMode: PropTypes.bool,
  selected: PropTypes.bool,
  onSelectionChange: PropTypes.func,
  topology: PropTypes.shape({
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    icon: PropTypes.string,
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        text: PropTypes.string
      }).isRequired
    )
  }).isRequired
};
