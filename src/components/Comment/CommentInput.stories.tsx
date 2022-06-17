import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CommentInput } from "./index";

export default {
  title: "CommentInput",
  component: CommentInput,
  parameters: { actions: { argTypesRegex: "^on.*" } }
} as ComponentMeta<typeof CommentInput>;

const Template: ComponentStory<typeof CommentInput> = (arg: any) => {
  const [comment, setComment] = useState(arg.value);

  return (
    <CommentInput
      {...arg}
      value={comment}
      onChange={(value) => setComment(value)}
    />
  );
};

export const Variant1 = Template.bind({});

Variant1.args = {
  value:
    "Galileo di Vincenzo Bonaiuti de' Galilei (/ˌɡælɪˈleɪ.oʊ ˌɡælɪˈleɪ.iˌ/ GAL-ih-LAY-oh GAL-ih-LAY-ee, Italian: [ɡaliˈlɛːo ɡaliˈlɛi]; 15 February 1564 – 8 January 1642), commonly referred to as @[Galileo](user:galileo), was an Italian astronomer, physicist and engineer, sometimes described as a polymath, from the city of Pisa, then part of the Duchy of Florence. Galileo has been called the father of observational astronomy, modern physics, the scientific method, and modern science.",
  data: [
    {
      display: "Galileo",
      id: "galileo"
    },
    {
      display: "Issac Newton",
      id: "issac"
    }
  ]
};
