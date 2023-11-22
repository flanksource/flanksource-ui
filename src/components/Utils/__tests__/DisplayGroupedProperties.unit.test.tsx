import { render, screen } from "@testing-library/react";
import { DisplayGroupedProperties } from "../DisplayGroupedProperties";
import { PropertyItem } from "../../Configs/Sidebar/Utils/formatConfigTags";

describe("DisplayGroupedProperties", () => {
  test("renders single properties correctly", () => {
    const items: PropertyItem[] = [
      {
        type: "SINGLE",
        label: "region/zone",
        rowKey: "region/zone",
        properties: [
          {
            label: "region",
            value: "us-west"
          }
        ]
      },
      {
        type: "SINGLE",
        label: "vpc/subnet",
        rowKey: "vpc/subnet",
        properties: [
          {
            label: "vpc",
            value: "vpc-123"
          }
        ]
      }
    ];

    render(<DisplayGroupedProperties items={items} />);

    const regionLabel = screen.getByText("region");
    expect(regionLabel).toBeInTheDocument();

    const regionValue = screen.getByText("us-west");
    expect(regionValue).toBeInTheDocument();

    const vpcLabel = screen.getByText("vpc");
    expect(vpcLabel).toBeInTheDocument();

    const vpcValue = screen.getByText("vpc-123");
    expect(vpcValue).toBeInTheDocument();
  });

  test("renders grouped properties correctly", () => {
    const items: PropertyItem[] = [
      {
        type: "GROUPED",
        label: "group1",
        groupName: "group1",
        properties: [
          {
            rowKey: "property1",
            rowProperties: [
              {
                label: "property1",
                value: "value1"
              }
            ]
          },
          {
            rowKey: "property2",
            rowProperties: [
              {
                label: "property2",
                value: "value2"
              }
            ]
          }
        ]
      },
      {
        type: "GROUPED",
        label: "group2",
        groupName: "group2",
        properties: [
          {
            rowKey: "property3",
            rowProperties: [
              {
                label: "property3",
                value: "value3"
              }
            ]
          }
        ]
      }
    ];

    render(<DisplayGroupedProperties items={items} />);

    const group1Label = screen.getByText("group1");
    expect(group1Label).toBeInTheDocument();

    const property1Label = screen.getByText("property1");
    expect(property1Label).toBeInTheDocument();

    const property1Value = screen.getByText("value1");
    expect(property1Value).toBeInTheDocument();

    const property2Label = screen.getByText("property2");
    expect(property2Label).toBeInTheDocument();

    const property2Value = screen.getByText("value2");
    expect(property2Value).toBeInTheDocument();

    const group2Label = screen.getByText("group2");
    expect(group2Label).toBeInTheDocument();

    const property3Label = screen.getByText("property3");
    expect(property3Label).toBeInTheDocument();

    const property3Value = screen.getByText("value3");
    expect(property3Value).toBeInTheDocument();
  });
});
