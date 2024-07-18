import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import React, { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

const queryClient = new QueryClient();

const ProvideTestProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
};

/**
 *
 * Custom render function that wraps the component with the required providers.
 * This is useful, as some providers are required for the components to work
 * correctly. This providers include Axios and Permissions providers and event
 * React Router providers.
 *
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: ProvideTestProviders, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
