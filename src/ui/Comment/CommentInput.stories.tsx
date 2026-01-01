import { Meta, StoryFn } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { useState } from "react";

import { CommentInput } from "./index";

const defaultQueryClient = new QueryClient();

export default {
  title: "CommentInput",
  component: CommentInput,
  parameters: {
    actions: { argTypesRegex: "^on.*" },
    msw: {
      handlers: [
        http.get("/people", () => {
          return HttpResponse.json([
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
          ]);
        })
      ]
    }
  }
} as Meta<typeof CommentInput>;

const Template: StoryFn<typeof CommentInput> = (arg: any) => {
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

Variant1.parameters = {};
