import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "../pages/global.css";
import "./storybook.css";

const queryClient = new QueryClient();

// Initialize MSW
initialize();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },

  nextRouter: {
    Provider: RouterContext.Provider
  },
  loaders: [mswLoader]
};

const preview: Preview = {
  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, { parameters }) => {
      return (
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </MemoryRouter>
      );
    }
  ]
};

export default preview;
