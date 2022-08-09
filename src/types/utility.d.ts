export type $ElementProps<T> = T extends React.ComponentType<infer Props>
  ? Props extends object
    ? Props
    : never
  : never;

export type $ArrElemType<T> = T extends readonly (infer E)[] ? E : never;
