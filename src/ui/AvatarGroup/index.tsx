import { useMemo } from "react";
import PropTypes from "prop-types";
import { Avatar } from "../Avatar";

type Props = {
  users: {
    avatar?: string;
    name: string;
  }[];
  size: "sm" | "lg" | "md";
  maxCount: number;
};

export const AvatarGroup = ({
  users,
  size = "md",
  maxCount = 5,
  ...props
}: Props) => {
  const sliceUsers = useMemo(
    () => users?.slice(0, maxCount) || [],
    [users, maxCount]
  );
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {sliceUsers?.map((user, index) => (
        <Avatar
          key={user.avatar || index}
          user={user}
          size={size}
          containerProps={{ className: "rounded-full ring-2 ring-white" }}
          {...props}
        />
      ))}
    </div>
  );
};

AvatarGroup.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string
    })
  ).isRequired,
  size: PropTypes.string,
  maxCount: PropTypes.number
};

AvatarGroup.defaultProps = {
  size: "md",
  maxCount: 5
};
