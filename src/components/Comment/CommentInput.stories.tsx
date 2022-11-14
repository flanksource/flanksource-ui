import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import withMock from "storybook-addon-mock";

import { CommentInput } from "./index";

const defaultQueryClient = new QueryClient();

export default {
  title: "CommentInput",
  component: CommentInput,
  parameters: { actions: { argTypesRegex: "^on.*" } },
  decorators: [withMock]
} as ComponentMeta<typeof CommentInput>;

const Template: ComponentStory<typeof CommentInput> = (arg: any) => {
  const [comment, setComment] = useState(arg.value);

  return (
    <QueryClientProvider client={defaultQueryClient}>
      <CommentInput
        {...arg}
        value={comment}
        onChange={(value) => setComment(value)}
      />
    </QueryClientProvider>
  );
};

export const Variant1 = Template.bind({});

Variant1.args = {
  value:
    "Galileo di Vincenzo Bonaiuti de' Galilei (/ˌɡælɪˈleɪ.oʊ ˌɡælɪˈleɪ.iˌ/ GAL-ih-LAY-oh GAL-ih-LAY-ee, Italian: [ɡaliˈlɛːo ɡaliˈlɛi]; 15 February 1564 – 8 January 1642), commonly referred to as @[Galileo](user:galileo), was an Italian astronomer, physicist and engineer, sometimes described as a polymath, from the city of Pisa, then part of the Duchy of Florence. Galileo has been called the father of observational astronomy, modern physics, the scientific method, and modern science."
};

Variant1.parameters = {
  mockData: [
    {
      url: "/db/person",
      method: "GET",
      status: 200,
      response: [
        {
          id: "einstein",
          name: "Albert Einstein",
          avatar: "https://i.pravatar.cc/150?u=einstein"
        },
        {
          id: "galileo",
          name: "Galileo Galilei",
          avatar: null
        },
        {
          id: "issac",
          name: "Issac Newton",
          avatar: "https://i.pravatar.cc/150?u=issac"
        }
      ]
    }
  ]
};
