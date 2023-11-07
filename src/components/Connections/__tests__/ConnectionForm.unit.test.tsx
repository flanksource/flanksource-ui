import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConnectionForm from "./../ConnectionForm";
import {
  ConnectionType,
  ConnectionValueType,
  connectionTypes
} from "../connectionTypes";

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
      <ConnectionForm
        connectionType={connectionType}
        formValue={formInitialValue}
        onConnectionSubmit={onConnectionSubmit}
      />
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
      <ConnectionForm
        connectionType={connectionType}
        formValue={{ ...formInitialValue, id: "123" }}
        onConnectionDelete={onConnectionDelete}
      />
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

  it("calls handleBack when the back button is clicked", () => {
    const handleBack = jest.fn();
    render(
      <ConnectionForm
        connectionType={connectionType}
        formValue={formInitialValue}
        handleBack={handleBack}
      />
    );
    fireEvent.click(screen.getByText("Back"));
    expect(handleBack).toHaveBeenCalled();
  });
});
