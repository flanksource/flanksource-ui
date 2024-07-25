import { CgSmileSad } from "react-icons/cg";
import { BannerMessage } from "./index";
import { ComponentStory } from "@storybook/react";

export default {
  title: "BannerMessage",
  component: BannerMessage
};

const Template: ComponentStory<typeof BannerMessage> = (arg) => (
  <BannerMessage {...arg} />
);

export const Variant1 = Template.bind({});
Variant1.args = {
  title: "title",
  subtitle: "subtitle",
  prepend: (
    <div className="mb-4">
      <CgSmileSad className="h-24 w-24 text-blue-600" />
    </div>
  ),
  append: (
    <button
      className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-semibold text-gray-50"
      type="button"
    >
      Refetch checks
    </button>
  )
};
