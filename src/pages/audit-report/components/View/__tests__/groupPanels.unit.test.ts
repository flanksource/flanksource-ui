import { PanelResult } from "../../../types";
import { groupPanels } from "../View";

describe("groupPanels", () => {
  const testCases: Array<{
    description: string;
    input: PanelResult[];
    expected: PanelResult[];
  }> = [
    {
      description:
        "three bargauge panels with same group - merges rows with individual configs",
      input: [
        {
          name: "mem1",
          type: "bargauge",
          rows: [{ label: "mem1", value: 30 }],
          bargauge: {
            min: 0,
            max: 100,
            group: "memory",
            format: "percentage",
            unit: " GB",
            thresholds: [{ percent: 80, color: "red" }]
          }
        },
        {
          name: "mem2",
          type: "bargauge",
          rows: [{ label: "mem2", value: 60 }],
          bargauge: {
            min: 0,
            max: 100,
            group: "memory",
            format: "multiplier",
            unit: " GB",
            thresholds: [{ percent: 90, color: "orange" }]
          }
        },
        {
          name: "mem3",
          type: "bargauge",
          rows: [{ label: "mem3", value: 90 }],
          bargauge: {
            min: 0,
            max: 100,
            group: "memory",
            unit: " GB"
          }
        }
      ],
      expected: [
        {
          name: "memory",
          type: "bargauge",
          rows: [
            {
              label: "mem1",
              value: 30,
              _bargauge: {
                min: 0,
                max: 100,
                group: "memory",
                format: "percentage",
                unit: " GB",
                thresholds: [{ percent: 80, color: "red" }]
              }
            },
            {
              label: "mem2",
              value: 60,
              _bargauge: {
                min: 0,
                max: 100,
                group: "memory",
                format: "multiplier",
                unit: " GB",
                thresholds: [{ percent: 90, color: "orange" }]
              }
            },
            {
              label: "mem3",
              value: 90,
              _bargauge: {
                min: 0,
                max: 100,
                group: "memory",
                unit: " GB"
              }
            }
          ],
          bargauge: {
            min: 0,
            max: 100,
            group: "memory",
            format: "percentage",
            unit: " GB",
            thresholds: [{ percent: 80, color: "red" }]
          }
        }
      ]
    },
    {
      description:
        "mixed panels - grouped bargauge panels and ungrouped panels remain in order",
      input: [
        {
          name: "number1",
          type: "number",
          rows: [{ value: 42 }]
        },
        {
          name: "disk1",
          type: "bargauge",
          rows: [{ label: "disk1", value: 50 }],
          bargauge: {
            min: 0,
            max: 100,
            group: "disk",
            unit: "GB"
          }
        },
        {
          name: "disk2",
          type: "bargauge",
          rows: [{ label: "disk2", value: 75 }],
          bargauge: {
            min: 0,
            max: 100,
            group: "disk",
            unit: "GB"
          }
        },
        {
          name: "table1",
          type: "table",
          rows: [{ col1: "data" }]
        }
      ],
      expected: [
        {
          name: "number1",
          type: "number",
          rows: [{ value: 42 }]
        },
        {
          name: "disk",
          type: "bargauge",
          rows: [
            {
              label: "disk1",
              value: 50,
              _bargauge: {
                min: 0,
                max: 100,
                group: "disk",
                unit: "GB"
              }
            },
            {
              label: "disk2",
              value: 75,
              _bargauge: {
                min: 0,
                max: 100,
                group: "disk",
                unit: "GB"
              }
            }
          ],
          bargauge: {
            min: 0,
            max: 100,
            group: "disk",
            unit: "GB"
          }
        },
        {
          name: "table1",
          type: "table",
          rows: [{ col1: "data" }]
        }
      ]
    }
  ];

  test.each(testCases)("$description", ({ input, expected }) => {
    const result = groupPanels(input);
    expect(result).toEqual(expected);
  });
});
