import { formatConfigLabels } from "../formatConfigLabels";

describe("formatConfigTags", () => {
  test("returns an empty array when config tags are undefined", () => {
    const result = formatConfigLabels();
    expect(result).toEqual([]);
  });

  test("returns an empty array when config tags are empty", () => {
    const config = {
      labels: {}
    };
    const result = formatConfigLabels(config);
    expect(result).toEqual([]);
  });

  test("formats single properties correctly", () => {
    const config = {
      labels: {
        region: "us-west",
        vpc: "vpc-123",
        os: "linux",
        arch: "x86"
      }
    };
    const result = formatConfigLabels(config);
    expect(result).toStrictEqual(
      expect.arrayContaining([
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
        },
        {
          type: "SINGLE",
          label: "os/arch",
          rowKey: "os/arch",
          properties: [
            {
              label: "arch",
              value: "x86"
            },
            {
              label: "os",
              value: "linux"
            }
          ]
        }
      ])
    );
  });

  test("formats grouped properties correctly", () => {
    const config = {
      labels: {
        "group1:property1": "value1",
        "group1:property2": "value2",
        "group2:property3": "value3"
      }
    };
    const result = formatConfigLabels(config);
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
    ]);
  });

  test("ignores 'name' tag", () => {
    const config = {
      labels: {
        name: "My Config",
        region: "us-west"
      }
    };
    const result = formatConfigLabels(config);
    expect(result).toEqual([
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
      }
    ]);
  });
});
