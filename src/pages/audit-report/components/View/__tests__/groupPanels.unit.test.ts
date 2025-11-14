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
    }
  ];

  test.each(testCases)("$description", ({ input, expected }) => {
    const result = groupPanels(input);
    expect(result).toEqual(expected);
  });
});
