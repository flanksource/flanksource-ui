import { initialize, mswLoader } from "msw-storybook-addon";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import "tailwindcss/tailwind.css";
import "../pages/global.css";
import "./storybook.css";

// Initialize MSW
initialize();

export const parameters = {
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
export const tags = ["autodocs"];
