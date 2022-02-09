import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { BsFillBarChartFill, BsFillChatSquareTextFill } from "react-icons/all";
// import { BsFillChatSquareTextFill } from "react-icons/bs";
import { AvatarWithDefaultImage, Icon } from "../../../Icon";

export const HypothesisRow = ({
  renderChevronIcon,
  iconLeft,
  iconLeftClassName,
  text,
  image,
  onOpenModal,
  showMessageIcon,
  showSignalIcon
}) => (
  <div className="w-full flex justify-between rounded-8px border focus:outline-none bg-white">
    <div className="flex items-center h-12 w-full">
      {renderChevronIcon()}
      <div
        className={clsx(
          "ml-2 bg-lighter-gray rounded-full p-2 w-8 h-8",
          iconLeftClassName
        )}
      >
        {iconLeft}
      </div>
      <span
        className="ml-3 text-sm font-normal w-full text-left"
        onClick={onOpenModal}
        role="presentation"
      >
        {text}
      </span>
    </div>
    <div className="flex items-center h-12 pr-5 ml-1.5">
      {showMessageIcon && (
        <div className="ml-3.5 mr-2.5 text-dark-blue">
          <BsFillChatSquareTextFill />
        </div>
      )}
      {showSignalIcon && (
        <div className="text-dark-blue">
          <BsFillBarChartFill />
        </div>
      )}
      <AvatarWithDefaultImage className="h-6 w-6 ml-4 mr-3.5 " image={image} />
    </div>
  </div>
);

HypothesisRow.propTypes = {
  text: PropTypes.string,
  showMessageIcon: PropTypes.bool,
  showSignalIcon: PropTypes.bool,
  image: PropTypes.string,
  renderChevronIcon: PropTypes.func,
  onOpenModal: PropTypes.func
};

HypothesisRow.defaultProps = {
  showMessageIcon: false,
  showSignalIcon: false,
  text: "",
  image: "",
  renderChevronIcon: () => {},
  onOpenModal: () => {}
};
