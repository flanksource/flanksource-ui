import { Meta, StoryObj } from "@storybook/react";
import { http, HttpResponse } from "msw";
import { VersionInfo } from "./VersionInfo";

export default {
  title: "VersionInfo",
  component: VersionInfo,
  decorators: [
    (Story) => (
      <div className="m-4 w-64 rounded-md border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 px-4 py-2 text-sm text-gray-700">
          Use New UI
        </div>
        <Story />
        <div className="px-4 py-2 text-sm text-gray-700">Sign out</div>
      </div>
    )
  ],
  parameters: {
    msw: {
      handlers: [
        http.get("*/about", () =>
          HttpResponse.json({
            appVersion: "v0.0.1500",
            commit: "e88d5dff4bf551e3e0de29fa94dfdf24634427e3",
            buildDate: "2026-10-13T10:02:16Z",
            chartVersion: "0.1.340-beta.24"
          })
        )
      ]
    }
  }
} satisfies Meta<typeof VersionInfo>;

export const Default: StoryObj<typeof VersionInfo> = {};
