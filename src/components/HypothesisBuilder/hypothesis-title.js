import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { Avatar } from "../Avatar";
import { EditableText } from "../EditableText";

export const HypothesisTitle = ({ node, api }) => {
  const handleApiUpdate = useRef(
    debounce((params) => {
      if (api?.updateMutation && node?.id) {
        api.updateMutation.mutate({ id: node.id, params });
      }
    }, 1000)
  ).current;

  const { watch, setValue, getValues } = useForm({
    defaultValues: {
      title: node.title?.trim() ?? ""
    }
  });

  watch();

  useEffect(() => {
    const subscription = watch((value) => {
      handleApiUpdate(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues, handleApiUpdate]);

  return (
    <>
      <div className="flex">
        <Avatar size="sm" user={node?.created_by} />
        <p className="font-inter text-dark-gray font-normal text-sm ml-1.5 mt-0.5">
          {node?.created_by?.name}
        </p>
      </div>
      <div className="mt-2 mr-2 mb-2 pr-8 flex flex-nowrap">
        <EditableText
          value={getValues("title")}
          sharedClassName="text-2xl font-semibold text-gray-900 grow"
          onChange={(value) => {
            setValue("title", value);
          }}
        />
      </div>
    </>
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
