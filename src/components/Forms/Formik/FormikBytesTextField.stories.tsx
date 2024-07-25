import { Form, Formik } from "formik";
import FormikBytesTextField from "./FormikBytesTextField";

export default {
  title: "FormikBytesTextField",
  component: FormikBytesTextField,
  decorators: [
    (Story: React.FC) => (
      <Formik
        initialValues={{
          gb: undefined,
          mb: undefined,
          tb: undefined
        }}
        onSubmit={(values) => {
          console.log(values);
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
              <Story />

              <div className="flex flex-col space-x-4">
                <h4>Form Values</h4>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    )
  ]
};

export const Default = () => <FormikBytesTextField name="mb" />;

export const WithLabel = () => (
  <FormikBytesTextField name="mb" label="Millicores" />
);
