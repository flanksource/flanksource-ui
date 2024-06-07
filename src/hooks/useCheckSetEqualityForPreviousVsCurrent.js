import { usePrevious } from "./usePrevious";
import { areSetsEqual } from "../lib/areSetsEqual";

export function useCheckSetEqualityForPreviousVsCurrent(pivotSet) {
  const previousOrFirst = usePrevious(pivotSet);
  if (previousOrFirst == null) {
    return true;
  }
  return areSetsEqual(pivotSet, previousOrFirst) === false;
}
