import { formatTopologyProperties } from "./../formatTopologyProperties";

describe("formatTopologyProperties", () => {
  test("returns an empty array when topology is null", () => {
    const result = formatTopologyProperties();
    expect(result).toEqual([]);
  });

  test("formats single properties correctly", () => {
    const mockTopology = {
      name: "Topology Name",
      properties: [
        { name: "region", namespace: "namespace1" },
        { name: "vpc" },
        { name: "os" }
      ]
    };

    const result = formatTopologyProperties(mockTopology);

    expect(result).toStrictEqual(
      expect.arrayContaining([
        {
          type: "SINGLE",
          label: "region/zone",
          rowKey: "region/zone",
          properties: [
            {
              label: "namespace1/region",
              value: expect.any(Object)
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
              value: expect.any(Object)
            }
          ]
        },
        {
          type: "SINGLE",
          label: "os/arch",
          rowKey: "os/arch",
          properties: [
            {
              label: "os",
              value: expect.any(Object)
            }
          ]
        }
      ])
    );
  });

  test("formats single item rows correctly", () => {
    const mockTopology = {
      name: "Topology Name",
      properties: [
        { name: "region" },
        { name: "zone" },
        { name: "os" },
        { name: "arch" }
      ]
    };

    const result = formatTopologyProperties(mockTopology);

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "label": "os/arch",
          "properties": [
            {
              "label": "arch",
              "value": <FormatProperty
                isSidebar={true}
                property={
                  {
                    "name": "arch",
                  }
                }
              />,
            },
            {
              "label": "os",
              "value": <FormatProperty
                isSidebar={true}
                property={
                  {
                    "name": "os",
                  }
                }
              />,
            },
          ],
          "rowKey": "os/arch",
          "type": "SINGLE",
        },
        {
          "label": "region/zone",
          "properties": [
            {
              "label": "region",
              "value": <FormatProperty
                isSidebar={true}
                property={
                  {
                    "name": "region",
                  }
                }
              />,
            },
            {
              "label": "zone",
              "value": <FormatProperty
                isSidebar={true}
                property={
                  {
                    "name": "zone",
                  }
                }
              />,
            },
          ],
          "rowKey": "region/zone",
          "type": "SINGLE",
        },
      ]
    `);
  });

  test("formats grouped properties correctly", () => {
    const topology = {
      name: "Topology Name",
      properties: [
        { name: "group1:property1", namespace: "namespace1" },
        { name: "group1:property2" },
        { name: "group2:property3" },
        { name: "grp3/property4" },
        { name: "grp3/property5" }
      ]
    };

    const result = formatTopologyProperties(topology);

    expect(result).toEqual([
      {
        type: "GROUPED",
        label: "group1",
        groupName: "group1",
        properties: [
          {
            rowKey: "property1",
            rowProperties: [
              {
                label: "namespace1/property1",
                value: expect.any(Object)
              }
            ]
          },
          {
            rowKey: "property2",
            rowProperties: [
              {
                label: "property2",
                value: expect.any(Object)
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
                value: expect.any(Object)
              }
            ]
          }
        ]
      },
      {
        type: "GROUPED",
        label: "grp3",
        groupName: "grp3",
        properties: [
          {
            rowKey: "property4",
            rowProperties: [
              {
                label: "property4",
                value: expect.any(Object)
              }
            ]
          },
          {
            rowKey: "property5",
            rowProperties: [
              {
                label: "property5",
                value: expect.any(Object)
              }
            ]
          }
        ]
      }
    ]);
  });
});
