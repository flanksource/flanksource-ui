import { Meta } from "@storybook/react";
import dayjs from "dayjs";
import Age from "./Age";

export default {
  component: Age,
  title: "Age"
} satisfies Meta;

export const Default = () => (
  <Age from={dayjs().subtract(1, "d").toISOString()} />
);

export const WithFromAndTwo = () => (
  <Age from={dayjs().toISOString()} to={dayjs().add(2, "h").toISOString()} />
);
