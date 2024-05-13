import { getPerson } from "@flanksource-ui/api/services/users";
import { Avatar } from "@flanksource-ui/ui/Avatar";
import { useQuery } from "@tanstack/react-query";

type GetUserAvatarProps = {
  userID: string;
};

export default function GetUserAvatar({ userID }: GetUserAvatarProps) {
  const { data: person, isLoading } = useQuery({
    queryKey: ["person", userID],
    queryFn: () => getPerson(userID),
    enabled: !!userID,
    select: (data) => data.data?.[0]
  });

  if (isLoading || !person) {
    return null;
  }

  return <Avatar user={person} />;
}
