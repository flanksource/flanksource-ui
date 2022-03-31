import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "../Avatar";

export const AvatarGroup = ({ users, size, ...props }) => (
  <div className="flex -space-x-2 overflow-hidden">
    {users?.map((user) => (
      <Avatar
        key={user.avatar}
        user={user}
        size={size}
        containerProps={{ className: "rounded-full ring-2 ring-white" }}
        {...props}
      />
    ))}
  </div>
);

AvatarGroup.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string
    })
  ).isRequired,
  size: PropTypes.string
};

AvatarGroup.defaultProps = {
  size: "md"
};
