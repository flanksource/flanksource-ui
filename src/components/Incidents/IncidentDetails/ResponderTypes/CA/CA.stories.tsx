import { useForm } from "react-hook-form";
import { AddResponderFormValues } from "../../AddResponders/AddResponder";
import { CA } from "./index";
import { StoryFn } from "@storybook/react";

export default {
  title: "CA",
  component: CA
};

const FormContainer = () => {
  const {
    control,
    formState: { errors },
    getValues,
    reset,
    setValue,
    handleSubmit
  } = useForm<AddResponderFormValues>({
    defaultValues: {
      to: "",
      subject: "",
      body: "",
      category: "",
      description: "",
      project: "",
      issueType: "",
      summary: "",
      product: "",
      person: ""
    }
  });
  const onSubmit = () => {
    handleSubmit(
      () => {
        console.log(getValues());
      },
      () => {}
    )();
  };
  return (
    <div className="flex flex-col">
      <CA control={control} errors={errors} setValue={setValue} />
      <div className="flex flex-row">
        <button className="btn-secondary m-2 p-2" onClick={(e) => reset()}>
          reset
        </button>
        <button className="btn-primary m-2 p-2" onClick={onSubmit}>
          submit
        </button>
      </div>
    </div>
  );
};

const Template: StoryFn = (arg) => <FormContainer {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {};
