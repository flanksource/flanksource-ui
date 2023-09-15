import { useMemo } from "react";
import { Avatar } from "../Avatar";

type Props = {
  users: {
    avatar?: string;
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
