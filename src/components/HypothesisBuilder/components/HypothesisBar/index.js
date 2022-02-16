import React, { useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { BsFillBarChartFill, BsFillChatSquareTextFill } from "react-icons/all";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import { AiOutlineSearch } from "react-icons/ai";
import { HypothesisStatuses } from "../../../../constants/hypothesis-statuses";
import { Avatar } from "../../../Avatar";

const statusToStatusIconMapping = {
  [HypothesisStatuses.Proven]: {
    StatusIcon: ThumbUpIcon,
    statusColorClass: "text-bright-green"
  },
  [HypothesisStatuses.Likely]: {
    StatusIcon: ThumbUpIcon,
    statusColorClass: "text-warm-green"
  },
  [HypothesisStatuses.Possible]: {
    StatusIcon: ThumbUpIcon,
    statusColorClass: "text-warmer-gray"
  },
  [HypothesisStatuses.Unlikely]: {
    StatusIcon: ThumbDownIcon,
    statusColorClass: "text-warmer-gray"
  },
  [HypothesisStatuses.Improbable]: {
    StatusIcon: ThumbDownIcon,
    statusColorClass: "text-bright-orange"
  },
  [HypothesisStatuses.Disproven]: {
    StatusIcon: ThumbDownIcon,
    statusColorClass: "text-bright-red"
  },
  fallback: {
    StatusIcon: AiOutlineSearch,
    statusColorClass: "text-bright-red"
  }
};

const renderInfoIcon = (icon, props = {}) => {
  const mapping = {
    comment: BsFillChatSquareTextFill,
    log: BsFillBarChartFill
  };

  if (mapping[icon]) {
    const Component = mapping[icon];
    return <Component key={icon} {...props} />;
  }

  return null;
};

export const HypothesisBar = ({ hypothesis, onTitleClick, startAdornment }) => {
  const { title: rawTitle, status, created_by: createdBy } = hypothesis;

  const title = useMemo(() => (rawTitle ?? "").trim(), [rawTitle]);

  const { StatusIcon, statusColorClass } = useMemo(
    () =>
      statusToStatusIconMapping[status] || statusToStatusIconMapping.fallback,
    [status]
  );

  const infoIcons = ["comment", "log"];

  return (
    <div className="w-full flex justify-between rounded-8px border focus:outline-none bg-white cursor-pointer">
      <div className="flex items-center min-h-12 w-full py-2">
        {startAdornment && (
          <div className="w-5 h-5 ml-4 mr-1 flex-0-0-a">{startAdornment}</div>
        )}
        <div
          className={clsx(
            "ml-2 bg-lighter-gray rounded-full p-2 w-8 h-8 flex-0-0-a",
            statusColorClass
          )}
        >
          <StatusIcon />
        </div>
        <span
          className="ml-3 text-sm font-normal w-full text-left flex-1 min-h-full inline-flex items-center"
          onClick={onTitleClick}
          role="presentation"
        >
          {title || "(none)"}
        </span>
      </div>
      <div className="flex items-center min-h-12 pr-3 ml-1.5 py-2">
        <div className="-mx-1 flex flex-row">
          {infoIcons.map((i) => (
            <div key={i} className="px-1">
              {renderInfoIcon(i, { className: "text-dark-blue" })}
            </div>
          ))}
        </div>
        <div className="ml-3">
          <Avatar
            srcList={createdBy.avatar}
            size="sm"
            fallbackInitials={createdBy.name}
          />
        </div>
      </div>
    </div>
  );
};

HypothesisBar.propTypes = {
  onTitleClick: PropTypes.func,
  startAdornment: PropTypes.node,
  hypothesis: PropTypes.shape({}).isRequired
};

HypothesisBar.defaultProps = {
  onTitleClick: () => {},
  startAdornment: null
};
