import React, { useState } from "react";
import FormikModal from "./FormikModal";
import { ComponentStory } from "@storybook/react";
import { FormikCodeEditor } from "@flanksource-ui/components/Forms/Formik/FormikCodeEditor";
import FormikTextInput from "@flanksource-ui/components/Forms/Formik/FormikTextInput";

export default {
  title: "FormikModal",
  component: FormikModal
};

const Template: ComponentStory<React.FC> = (arg) => {
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
      <FormikModal
        open={isOpen}
        onClose={handleClose}
        onDelete={(values) => console.log("deleted", values)}
        onSave={(values) => console.log("saved", values)}
        onBack={() => console.log('backed')}

        {...arg}>
      </FormikModal>
    </>
  );
};

export const Variant1 = Template.bind({});
Variant1.args = {
  title: "Modal title",
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
