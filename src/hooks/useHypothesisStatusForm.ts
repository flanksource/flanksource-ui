import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { MutationFunction } from "@tanstack/react-query";
import { Hypothesis, HypothesisStatus } from "../api/services/hypothesis";

interface Props {
  id: string;
  status: HypothesisStatus;
  updateMutation: {
    mutate: MutationFunction<
      Hypothesis,
      { id: string; params: { status: HypothesisStatus } }
    >;
  };
}

export default function useHypothesisStatusForm({
  status,
  updateMutation,
  id
}: Props) {
  const { control, watch, getValues } = useForm({
    defaultValues: { status }
  });

  watch();

  const handleApiUpdate = useMemo(
    () =>
      debounce(({ status }) => {
        if (updateMutation && id) {
          updateMutation.mutate({ id, params: { status } });
        }
      }, 200),
    [updateMutation, id]
  );

  useEffect(() => {
    const subscription = watch(handleApiUpdate);
    return () => subscription.unsubscribe();
  }, [watch, handleApiUpdate]);

  return { control, watch, getValues };
}
