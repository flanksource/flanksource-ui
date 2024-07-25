import "tailwindcss/tailwind.css";
import "../pages/global.css";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { initialize, mswLoader } from "msw-storybook-addon";
import "./storybook.css";

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
