import { Form, Formik } from "formik";
import FormikMillicoresTextField from "./FormikMillicoresTextField";

export default {
  title: "FormikMillicoresTextField",
  component: FormikMillicoresTextField,
  decorators: [
    (Story: React.FC) => (
      <Formik
        initialValues={{
          millicores: undefined
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

export const Default = () => <FormikMillicoresTextField name="millicores" />;

export const WithLabel = () => (
  <FormikMillicoresTextField name="millicores" label="Millicores" />
);
