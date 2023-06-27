import { useQuery } from "@tanstack/react-query";
import { template } from "lodash";
import { Icon } from "../../components";
import { ResponderPropsKeyToLabelMap } from "../../components/IncidentDetails/AddResponders/AddResponder";
import { getRespondersForTheIncident } from "../services/responder";
import { Avatar } from "../../components/Avatar";

export function useIncidentRespondersQuery(incidentId: string) {
  return useQuery(
    ["incident", incidentId, "responders"],
    () => getRespondersForTheIncident(incidentId),
    {
      select: (data) => {
        return data.map((item) => {
          const properties: Record<string, any> = {
            ...(item.properties || {}),
            external_id: item.external_id || "NA"
          };

          const links: Record<string, any> = {};
          if (item.external_id) {
            links.external_id_link =
              item?.team?.spec?.responder_clients?.[
                properties?.responderType
              ]?.linkUrl;
            if (links.external_id_link) {
              try {
                links.external_id_link = template(links.external_id_link)({
                  ID: item.external_id
                });
              } catch (ex) {}
            }
          }

          const icon = item.team_id
            ? () => {
                if (!item.team?.icon) {
                  return null;
                }
                return (
                  <Icon className="inline-block h-5" name={item.team.icon} />
                );
              }
            : () => <Avatar user={item.person} />;

          return {
            name: item.team_id ? item.team?.name : item.person?.name,
            type: item.properties?.responderType,
            external_id: item.external_id,
            links: links,
            icon: icon,
            properties: Object.keys(properties)
              .map((key) => {
                if (!["responderType"].includes(key)) {
                  return ResponderPropsKeyToLabelMap[
                    key as keyof typeof ResponderPropsKeyToLabelMap
                  ]
                    ? {
                        label:
                          ResponderPropsKeyToLabelMap[
                            key as keyof typeof ResponderPropsKeyToLabelMap
                          ],
                        value:
                          item.properties?.[
                            key as keyof typeof item.properties
                          ],
                        link: links[`${key}_link`]
                          ? {
                              label: item.properties?.[key],
                              value: links[`${key}_link`]
                            }
                          : null
                      }
                    : undefined;
                } else {
                  return null;
                }
              })
              .filter((v) => v),
            id: item.id,
            json: {
              ...item,
              properties: properties,
              links: links
            }
          };
        });
      },
      enabled: !!incidentId
    }
  );
}
