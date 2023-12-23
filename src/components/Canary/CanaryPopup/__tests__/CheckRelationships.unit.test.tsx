import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CheckRelationships from "../CheckRelationships";

describe("CheckRelationships", () => {
  const mockCheck = {
    components: [
      { components: { name: "Component 1", id: "1", icon: "icon1" } },
      { components: { name: "Component 2", id: "2", icon: "icon2" } }
    ],
    configs: [
      { configs: { name: "Config 1", id: "3", type: "type1" } },
      { configs: { name: "Config 2", id: "4", type: "type2" } }
    ]
  };

  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <CheckRelationships check={mockCheck} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("cell", {
        name: "Component 1"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: /Component 2/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /Config 1/i })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: /Config 2/i })).toBeInTheDocument();
  });
});
