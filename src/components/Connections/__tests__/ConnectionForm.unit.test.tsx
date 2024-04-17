import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  ConnectionType,
  ConnectionValueType,
  connectionTypes
} from "../connectionTypes";
import ConnectionForm from "./../ConnectionForm";

const client = new QueryClient();

describe("ConnectionForm", () => {
  const connectionType: ConnectionType = connectionTypes.find(
    (type) => type.value === ConnectionValueType.Git
  )!;

  const formInitialValue = {
    name: "Test Connection",
    url: "https://test.com",
    certificate: "test",
    ref: "main"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form fields", () => {
    render(
      <ConnectionForm
        connectionType={connectionType}
        formValue={formInitialValue}
      />
    );
    expect(screen.getByLabelText("Name")).toHaveValue("Test Connection");
    expect(screen.getByLabelText("URL")).toHaveValue("https://test.com");
  });

  it("calls onConnectionSubmit when the form is submitted", async () => {
    const onConnectionSubmit = jest.fn();
    render(
      <QueryClientProvider client={client}>
        <ConnectionForm
          connectionType={connectionType}
          formValue={formInitialValue}
          onConnectionSubmit={onConnectionSubmit}
        />
      </QueryClientProvider>
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /Save/i
      })
    );

    await waitFor(() => {
      expect(onConnectionSubmit).toHaveBeenCalledWith({
        certificate: "test",
        name: "Test Connection",
        password: "",
        properties: {
          ref: "ref"
        },
        type: "git",
        url: "https://test.com",
        username: "",
        namespace: "default"
      });
    });
  });

  it("calls onConnectionDelete when the delete button is clicked", () => {
    const onConnectionDelete = jest.fn();
    render(
      <QueryClientProvider client={client}>
        <ConnectionForm
          connectionType={connectionType}
          formValue={{ ...formInitialValue, id: "123" }}
          onConnectionDelete={onConnectionDelete}
        />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onConnectionDelete).toHaveBeenCalledWith({
      name: "Test Connection",
      url: "https://test.com",
      ref: "main",
      certificate: "test",
      id: "123"
    });
  });

  it("should show connection test button", () => {
    const onConnectionDelete = jest.fn();
    render(
      <QueryClientProvider client={client}>
        <ConnectionForm
          connectionType={connectionType}
          formValue={{ ...formInitialValue, id: "123" }}
          onConnectionDelete={onConnectionDelete}
        />
      </QueryClientProvider>
    );
    expect(
      screen.getByRole("button", {
        name: /Test Connection/i
      })
    ).toBeInTheDocument();
  });

  it("calls handleBack when the back button is clicked", () => {
    const handleBack = jest.fn();
    render(
      <QueryClientProvider client={client}>
        <ConnectionForm
          connectionType={connectionType}
          formValue={formInitialValue}
          handleBack={handleBack}
        />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText("Back"));
    expect(handleBack).toHaveBeenCalled();
  });
});
