import "!style-loader!css-loader!postcss-loader!tailwindcss/tailwind.css";
import "tailwindcss/tailwind.css";
import "../pages/global.css";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { initialize, mswLoader } from "msw-storybook-addon";

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
