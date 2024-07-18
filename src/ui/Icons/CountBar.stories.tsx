import { BsEmojiAngry, BsEmojiAstonished, BsEmojiKiss } from "react-icons/bs";
import { CountBar } from "./ChangeCount";

// CSF 3.0
export default { component: CountBar, title: "Icons/CountBar" };
export const Primary = {
  args: {
    items: [
      {
        count: 10,
        icon: <BsEmojiKiss />
      },
      {
        count: 20,
        icon: <BsEmojiAstonished />
      },
      {
        count: 30,
        icon: <BsEmojiAngry />
      }
    ]
  }
};

export const Dots = {
  args: {
    items: [
      {
        count: 1,
        icon: (
          <svg className={`h-4 fill-light-green`} viewBox="0 0 8 8">
            <circle cx={4} cy={4} r={3} />
          </svg>
        )
      },
      {
        count: 1,
        icon: (
          <svg className={`h-4 fill-red-400`} viewBox="0 0 8 8">
            <circle cx={4} cy={4} r={3} />
          </svg>
        )
      },
      {
        count: 1,
        icon: (
          <svg className={`h-4 fill-orange-400`} viewBox="0 0 8 8">
            <circle cx={4} cy={4} r={3} />
          </svg>
        )
      }
    ]
  }
};
