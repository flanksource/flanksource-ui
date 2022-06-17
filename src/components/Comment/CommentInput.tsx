import React from "react";
import { Mention, MentionsInput } from "react-mentions";
import { Icon } from "../Icon";

const mentionsStyle = {
  control: {
    fontSize: 14
  },

  "&multiLine": {
    control: {
      minHeight: 80
    },
    highlighter: {
      padding: 9,
      paddingTop: 11
    },
    input: {
      padding: 9,
      borderRadius: "0.375rem",
      borderColor: "rgb(229 231 235)"
    }
  },

  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 14
    },
    item: {
      padding: 5,
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#cee4e5"
      }
    }
  }
};

const Suggestion = ({ display, icon }) => (
  <div className="flex items-center">
    {icon && <Icon name={icon} size="xl" />}
    <p className="pl-2">{display}</p>
  </div>
);

interface Props {
  data: { display: string; id: string }[];
  value: string;
  trigger?: string;
  markup?: string;
  onChange: (text: string) => void;
}

export const MENTION_MARKUP = "@[__display__](user:__id__)";
export const MENTION_TRIGGER = "@";

export const CommentInput = ({
  data,
  value,
  onChange,
  markup = MENTION_MARKUP,
  trigger = MENTION_TRIGGER
}: Props) => (
  <MentionsInput
    value={value}
    onChange={(e) => onChange(e.target.value)}
    a11ySuggestionsListLabel="Suggested mentions"
    style={mentionsStyle}
    allowSpaceInQuery
    allowSuggestionsAboveCursor
  >
    <Mention
      markup={markup}
      trigger={trigger}
      data={data}
      renderSuggestion={Suggestion}
      className="bg-blue-200 rounded"
    />
  </MentionsInput>
);
