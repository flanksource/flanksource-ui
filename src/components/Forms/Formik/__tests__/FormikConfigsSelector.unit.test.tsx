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

function renderSelector(
  initialValue?: string,
  options: {
    validate?: jest.Mock;
    externalValues?: { label: string; value?: string }[];
  } = {}
) {
  render(
    <Formik
      initialValues={{ params: { targets: initialValue } }}
      onSubmit={jest.fn()}
      validate={options.validate}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <FormikConfigsSelector name="params.targets" />
          <div data-testid="value">{values.params.targets ?? ""}</div>
          {options.externalValues?.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => setFieldValue("params.targets", value)}
            >
              {label}
            </button>
          ))}
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

const removeButton = (name: string) =>
  screen.getByRole("button", { name: `Remove ${name}` });

beforeEach(() => {
  jest.clearAllMocks();
  (searchApi.searchResources as jest.Mock).mockResolvedValue({
    configs: [grafana, prometheus]
  });
});

describe("FormikConfigsSelector", () => {
  it("does not rewrite the unchanged field value on mount", async () => {
    const validate = jest.fn(() => ({}));
    const initialValue = JSON.stringify({ id: grafana.id });

    renderSelector(initialValue, { validate });

    await waitFor(() => expect(removeButton("grafana")).toBeInTheDocument());
    expect(screen.getByTestId("value")).toHaveTextContent(initialValue, {
      normalizeWhitespace: false
    });
    expect(validate).not.toHaveBeenCalled();
  });

  it("synchronizes local state when the field value changes externally", async () => {
    const user = userEvent.setup();
    renderSelector(JSON.stringify({ search: "grafana" }), {
      externalValues: [
        {
          label: "Select prometheus externally",
          value: JSON.stringify({ id: prometheus.id })
        },
        {
          label: "Set query externally",
          value: JSON.stringify({ search: "kube" })
        }
      ]
    });

    await user.click(
      screen.getByRole("button", { name: "Select prometheus externally" })
    );
    await waitFor(() => expect(removeButton("prometheus")).toBeInTheDocument());
    expect(screen.getByRole("textbox")).toHaveValue("");

    await user.click(
      screen.getByRole("button", { name: "Set query externally" })
    );
    await waitFor(() =>
      expect(screen.getByRole("textbox")).toHaveValue("kube")
    );
    expect(
      screen.queryByRole("button", { name: "Remove prometheus" })
    ).not.toBeInTheDocument();
  });

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

  it("hydrates pre-selected items into chips without opening the results", async () => {
    renderSelector(JSON.stringify({ id: grafana.id }));

    await waitFor(() => expect(removeButton("grafana")).toBeInTheDocument());

    expect(searchApi.searchResources).toHaveBeenCalledWith(
      expect.objectContaining({
        configs: [expect.objectContaining({ search: `id=${grafana.id}` })]
      })
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("shows the results only while the field is focused", async () => {
    const user = userEvent.setup();
    renderSelector();

    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    await user.type(screen.getByRole("textbox"), "grafana");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    await user.click(document.body);

    await waitFor(() =>
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
    );
  });

  it("shows checked items as chips once the results are closed", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.type(screen.getByRole("textbox"), "grafana");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());
    await user.click(checkbox(/grafana/));

    // while open the list shows search results only, never the checked items
    expect(
      screen.queryByRole("button", { name: /Remove/ })
    ).not.toBeInTheDocument();

    await user.click(document.body);

    await waitFor(() => expect(removeButton("grafana")).toBeInTheDocument());
    await expectValue({ id: grafana.id });
  });

  it("stays open when a result row is clicked", async () => {
    const user = userEvent.setup();
    renderSelector();

    // a query that is not itself a result name, so the pinned "Use query" row
    // does not collide with the result row in the lookup below
    await user.type(screen.getByRole("textbox"), "kube");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    // clicking the row itself, not the checkbox: the row is not focusable, so a
    // naive blur handler would tear the list down before the click lands
    await user.click(screen.getByText("grafana"));

    expect(checkbox(/grafana/)).toBeChecked();
    expect(checkbox(/prometheus/)).toBeInTheDocument();
    await expectValue({ id: grafana.id });
  });

  it("checks and unchecks the highlighted item with the arrow keys and enter", async () => {
    const user = userEvent.setup();
    renderSelector();

    const input = screen.getByRole("textbox");
    await user.type(input, "kube");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    // first row is highlighted by default
    await user.keyboard("{Enter}");
    await expectValue({ id: grafana.id });

    await user.keyboard("{ArrowDown}{Enter}");
    await expectValue({ id: `${grafana.id},${prometheus.id}` });

    await user.keyboard("{ArrowUp}{Enter}");
    await expectValue({ id: prometheus.id });
  });

  it("offers the typed query as a pinned option that closes the results", async () => {
    const user = userEvent.setup();
    renderSelector();

    const input = screen.getByRole("textbox");
    await user.type(input, "type=Kubernetes::Deployment");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    await user.click(checkbox(/grafana/));

    const useQuery = screen.getByRole("button", { name: /Use query/ });
    await user.click(useQuery);

    // choosing the query drops the checked items and closes the results
    await waitFor(() =>
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
    );
    expect(
      screen.queryByRole("button", { name: /Remove/ })
    ).not.toBeInTheDocument();
    await expectValue({ search: "type=Kubernetes::Deployment" });
  });

  it("does not offer the query option when nothing has been typed", async () => {
    const user = userEvent.setup();
    renderSelector();

    await user.click(screen.getByRole("textbox"));
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    expect(
      screen.queryByRole("button", { name: /Use query/ })
    ).not.toBeInTheDocument();
  });

  it("clears the typed text on close when items are checked", async () => {
    const user = userEvent.setup();
    renderSelector();

    const input = screen.getByRole("textbox");
    await user.type(input, "kube");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());
    await user.click(checkbox(/grafana/));

    await user.click(document.body);

    await waitFor(() => expect(input).toHaveValue(""));
    await expectValue({ id: grafana.id });
  });

  it("clears the typed text on close when nothing was chosen", async () => {
    const user = userEvent.setup();
    renderSelector();

    const input = screen.getByRole("textbox");
    await user.type(input, "kube");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    await user.click(document.body);

    await waitFor(() => expect(input).toHaveValue(""));
    expect(screen.getByTestId("value")).toHaveTextContent("");
  });

  it("keeps the text on close once the query option was chosen", async () => {
    const user = userEvent.setup();
    renderSelector();

    const input = screen.getByRole("textbox");
    await user.type(input, "kube");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /Use query/ }));
    await user.click(document.body);

    expect(input).toHaveValue("kube");
    await expectValue({ search: "kube" });
  });

  it("drops a committed query once an item is checked", async () => {
    const user = userEvent.setup();
    renderSelector();

    const input = screen.getByRole("textbox");
    await user.type(input, "kube");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /Use query/ }));

    // reopen and check an item instead
    await user.click(input);
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());
    await user.click(checkbox(/grafana/));
    await user.click(document.body);

    await waitFor(() => expect(input).toHaveValue(""));
    await expectValue({ id: grafana.id });
  });

  it("swallows escape while the results are open so the modal stays up", async () => {
    const user = userEvent.setup();
    const onWindowEscape = jest.fn();
    window.addEventListener("keydown", onWindowEscape);
    renderSelector();

    const input = screen.getByRole("textbox");
    await user.type(input, "kube");
    await waitFor(() => expect(checkbox(/grafana/)).toBeInTheDocument());

    await user.keyboard("{Escape}");

    // the results closed, but the surrounding modal never saw the key
    await waitFor(() =>
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
    );
    expect(
      onWindowEscape.mock.calls.filter(([e]) => e.key === "Escape")
    ).toHaveLength(0);

    // with the results closed the modal gets its escape back
    await user.keyboard("{Escape}");
    expect(
      onWindowEscape.mock.calls.filter(([e]) => e.key === "Escape")
    ).toHaveLength(1);

    window.removeEventListener("keydown", onWindowEscape);
  });

  it("removes a chip when its remove button is clicked", async () => {
    const user = userEvent.setup();
    renderSelector(JSON.stringify({ id: grafana.id }));

    await waitFor(() => expect(removeButton("grafana")).toBeInTheDocument());

    await user.click(removeButton("grafana"));

    await waitFor(() =>
      expect(
        screen.queryByRole("button", { name: /Remove/ })
      ).not.toBeInTheDocument()
    );
  });
});
