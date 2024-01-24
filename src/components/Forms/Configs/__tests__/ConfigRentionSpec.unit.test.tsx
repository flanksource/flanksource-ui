import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form, Formik } from "formik";
import ConfigRetentionSpec from "../ConfigRentionSpec";

const initialValues = {
  spec: {
    retention: {
      changes: [
        {
          name: "test",
          age: "1d",
          count: 2
        }
      ],
      type: [
        {
          name: "test",
          createdAge: "1d",
          deletedAge: "1d",
          updatedAge: "1d"
        }
      ]
    }
  }
};

type TestFormProps = {
  onSubmit: (values: any) => void;
  initialValues?: any;
};

function TestForm({ onSubmit, initialValues }: TestFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <ConfigRetentionSpec />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}

test("should render and submit the retention form", async () => {
  const submit = jest.fn();
  render(<TestForm onSubmit={submit} initialValues={initialValues} />);

  const nameInputs = screen.getAllByLabelText(/name/i);

  // should have 2 name inputs
  expect(nameInputs).toHaveLength(2);
  expect(nameInputs[0]).toHaveValue("test");
  expect(nameInputs[1]).toHaveValue("test");
  expect(screen.getByLabelText("Age")).toHaveValue("1d");
  expect(screen.getByLabelText(/count/i)).toHaveValue(2);
  expect(screen.getByLabelText(/Created Age/i)).toHaveValue("1d");
  expect(screen.getByLabelText(/Deleted Age/i)).toHaveValue("1d");
  expect(screen.getByLabelText(/Updated Age/i)).toHaveValue("1d");

  // submit the form
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  await waitFor(() => {
    expect(submit).toHaveBeenCalledWith(initialValues);
  });
});

test("should add a new retention change", async () => {
  const submit = jest.fn();
  render(<TestForm onSubmit={submit} initialValues={{}} />);

  // add a new retention change
  fireEvent.click(screen.getByTestId("add-retention-change"));

  await waitFor(() => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "test" }
  });

  fireEvent.change(screen.getByLabelText(/age/i), {
    target: { value: "1d" }
  });

  fireEvent.change(screen.getByLabelText(/count/i), {
    target: { value: 2 }
  });

  // submit the form
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  await waitFor(() => {
    expect(submit).toHaveBeenCalledWith({
      spec: {
        retention: {
          changes: [
            {
              name: "test",
              age: "1d",
              count: 2
            }
          ]
        }
      }
    });
  });
});

test("should add a new retention type", async () => {
  const submit = jest.fn();
  render(<TestForm onSubmit={submit} initialValues={{}} />);

  // add a new retention change
  fireEvent.click(screen.getByTestId("add-retention-type"));

  await waitFor(() => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: "test" }
  });

  fireEvent.change(screen.getByLabelText(/created age/i), {
    target: { value: "1d" }
  });

  fireEvent.change(screen.getByLabelText(/updated age/i), {
    target: { value: "1d" }
  });

  fireEvent.change(screen.getByLabelText(/deleted age/i), {
    target: { value: "1d" }
  });

  // submit the form
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  await waitFor(() => {
    expect(submit).toHaveBeenCalledWith({
      spec: {
        retention: {
          type: [
            {
              name: "test",
              createdAge: "1d",
              deletedAge: "1d",
              updatedAge: "1d"
            }
          ]
        }
      }
    });
  });
});
