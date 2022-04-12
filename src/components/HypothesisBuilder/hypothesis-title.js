import React, { useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { EditableText } from "../EditableText";
import { Dropdown } from "../Dropdown";
import { hypothesisStatuses } from "./data";
import { AvatarGroup } from "../AvatarGroup";

const statusItems = {
  ...Object.values(hypothesisStatuses).reduce((acc, obj) => {
    const title = obj.title.toLowerCase();
    acc[title] = {
      id: `dropdown-${title}`,
      name: title,
      icon: React.createElement(obj.icon.type, {
        color: obj.color,
        style: { width: "20px" }
      }),
      description: obj.title,
      value: title
    };
    return acc;
  }, {})
};

export const HypothesisTitle = ({ node, api, comments }) => {
  const handleApiUpdate = useRef(
    debounce((params) => {
      if (api?.updateMutation && node?.id) {
        api.updateMutation.mutate({ id: node.id, params });
      }
    }, 1000)
  ).current;

  const { watch, control, setValue, getValues } = useForm({
    defaultValues: {
      title: node.title?.trim() ?? "",
      status: node.status || Object.values(statusItems)[2].value
    }
  });

  const users = useMemo(() => {
    const commentsUser = comments?.map(
      ({ created_by: commentUser }) => commentUser
    );
    const { created_by: nodeUser } = node;
    return [nodeUser, ...commentsUser];
  }, [node, comments]);

  watch();

  useEffect(() => {
    const subscription = watch((value) => {
      handleApiUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, handleApiUpdate]);

  return (
    <div className="flex w-full items-center pr-3">
      <Dropdown control={control} name="status" items={statusItems} />
      <div className="flex flex-1 px-3">
        <div className="w-full">
          <EditableText
            value={getValues("title")}
            sharedClassName="text-2xl font-semibold text-gray-900 grow"
            onChange={(value) => setValue("title", value)}
          />
        </div>
      </div>
      <AvatarGroup users={users} />
    </div>
  );
};

HypothesisTitle.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    created_by: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string
    })
  }).isRequired,
  api: PropTypes.shape({}).isRequired
};
