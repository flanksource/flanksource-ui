import { CgSmileSad } from "react-icons/cg";
import { BannerMessage } from "./index";

export default {
  title: "BannerMessage",
  component: BannerMessage
};

const Template = (arg) => <BannerMessage {...arg} />;

export const Variant1 = Template.bind({});
Variant1.args = {
  title: "title",
  subtitle: "subtitle",
  prepend: (
    <div className="mb-4">
      <CgSmileSad className="h-24 w-24 text-indigo-600" />
    </div>
  ),
  append: (
    <button
      className="mt-4 font-semibold text-gray-50 bg-indigo-600 rounded-md py-2 px-4"
      type="button"
    >
      Refetch checks
    </button>
  )
};
