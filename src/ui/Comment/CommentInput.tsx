import { useMemo } from "react";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import { useGetPeopleQuery } from "../../api/query-hooks";
import { Icon } from "../Icons/Icon";

export const mentionsStyle = {
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

  "&singleLine": {
    display: "inline-block",
    width: "100%",

    highlighter: {
      padding: 1,
      border: "2px inset transparent"
    },
    input: {
      backgroundColor: "white",
      padding: 4,
      paddingLeft: 8,
      borderRadius: "0.375rem",
      borderColor: "rgb(229 231 235)",
      "--tw-shadow": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "--tw-shadow-colored": "0 1px 2px 0 var(--tw- shadow - color)",
      boxShadow:
        "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)"
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

export const Suggestion = ({
  display,
  avatar
}: SuggestionDataItem & { avatar?: string }) => (
  <div className="flex items-center">
    {avatar && <Icon name={avatar} />}
    <p className="pl-2">{display}</p>
  </div>
);

interface Props {
  value?: string;
  trigger?: string;
  markup?: string;
  onChange: (text: string) => void;
  onEnter: () => void;
  placeholder?: string;
  inputStyle?: Record<string, string | number>;
  className?: string;
  isSingleLine?: boolean;
}

export const MENTION_MARKUP = "@[__display__](user:__id__)";
export const MENTION_TRIGGER = "@";

export function CommentInput({
  value,
  onChange,
  onEnter,
  markup = MENTION_MARKUP,
  trigger = MENTION_TRIGGER,
  inputStyle = {},
  placeholder = "Comment",
  isSingleLine = false,
  className = ""
}: Props) {
  const { data: users } = useGetPeopleQuery({});
  const computedMentionsStyle = useMemo(() => {
    const styles = { ...mentionsStyle };
    styles["&multiLine"].input = {
      ...styles["&multiLine"].input,
      ...inputStyle
    };
    styles["&singleLine"].input = {
      ...styles["&singleLine"].input,
      ...inputStyle
    };
    return styles;
  }, [inputStyle]);

  return (
    <MentionsInput
      placeholder={placeholder}
      singleLine={isSingleLine}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          onEnter();
        }
      }}
      a11ySuggestionsListLabel="Suggested mentions"
      style={computedMentionsStyle}
      allowSpaceInQuery
      allowSuggestionsAboveCursor
      className={className}
    >
      <Mention
        markup={markup}
        trigger={trigger}
        data={
          users?.map((user) => ({
            id: user.id,
            display: user.name
          })) ?? []
        }
        renderSuggestion={Suggestion}
        className="bg-blue-200 rounded"
      />
    </MentionsInput>
  );
}
