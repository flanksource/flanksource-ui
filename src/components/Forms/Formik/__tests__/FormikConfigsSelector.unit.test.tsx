// Tests the configs playbook parameter picker: search query submission,
// checkbox selection of individual catalog items and selection persistence.
import { render, screen, waitFor } from "@flanksource-ui/test-utils";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";
import * as searchApi from "../../../../api/services/search";
import FormikConfigsSelector from "../FormikConfigsSelector";

jest.mock("../../../../api/services/search", () => ({
  ...jest.requireActual("../../../../api/services/search"),
  searchResources: jest.fn()
}));

const grafana = {
  id: "aaaaaaaa-0000-0000-0000-000000000001",
  name: "grafana",
  type: "Kubernetes::Deployment",
  namespace: "monitoring",
  agent: "local",
  labels: {}
};

const prometheus = {
  id: "bbbbbbbb-0000-0000-0000-000000000002",
  name: "prometheus",
  type: "Kubernetes::Deployment",
  namespace: "monitoring",
  agent: "local",
  labels: {}
};

function renderSelector(initialValue?: string) {
  render(
    <Formik
      initialValues={{ params: { targets: initialValue } }}
      onSubmit={jest.fn()}
    >
      {({ values }) => (
        <Form>
          <FormikConfigsSelector name="params.targets" />
          <div data-testid="value">{values.params.targets ?? ""}</div>
        </Form>
      )}
    </Formik>
  );
}

const expectValue = (value: unknown) =>
  waitFor(() =>
    expect(screen.getByTestId("value")).toHaveTextContent(
      JSON.stringify(value),
      { normalizeWhitespace: false }
    )
  );

const checkbox = (name: RegExp) => screen.getByRole("checkbox", { name });

beforeEach(() => {
  jest.clearAllMocks();
  (searchApi.searchResources as jest.Mock).mockResolvedValue({
    configs: [grafana, prometheus]
  });
});

describe("FormikConfigsSelector", () => {
  it("submits the raw search query when no items are checked", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.type(screen.getByRole("textbox"), "grafana");

    await expectValue({ search: "grafana" });
  });

  it("submits only the ids of the checked items", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.type(screen.getByRole("textbox"), "grafana");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    await user.click(checkbox(/grafana/));

    await expectValue({ id: grafana.id });
  });

  it("keeps checked items when the search query changes", async () => {
    const user = userEvent.setup();
    renderSelector();

    const input = screen.getByRole("textbox");
    await user.type(input, "grafana");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());
    await user.click(checkbox(/grafana/));

    await user.clear(input);
    await user.type(input, "prometheus");
    await waitFor(() => expect(checkbox(/prometheus/)).toBeInTheDocument());
    await user.click(checkbox(/prometheus/));

    await expectValue({ id: `${grafana.id},${prometheus.id}` });
  });

  it("falls back to the search query when the last item is unchecked", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.type(screen.getByRole("textbox"), "grafana");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    await user.click(checkbox(/grafana/));
    await expectValue({ id: grafana.id });

    await user.click(checkbox(/grafana/));
    await expectValue({ search: "grafana" });
  });

  it("hydrates checked items from an initial id value", async () => {
    renderSelector(JSON.stringify({ id: grafana.id }));

    await waitFor(() => expect(checkbox(/grafana/)).toBeChecked());

    expect(searchApi.searchResources).toHaveBeenCalledWith(
      expect.objectContaining({
        configs: [expect.objectContaining({ search: `id=${grafana.id}` })]
      })
    );
    expect(checkbox(/prometheus/)).not.toBeChecked();
  });
});
