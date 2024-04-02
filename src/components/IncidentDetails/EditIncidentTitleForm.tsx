import { Form, Formik } from "formik";
import { Incident } from "../../api/types/incident";
import { EditableText } from "../EditableText";

type EditIncidentTitleFormProps = {
  incident: Pick<Incident, "title">;
  updateHandler: (incident: Partial<Incident>) => void;
  setIsEditing: (isEditing: boolean) => void;
};

export function EditIncidentTitleForm({
  incident,
  updateHandler,
  setIsEditing
}: EditIncidentTitleFormProps) {
  return (
    <Formik
      initialValues={{
        title: incident.title
      }}
      onSubmit={(values) => {
        setIsEditing(false);
        updateHandler(values);
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <EditableText
            value={values.title}
            sharedClassName="font-semibold text-gray-900"
            textAreaClassName="focus:outline-none border-none focus:border-none"
            onChange={(value: string) => {
              handleChange({
                target: {
                  name: "title",
                  value
                }
              });
              handleSubmit();
            }}
            isEditableAtStart
            disableEditOnBlur={false}
            onClose={() => setIsEditing(false)}
          />
        </Form>
      )}
    </Formik>
  );
}
