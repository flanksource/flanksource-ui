import { useForm } from "react-hook-form";
import { AddResponderFormValues } from "../../AddResponders/AddResponder";
import { Oracle } from "./index";

export default {
  title: "Oracle",
  component: Oracle
};

const FormContainer = () => {
  const {
    control,
    formState: { errors },
    getValues,
    reset,
    handleSubmit,
    setValue
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
      <Oracle control={control} errors={errors} setValue={setValue} />
      <div className="flex flex-row">
        <button className="btn-secondary p-2 m-2" onClick={(e) => reset()}>
          reset
        </button>
        <button className="btn-primary p-2 m-2" onClick={onSubmit}>
          submit
        </button>
      </div>
    </div>
  );
};

const Template = (arg) => <FormContainer {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {};
