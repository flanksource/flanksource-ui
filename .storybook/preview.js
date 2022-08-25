import "!style-loader!css-loader!postcss-loader!tailwindcss/tailwind.css";
import "tailwindcss/tailwind.css";
import "../pages/global.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
