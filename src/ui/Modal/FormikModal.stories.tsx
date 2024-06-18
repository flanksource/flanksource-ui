import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";
import { StoryFn } from "@storybook/react";
import { useState } from "react";
import FormikModal from "./FormikModal";

export default {
  title: "FormikModal",
  component: FormikModal
};

const Template: StoryFn<typeof FormikModal> = (arg) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  return (
    <>
      <button
        className="btn-primary"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        show modal
      </button>
      <FormikModal {...arg} onClose={handleClose} open={isOpen}></FormikModal>
    </>
  );
};

export const Variant1 = Template.bind({});
Variant1.args = {
  title: "Modal title",
  formikFormProps: {
    onDelete: (values) => console.log("deleted", values),
    onSave: (values) => console.log("saved", values),
    onBack: () => console.log("backed"),
    showClose: true,
    showDelete: true,
    showSave: true
  },
  size: "medium",
  showExpand: true,
  children: (
    <>
      <FormikTextInput
        label="Namespace"
        name="namespace"
        placeholder="Namespace"
        defaultValue="default"
      />

      <FormikTextInput
        label="Namespace2"
        name="namespace2"
        placeholder="Namespace"
        defaultValue="default"
      />

      <FormikCodeEditor
        fieldName="chartValues"
        label="Values"
        lines={3}
        className="flex flex-col"
      />
    </>
  )
};
