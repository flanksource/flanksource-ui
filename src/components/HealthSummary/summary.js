import PropTypes from "prop-types";
import { Icon } from "../Icon";
import { Chip } from "../Chip";
import { Link } from "react-router-dom";

function getChipsFromSummary(component, summary) {
  if (!summary) {
    return [];
  }
  const chips = [];
  if (summary.healthy > 0) {
    chips.push(
      <Chip
        text={summary.healthy}
        key={`${component.id}-healthy`}
        label="Healthy"
        color="green"
      />
    );
  }
  if (summary.unhealthy > 0) {
    chips.push(
      <Chip
        text={summary.unhealthy}
        key={`${component.id}-unhealthy`}
        label="Unhealthy"
        color="red"
      />
    );
  }
  if (summary.warning > 0) {
    chips.push(
      <Chip
        text={summary.warning}
        key={`${component.id}-warning`}
        label="Warning"
        color="orange"
      />
    );
  }
  if (summary.unknown > 0) {
    chips.push(
      <Chip
        text={summary.unknown}
        key={`${component.id}-unknown`}
        label="Unknown"
        color="gray"
      />
    );
  }
  return chips;
}

export const HealthSummary = ({ component, iconSize, link }) => {
  const { name, icon, summary } = component;

  return (
    <div className="flex mb-1.5">
      <Icon name={icon} className="mr-1" size={iconSize} />
      <Link
        className="text-xs linear-1.21rel mr-1 cursor-pointer hover:underline"
        to={link}
      >
        {name}
      </Link>
      <div className="flex gap-2 ">
        {getChipsFromSummary(component, summary)}
      </div>
    </div>
  );
};

HealthSummary.propTypes = {
  iconSize: PropTypes.string,
  component: PropTypes.shape({}).isRequired,
  link: PropTypes.string
};

HealthSummary.defaultProps = {
  iconSize: "sm"
};
