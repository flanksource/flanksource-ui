import {
  QueryClient,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";
import { uniqueId } from "lodash";
import { createIncidentQueryKey } from "..";
import { Comment, createComment, NewComment } from "../../services/comments";

const updatesHypothesisComments = (
  queryClient: QueryClient,
  comment: Comment,
  updateType: "add" | "remove"
) => {
  const queryKey = createIncidentQueryKey(comment.incident_id);
  const currentData: any = queryClient.getQueryData(queryKey);
  currentData.hypotheses.forEach((hypothesis: any) => {
    if (hypothesis.id === comment.hypothesis_id) {
      if (updateType === "add") {
        hypothesis.comments.push(comment);
      } else {
        let index = hypothesis.comments.findIndex(
          (item: Record<string, string>) => item.id === comment.id
        );
        hypothesis.comments.splice(index, 1);
      }
    }
  });
  queryClient.removeQueries(queryKey);
  queryClient.setQueryData(queryKey, { ...currentData });
};

export function useCreateCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ user, incidentId, hypothesisId, comment }: NewComment) => {
      const id = uniqueId();
      const payload: Comment = {
        id: id,
        created_by: user,
        incident_id: incidentId,
        hypothesis_id: hypothesisId,
        comment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      updatesHypothesisComments(queryClient, payload, "add");
      return createComment({ user, incidentId, hypothesisId, comment }).catch(
        (err) => {
          updatesHypothesisComments(queryClient, payload, "remove");
          return Promise.reject(err);
        }
      );
    }
  );
}
