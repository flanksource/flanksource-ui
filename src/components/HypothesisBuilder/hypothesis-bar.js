import React, { useMemo } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  BsBraces,
  BsFillBarChartFill,
  BsFillChatSquareTextFill,
  BsTrash
} from "react-icons/bs";
import { VscTypeHierarchy } from "react-icons/vsc";
import { ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import { AiOutlineSearch } from "react-icons/ai";
import { HypothesisStatuses } from "../../constants/hypothesis-statuses";
import { deleteHypothesis } from "../../api/services/hypothesis";
import { Avatar } from "../Avatar";
import { AvatarGroup } from "../AvatarGroup";

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
    config: BsBraces,
    log: BsFillBarChartFill,
    topology: VscTypeHierarchy
  };

  if (mapping[icon]) {
    const Component = mapping[icon];
    return <Component size={18} key={icon} {...props} />;
  }

  return null;
};

export const HypothesisBar = ({ hypothesis, onTitleClick, startAdornment }) => {
  const {
    title: rawTitle,
    status,
    created_by: createdBy,
    evidence,
    comment
  } = hypothesis;

  const title = useMemo(() => (rawTitle ?? "").trim(), [rawTitle]);

  const { StatusIcon, statusColorClass } = useMemo(
    () =>
      statusToStatusIconMapping[status] || statusToStatusIconMapping.fallback,
    [status]
  );

  const infoIcons = evidence
    .map((e) => e.type)
    .concat(comment.length ? ["comment"] : []);

  const commentsMap = new Map(
    comment.map((c) => [c?.created_by?.id, c?.created_by])
  );
  commentsMap.delete(createdBy.id);
  const involved = [createdBy].concat(Array.from(commentsMap.values()));

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
      <div className="flex items-end pb-3.5 pr-3 space-x-4">
        <div className="flex flex-row">
          {infoIcons.map((i) => (
            <div key={i} className="px-1">
              {renderInfoIcon(i, { className: "text-dark-blue" })}
            </div>
          ))}
        </div>
        <div>
          {createdBy && <AvatarGroup maxCount={5} users={involved} size="sm" />}
        </div>
        <div>
          <BsTrash
            className="text-gray-600 border-0 border-l-1 border-gray-200"
            size={18}
            onClick={() => deleteHypothesis(hypothesis.id)}
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
