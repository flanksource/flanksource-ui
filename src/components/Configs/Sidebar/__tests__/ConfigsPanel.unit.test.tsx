import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter } from "react-router-dom";
import Config, { ConfigsPanelList } from "../ConfigsPanel";

const server = setupServer(
  http.get("/api/db/config_relationships", () => {
    return HttpResponse.json([
      {
        config_id: "0189a50f-aa44-32b7-0e3b-dc86b37c9236",
        related_id: "0189a50f-afca-1425-9e15-56d0af533c76",
        relation: "NamespaceConfigMap",
        created_at: "2024-01-03T13:30:23.113168+00:00",
        updated_at: "2024-01-03T13:30:23.113168+00:00",
        deleted_at: null,
        selector_id: "",
        configs: {
          id: "0189a50f-aa44-32b7-0e3b-dc86b37c9236",
          type: "Kubernetes::ConfigMap",
          name: "apacheds-ldif",
          config_class: "ConfigMap",
          deleted_at: null
        },
        related: {
          id: "0189a50f-afca-1425-9e15-56d0af533c76",
          type: "Kubernetes::Namespace",
          name: "canaries",
          config_class: "Namespace",
          deleted_at: null
        }
      },
      {
        config_id: "0189a50f-aa44-32b7-0e3b-dc86b37c9236",
        related_id: "0189da8a-8407-e486-4824-58b8a060301d",
        relation: "NamespaceConfigMap",
        created_at: "2024-01-02T13:10:20.943685+00:00",
        updated_at: "2024-01-02T13:10:20.943685+00:00",
        deleted_at: null,
        selector_id: "",
        configs: {
          id: "0189a50f-aa44-32b7-0e3b-dc86b37c9236",
          type: "Kubernetes::ConfigMap",
          name: "apacheds-ldif",
          config_class: "ConfigMap",
          deleted_at: null
        },
        related: {
          id: "0189da8a-8407-e486-4824-58b8a060301d",
          type: "Kubernetes::Namespace",
          name: "canaries 1",
          config_class: "Namespace",
          deleted_at: null
        }
      },
      {
        config_id: "0189a50f-aa44-32b7-0e3b-dc86b37c9236",
        related_id: "018a6789-eab0-0d45-ae6e-41de5cc68b92",
        relation: "KustomizationConfigMap",
        created_at: "2023-12-27T07:26:26.111838+00:00",
        updated_at: "2023-12-27T07:26:26.111838+00:00",
        deleted_at: null,
        selector_id: "",
        configs: {
          id: "0189a50f-aa44-32b7-0e3b-dc86b37c9236",
          type: "Kubernetes::ConfigMap",
          name: "apacheds-ldif",
          config_class: "ConfigMap",
          deleted_at: null
        },
        related: {
          id: "018a6789-eab0-0d45-ae6e-41de5cc68b92",
          type: "Kubernetes::Kustomization",
          name: "canaries 2",
          config_class: "Kustomization",
          deleted_at: null
        }
      },
      {
        config_id: "0189a50f-aa44-32b7-0e3b-dc86b37c9236",
        related_id: "01899765-8381-a5d5-dd4f-cb83bc89437d",
        relation: "KustomizationConfigMap",
        created_at: "2023-12-27T07:26:26.115612+00:00",
        updated_at: "2023-12-27T07:26:26.115612+00:00",
        deleted_at: null,
        selector_id: "",
        configs: {
          id: "0189a50f-aa44-32b7-0e3b-dc86b37c9236",
          type: "Kubernetes::ConfigMap",
          name: "apacheds-ldif",
          config_class: "ConfigMap",
          deleted_at: null
        },
        related: {
          id: "01899765-8381-a5d5-dd4f-cb83bc89437d",
          type: "Kubernetes::Kustomization",
          name: "canaries 3",
          config_class: "Kustomization",
          deleted_at: null
        }
      }
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient({});

describe("ConfigsPanelList", () => {
  test("should render the correct config, the config whose config id, isn't the same as the prop", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <ConfigsPanelList configId="0189a50f-aa44-32b7-0e3b-dc86b37c9236" />
        </QueryClientProvider>
      </MemoryRouter>
    );

    // should render the correct config name, the one that is not the configId
    expect(await screen.findByText("canaries")).toBeInTheDocument();
    expect(await screen.findByText(/canaries 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/canaries 2/i)).toBeInTheDocument();
    expect(await screen.findByText(/canaries 3/i)).toBeInTheDocument();

    // should have 4 links, with correct configs
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getAllByRole("link")[0]).toHaveAttribute(
      "href",
      "/catalog/0189a50f-afca-1425-9e15-56d0af533c76"
    );
    expect(screen.getAllByRole("link")[1]).toHaveAttribute(
      "href",
      "/catalog/0189da8a-8407-e486-4824-58b8a060301d"
    );
    expect(screen.getAllByRole("link")[2]).toHaveAttribute(
      "href",
      "/catalog/018a6789-eab0-0d45-ae6e-41de5cc68b92"
    );
    expect(screen.getAllByRole("link")[3]).toHaveAttribute(
      "href",
      "/catalog/01899765-8381-a5d5-dd4f-cb83bc89437d"
    );

    // should not render current config, as it is the same as the configId
    expect(screen.queryByTestId(/apacheds-ldif/i)).not.toBeInTheDocument();
  });
});

describe("ConfigsPanel", () => {
  test("should show correct config count", async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <Config configId="0189a50f-aa44-32b7-0e3b-dc86b37c9236" />
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(
      await screen.findByTitle(/Total catalog count/i)
    ).toBeInTheDocument();
    expect(screen.queryByTitle(/Total catalog count/i)).toHaveTextContent("4");
  });
});
