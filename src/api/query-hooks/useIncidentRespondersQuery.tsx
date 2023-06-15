import { useQuery } from "@tanstack/react-query";
import { template } from "lodash";
import { Icon } from "../../components";
import { ResponderPropsKeyToLabelMap } from "../../components/IncidentDetails/AddResponders/AddResponder";
import { getRespondersForTheIncident } from "../services/responder";

export function useIncidentRespondersQuery(incidentId: string) {
  return useQuery(
    ["incident", incidentId, "responders"],
    async () => {
      const result = await getRespondersForTheIncident(incidentId);
      const data = (result?.data || []).map((item: any) => {
        item.properties.external_id = item.external_id || "NA";
        item.links = {};
        if (item.external_id) {
          item.links.external_id_link =
            item?.team_id?.spec?.responder_clients?.[
              item?.properties?.responderType
            ]?.linkUrl;
          if (item.links.external_id_link) {
            try {
              item.links.external_id_link = template(
                item.links.external_id_link
              )({
                ID: item.external_id
              });
            } catch (ex) {}
          }
        }
        return {
          name: item.team_id?.name,
          type: item.properties.responderType,
          external_id: item.external_id,
          links: item.links,
          icon:
            item.team_id?.icon &&
            (() => (
              <Icon
                className="inline-block mr-1 h-5"
                name={item.team_id.icon}
              />
            )),
          properties: Object.keys(item.properties)
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
                      value: item.properties[key],
                      link: item.links[`${key}_link`]
                        ? {
                            label: item.properties[key],
                            value: item.links[`${key}_link`]
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
          json: item
        };
      });
      return data;
    },
    {
      enabled: !!incidentId
    }
  );
}
