import { useUser } from "@flanksource-ui/context";

export default function useCurrentUserID() {
  const { user } = useUser();

  return user?.id;
}
