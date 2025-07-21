import { formatDistanceToNow } from "date-fns";

export const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
};
