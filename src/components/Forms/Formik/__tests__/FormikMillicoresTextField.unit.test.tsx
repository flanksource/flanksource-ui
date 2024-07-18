import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form, Formik } from "formik";
import FormikMillicoresTextField from "../FormikMillicoresTextField";

function TestForm({
  onSubmit,
  initialValues
}: {
  onSubmit: (values: any) => void;
  initialValues?: {
    millicores?: number;
  };
}) {
  return (
    <Formik
      initialValues={{
        ...initialValues
      }}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ handleSubmit, handleReset, values }) => (
        <Form
          onSubmit={(e) => {
            handleSubmit(e);
          }}
          onReset={handleReset}
          className="flex flex-1 flex-col space-y-4 overflow-y-auto"
        >
          <div className="flex h-full w-full flex-col gap-4 overflow-y-auto p-4">
            <FormikMillicoresTextField name="millicores" label="Millicores" />
            <button type="submit">Submit</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

test("it should have a default values", () => {
  const submit = jest.fn();
  const initialValues = {
    millicores: 100
  };
  render(<TestForm onSubmit={submit} initialValues={initialValues} />);
  expect(screen.getByLabelText("Millicores")).toHaveValue(100);
});

test("it should be empty if the initial value is null", () => {
  const submit = jest.fn();
  render(<TestForm onSubmit={submit} />);
  expect(screen.getByLabelText("Millicores")).toHaveValue(null);
});

test("it should submit the form with the correct values", async () => {
  const submit = jest.fn();
  render(<TestForm onSubmit={submit} />);
  const input = screen.getByLabelText("Millicores");
  const submitButton = screen.getByRole("button", { name: "Submit" });
  expect(input).toHaveValue(null);
  fireEvent.change(input, { target: { value: "100" } });
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(submit).toHaveBeenCalledWith({ millicores: "100m" });
  });
});
