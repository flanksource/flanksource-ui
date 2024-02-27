import { Meta, StoryFn } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Formik } from "formik";
import { rest } from "msw";
import PlaybookRunParams from "./PlaybookRunParams";

const defaultQueryClient = new QueryClient();

export default {
  title: "PlaybookRunParams",
  component: PlaybookRunParams,
  decorators: [
    (Story: React.FC) => (
      <div className="w-full max-h-full overflow-auto p-1">
        <Story />
      </div>
    )
  ],
  parameters: {
    msw: {
      handlers: [
        rest.get("/api/db/people", (req, res, ctx) => {
          return res(
            ctx.json([
              {
                id: "01884890-7a73-541b-461f-8d6ad30634d8",
                name: "System",
                avatar: null,
                type: null,
                team_id: null,
                organization: null,
                title: null,
                email: null,
                phone: null,
                properties: null,
                created_at: "2023-05-23T12:23:28.115299+00:00",
                updated_at: null,
                external_id: null,
                last_login: null
              },
              {
                id: "acfc0559-c17b-4c84-a922-f2c57e5c66d6",
                name: "aB SADa",
                avatar: null,
                type: null,
                team_id: null,
                organization: null,
                title: null,
                email: "a@test.com",
                phone: null,
                properties: null,
                created_at: "2023-05-31T11:04:14.427924+00:00",
                updated_at: null,
                external_id: null,
                last_login: null
              },
              {
                id: "5146f95d-0180-43c5-bc43-92460d3b021e",
                name: "JOhn doe",
                avatar: null,
                type: null,
                team_id: null,
                organization: null,
                title: null,
                email: "john@doe.com",
                phone: null,
                properties: null,
                created_at: "2023-06-08T07:15:02.364745+00:00",
                updated_at: null,
                external_id: null,
                last_login: null
              },
              {
                id: "018b438b-9679-9cac-b841-220e13d807e8",
                name: "agent-504d3075",
                avatar: null,
                type: "agent",
                team_id: null,
                organization: null,
                title: null,
                email: "agent-504d3075@local",
                phone: null,
                properties: null,
                created_at: "2023-10-18T16:08:23.416563+00:00",
                updated_at: null,
                external_id: null,
                last_login: null
              },
              {
                id: "018b438d-780d-d185-0217-fd8c305512dd",
                name: "agent-e8d87754",
                avatar: null,
                type: "agent",
                team_id: null,
                organization: null,
                title: null,
                email: "agent-e8d87754@local",
                phone: null,
                properties: null,
                created_at: "2023-10-18T16:10:26.701183+00:00",
                updated_at: null,
                external_id: null,
                last_login: null
              }
            ])
          );
        }),
        rest.get("/api/db/teams", (req, res, ctx) => {
          return res(
            ctx.json([
              {
                id: "01889ef8-1f09-d790-841d-e5c0b6f40ee9",
                name: "DevTeam - Wycliffe",
                icon: "kubernetes",
                spec: {},
                source: null,
                created_by: "663f826b-6fbb-4c16-98d8-9418f708cb86",
                created_at: "2023-06-09T07:04:01.033498+00:00",
                updated_at: "2023-06-09T07:04:01.033498+00:00",
                deleted_at: null
              },
              {
                id: "01889efb-ae90-c19b-71f0-227fe36fd6a4",
                name: "Test Team 2",
                icon: "graphql",
                spec: {},
                source: null,
                created_by: "663f826b-6fbb-4c16-98d8-9418f708cb86",
                created_at: "2023-06-09T07:07:54.384291+00:00",
                updated_at: "2023-06-09T07:07:54.384291+00:00",
                deleted_at: null
              },
              {
                id: "018a6aab-ef53-3dbd-c705-0d780df9334d",
                name: "Nepal",
                icon: "group",
                spec: {
                  notifications: [
                    {
                      url: "smtp://system/?To=aditya@flanksource.com",
                      name: "aditya@flanksource.com"
                    }
                  ]
                },
                source: null,
                created_by: "663f826b-6fbb-4c16-98d8-9418f708cb86",
                created_at: "2023-09-06T13:26:07.44344+00:00",
                updated_at: "2023-09-06T13:26:07.44344+00:00",
                deleted_at: null
              }
            ])
          );
        }),
        rest.get("/api/db/component_names", (req, res, ctx) => {
          return res(
            ctx.json([
              {
                id: "0189f817-9def-b91d-3c16-a26438660cc7",
                path: "0189f817-9bb9-a8bc-4a1e-c19830134576.0189f817-9bd9-e4cb-b82a-73b9c6c33d5f",
                external_id:
                  "monitoring/alertmanager-kube-prometheus-stack-alertmanager-0",
                type: "KubernetesPod",
                name: "alertmanager-kube-prometheus-stack-alertmanager-0",
                created_at: "2023-08-15T07:27:24.655344+00:00",
                updated_at: "2024-01-09T05:36:03.218982+00:00",
                icon: "pods",
                parent_id: "0189f817-9bd9-e4cb-b82a-73b9c6c33d5f"
              },
              {
                id: "0189f817-9df3-dc3b-d381-e5fdcb5bca64",
                path: "0189f817-9bb9-a8bc-4a1e-c19830134576.0189f817-9bd9-e4cb-b82a-73b9c6c33d5f",
                external_id:
                  "monitoring/alertmanager-kube-prometheus-stack-alertmanager-1",
                type: "KubernetesPod",
                name: "alertmanager-kube-prometheus-stack-alertmanager-1",
                created_at: "2023-08-15T07:27:24.659717+00:00",
                updated_at: "2024-01-09T05:36:03.226825+00:00",
                icon: "pods",
                parent_id: "0189f817-9bd9-e4cb-b82a-73b9c6c33d5f"
              },
              {
                id: "0189f817-9df8-6bfa-a9cf-579a3ddc59ad",
                path: "0189f817-9bb9-a8bc-4a1e-c19830134576.0189f817-9bd9-e4cb-b82a-73b9c6c33d5f",
                external_id:
                  "monitoring/alertmanager-kube-prometheus-stack-alertmanager-2",
                type: "KubernetesPod",
                name: "alertmanager-kube-prometheus-stack-alertmanager-2",
                created_at: "2023-08-15T07:27:24.664577+00:00",
                updated_at: "2024-01-09T05:36:03.239661+00:00",
                icon: "pods",
                parent_id: "0189f817-9bd9-e4cb-b82a-73b9c6c33d5f"
              },
              {
                id: "018a677f-3b9a-89b9-555a-539845cec171",
                path: "0189f817-9bb9-a8bc-4a1e-c19830134576.0189f817-9bd9-e4cb-b82a-73b9c6c33d5f",
                external_id: "canaries/apacheds-7f9784686b-nccrx",
                type: "KubernetesPod",
                name: "apacheds-7f9784686b-nccrx",
                created_at: "2023-09-05T22:38:26.201905+00:00",
                updated_at: "2024-01-05T06:20:36.605128+00:00",
                icon: "pods",
                parent_id: "0189f817-9bd9-e4cb-b82a-73b9c6c33d5f"
              },
              {
                id: "018a677f-3c2f-df49-583c-36edd0c22f50",
                path: "0189f817-9bb9-a8bc-4a1e-c19830134576.0189f817-9bd9-e4cb-b82a-73b9c6c33d5f",
                external_id: "default/apacheds-7f9784686b-r4tcd",
                type: "KubernetesPod",
                name: "apacheds-7f9784686b-r4tcd",
                created_at: "2023-09-05T22:38:26.351681+00:00",
                updated_at: "2024-01-05T06:20:36.833937+00:00",
                icon: "pods",
                parent_id: "0189f817-9bd9-e4cb-b82a-73b9c6c33d5f"
              }
            ])
          );
        }),
        rest.get("/api/db/config_item", (req, res, ctx) => {
          return res(
            ctx.json([
              {
                id: "00b7b260-1fc2-40e9-b068-4e7e0c36bd02",
                name: "argo-argocd-applicationset-controller-7dbd4bc68d-b5sjt",
                type: "Kubernetes::Pod",
                config_class: "Pod"
              },
              {
                id: "0185bd26-bce9-49d2-a40c-5b187a5312f2",
                name: "podinfo-97c6d4b94-gchdv",
                type: "Kubernetes::Pod",
                config_class: "Pod"
              },
              {
                id: "01884897-0cb2-001b-09fa-96e0b0a22abc",
                name: "cert-manager-webhook",
                type: "Kubernetes::ConfigMap",
                config_class: "ConfigMap"
              },
              {
                id: "01884897-0cb5-2841-f1ce-eba3b355751d",
                name: "kube-root-ca.crt",
                type: "Kubernetes::ConfigMap",
                config_class: "ConfigMap"
              },
              {
                id: "01884897-0cb7-092d-0599-30bf0c8d568d",
                name: "kube-root-ca.crt",
                type: "Kubernetes::ConfigMap",
                config_class: "ConfigMap"
              }
            ])
          );
        }),
        rest.post("/api/playbook/:id/params", (req, res, ctx) => {
          return res(
            ctx.json({
              params: [
                {
                  label: "Text Input (Default)",
                  name: "text-input",
                  type: "text"
                },
                {
                  label: "Checkbox",
                  name: "checkbox",
                  type: "checkbox"
                },
                {
                  label: "Teams Selector",
                  name: "teams",
                  type: "team"
                },
                {
                  label: "People Selector",
                  name: "people",
                  type: "people",
                  properties: {
                    role: "admin"
                  }
                },
                {
                  label: "Component Selector",
                  name: "component",
                  type: "component",
                  properties: {
                    filter: {
                      type: "KubernetesPod"
                    }
                  }
                },
                {
                  label: "Configs Selector",
                  name: "configs",
                  type: "config",
                  properties: {
                    filter: {
                      type: "Pod"
                    }
                  }
                },
                {
                  label: "Code Editor (YAML)",
                  name: "code-editor-yaml",
                  type: "code",
                  properties: {
                    language: "yaml"
                  }
                },
                {
                  label: "Code Editor (JSON)",
                  name: "code-editor-json",
                  type: "code",
                  properties: {
                    language: "json"
                  }
                },
                {
                  label: "Textarea",
                  name: "textarea",
                  type: "text",
                  properties: {
                    multiline: true
                  }
                },
                {
                  label: "List",
                  name: "list",
                  type: "list",
                  properties: {
                    options: [
                      {
                        label: "Option 1",
                        value: "option-1"
                      },
                      {
                        label: "Option 2",
                        value: "option-2"
                      },
                      {
                        label: "Option 3",
                        value: "option-3"
                      }
                    ]
                  }
                }
              ]
            })
          );
        })
      ]
    }
  }
} as Meta<typeof PlaybookRunParams>;

const Template: StoryFn<typeof PlaybookRunParams> = (arg) => {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <div className="flex flex-col h-full gap-2 overflow-y-auto">
        <Formik
          initialValues={{
            id: "123",
            config_id: "123"
          }}
          onSubmit={() => {}}
        >
          <PlaybookRunParams />
        </Formik>
      </div>
    </QueryClientProvider>
  );
};

export const PlaybookParams = Template.bind({});

PlaybookParams.args = {
  playbook: {
    parameters: [
      {
        label: "Text Input (Default)",
        name: "text-input",
        type: "text"
      },
      {
        label: "Checkbox",
        name: "checkbox",
        type: "checkbox"
      },
      {
        label: "Teams Selector",
        name: "teams",
        type: "team"
      },
      {
        label: "People Selector",
        name: "people",
        type: "people",
        properties: {
          role: "admin"
        }
      },
      {
        label: "Component Selector",
        name: "component",
        type: "component",
        properties: {
          filter: {
            type: "KubernetesPod"
          }
        }
      },
      {
        label: "Configs Selector",
        name: "configs",
        type: "config",
        properties: {
          filter: {
            type: "Pod"
          }
        }
      },
      {
        label: "Code Editor (YAML)",
        name: "code-editor-yaml",
        type: "code",
        properties: {
          language: "yaml"
        }
      },
      {
        label: "Code Editor (JSON)",
        name: "code-editor-json",
        type: "code",
        properties: {
          language: "json"
        }
      },
      {
        label: "Textarea",
        name: "textarea",
        type: "text",
        properties: {
          multiline: true
        }
      },
      {
        label: "List",
        name: "list",
        type: "list",
        properties: {
          options: [
            {
              label: "Option 1",
              value: "option-1"
            },
            {
              label: "Option 2",
              value: "option-2"
            },
            {
              label: "Option 3",
              value: "option-3"
            }
          ]
        }
      }
    ]
  }
};

PlaybookParams.parameters = {};
