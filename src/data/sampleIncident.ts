import { IncidentSeverity } from "../api/services/incident";

const sampleIncident = [
  {
    id: "9421a91b-cd6c-4456-b5fa-91f54c53485e",
    title: "Test new incident",
    created_by: "01814f6d-edba-8467-55ca-78974a2004f6",
    commander_id: {
      id: "01814f6d-edba-8467-55ca-78974a2004f6",
      name: "new user",
      avatar: null
    },
    communicator_id: {
      id: "01814f6d-edba-8467-55ca-78974a2004f6",
      name: "new user",
      avatar: null
    },
    severity: IncidentSeverity.Low,
    description: "",
    type: "issue",
    status: "open",
    created_at: "2022-06-13T07:25:02.728582",
    updated_at: "2022-06-13T07:25:02.728582",
    hypothesis: [
      {
        id: "aa1f8dae-3d87-4a19-8afe-45089cfdd442",
        created_by: {
          id: "01814f6d-edba-8467-55ca-78974a2004f6",
          name: "new user",
          avatar: null
        },
        incident_id: "9421a91b-cd6c-4456-b5fa-91f54c53485e",
        parent_id: "f87c055a-7529-47ee-b363-7059c258e135",
        type: "solution",
        title: "Another hypothesis",
        status: "likely",
        created_at: "2022-06-15T04:11:48.157355",
        updated_at: "2022-06-15T04:11:48.157355",
        evidence: [],
        comment: []
      },
      {
        id: "f87c055a-7529-47ee-b363-7059c258e135",
        created_by: {
          id: "01814f6d-edba-8467-55ca-78974a2004f6",
          name: "new user",
          avatar: null
        },
        incident_id: "9421a91b-cd6c-4456-b5fa-91f54c53485e",
        parent_id: "8604c18c-1d50-4cc6-9950-b467e8c9a786",
        type: "factor",
        title: "asdsad",
        status: "possible",
        created_at: "2022-06-13T07:27:19.854956",
        updated_at: "2022-06-13T07:27:19.854956",
        evidence: [],
        comment: [
          {
            comment: "sdsad",
            id: "ee41ba95-ba9a-4690-958a-fe78676ccf8a",
            created_by: {
              id: "01814d20-2ba2-0671-9010-76444d1dc2c9",
              name: "Ciju Cherian",
              avatar:
                "https://lh3.googleusercontent.com/a/AATXAJx2VFfw2SBZ8LpsmouBWbC6fnTVwQLKGeb3gZM1=s96-c"
            }
          },
          {
            comment: "sadsd",
            id: "e0e5fc4b-015c-4680-ad10-a692a915cb56",
            created_by: {
              id: "01815170-b157-9367-104f-14d276c75336",
              name: "Isaac Newton",
              avatar: "https://i.pravatar.cc/150?u=newton@flanksource.com"
            }
          }
        ]
      },
      {
        id: "8604c18c-1d50-4cc6-9950-b467e8c9a786",
        created_by: {
          id: "01814f6d-edba-8467-55ca-78974a2004f6",
          name: "new user",
          avatar: null
        },
        incident_id: "9421a91b-cd6c-4456-b5fa-91f54c53485e",
        parent_id: null,
        type: "root",
        title: "Test new incident",
        status: "possible",
        created_at: "2022-06-13T07:25:03.531292",
        updated_at: "2022-06-13T07:25:03.531292",
        evidence: [
          {
            id: "07c3273a-b853-434d-9480-cc7568940dc6",
            evidence: {
              id: "018138c7-c627-98b8-65e2-c9fd9fb6e9db"
            },
            type: "topology"
          }
        ],
        comment: [
          {
            comment: "sadsad",
            id: "0c3956da-a39a-40e4-b40f-7e16464b2b28",
            created_by: {
              id: "01814f6d-edba-8467-55ca-78974a2004f6",
              name: "new user",
              avatar: null
            }
          },
          {
            comment: "sadsa",
            id: "32530d44-cab2-48a6-9468-189dc43ff4ce",
            created_by: {
              id: "01814f6d-edba-8467-55ca-78974a2004f6",
              name: "new user",
              avatar: null
            }
          }
        ]
      },
      {
        id: "aefe7c82-f1b9-4233-ae56-7bb389efa6e1",
        created_by: {
          id: "01815170-b157-9367-104f-14d276c75336",
          name: "Isaac Newton",
          avatar: "https://i.pravatar.cc/150?u=newton@flanksource.com"
        },
        incident_id: "9421a91b-cd6c-4456-b5fa-91f54c53485e",
        parent_id: "8604c18c-1d50-4cc6-9950-b467e8c9a786",
        type: "factor",
        title: "New issue",
        status: "unlikely",
        created_at: "2022-06-15T04:12:13.497449",
        updated_at: "2022-06-15T04:12:13.497449",
        evidence: [],
        comment: []
      }
    ],
    responder: []
  }
];

function buildTreeFromHypothesisList(
  list: { id: string; parent_id: string | null }[]
) {
  const tree: Record<any, any> = {};

  if (list.length === 0) {
    return null;
  }

  list.forEach((node) => {
    tree[node.id] = { ...node }; // mapNode(node);
  });

  // 2nd pass to add children
  list.forEach((node) => {
    if (node.parent_id != null) {
      tree[node.parent_id].children = [
        ...(tree[node.parent_id].children || []),
        tree[node.id]
      ];
    }
  });

  // 3rd pass to remove children from root
  list.forEach((node: any) => {
    if (node.parent_id != null) {
      delete tree[node.id as any];
    }
  });

  return Object.values(tree)[0];
}

export const sampleIncidentNode = buildTreeFromHypothesisList(
  sampleIncident[0].hypothesis
);

export default sampleIncident;
