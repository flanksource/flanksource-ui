import { Notification } from "../../components/Notifications/notificationsTableColumns";
import { AVATAR_INFO } from "../../constants";
import { IncidentCommander } from "../axios";
import { resolvePostGrestRequestWithPagination } from "../resolve";

export const getNotificationsSummary = async () => {
  return resolvePostGrestRequestWithPagination(
    IncidentCommander.get<Notification[] | null>(
      `/notifications_summary?select=*,person:person_id(${AVATAR_INFO}),team:team_id(id,name,icon),created_by(${AVATAR_INFO})&order=created_at.desc`,
      {
        headers: {
          Prefer: "count=exact"
        }
      }
    )
  );
};

export const getNotificationById = async (id: string) => {
  const res = await IncidentCommander.get<Notification[] | null>(
    `/notifications?id=eq.${id}&select=*,person:person_id(${AVATAR_INFO}),team:team_id(id,name,icon),created_by(${AVATAR_INFO})`
  );
  return res.data ? res.data?.[0] : undefined;
};
