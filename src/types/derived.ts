import { definitions } from "./im-gen";

export interface Comment {}
export interface Hypothesis {}
export interface Incident {}
export interface Person {}
export interface Evidence {}

interface TypeMap {
  hypothesis: Hypothesis;
  incident: Incident;
  comment: Comment;
  person: Person;
  evidence: Evidence;
}

type Refs<T> = {
  [K in keyof T as T[K] extends ["id", string] | undefined ? K : never]: T[K];
};

type Keys<T> = keyof T;

type RefKeys<T> = Keys<Refs<T>>;

type WithRef<T, S extends keyof TypeMap> = Keys<{
  [K in keyof T as T[K] extends ["id", S] | undefined ? S : never]: TypeMap[S];
}>;

type MyRef<Target extends keyof TypeMap, All> = {
  [K in keyof All as Target extends WithRef<All[K], Target>
    ? K
    : never]: K extends keyof TypeMap ? TypeMap[K] : never;
};

type NRef<T> = {
  [K in keyof T as T[K] extends ["id", string] | undefined
    ? K extends `${infer L}_id`
      ? L
      : K extends `${infer J}_by`
      ? J
      : K
    : never]: T[K] extends ["id" | "by", infer R extends string] | undefined
    ? R extends keyof TypeMap
      ? TypeMap[R]
      : never
    : never;
};

export interface Hypothesis
  extends Omit<definitions["hypothesis"], RefKeys<definitions["hypothesis"]>>,
    MyRef<"hypothesis", definitions>,
    NRef<Refs<definitions["hypothesis"]>> {}

export interface Person
  extends Omit<definitions["person"], RefKeys<definitions["person"]>>,
    MyRef<"person", definitions>,
    NRef<Refs<definitions["person"]>> {}

export interface Incident
  extends Omit<definitions["incident"], RefKeys<definitions["incident"]>>,
    MyRef<"incident", definitions>,
    NRef<Refs<definitions["incident"]>> {}

export interface Evidence
  extends Omit<definitions["evidence"], RefKeys<definitions["evidence"]>>,
    MyRef<"evidence", definitions>,
    NRef<Refs<definitions["evidence"]>> {}

export interface Comment
  extends Omit<definitions["comment"], RefKeys<definitions["comment"]>>,
    MyRef<"comment", definitions>,
    NRef<Refs<definitions["comment"]>> {}

const i: Incident = {};

const h: Hypothesis = {};

// const v: Partial<Comm & NRef<Refs> = {
//   incident: {
//     c: ["strin"]
//   }
// };
