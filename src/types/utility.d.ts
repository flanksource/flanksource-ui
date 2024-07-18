export type $ElementProps<T> =
  T extends React.ComponentType<infer Props>
    ? Props extends object
      ? Props
      : never
    : never;

export type $ArrayElemType<T> = T extends readonly (infer E)[] ? E : never;

export type $ArrayPick<
  T extends readonly any[],
  idx extends [any],
  Acc = never
> = T extends readonly [infer head, ...infer tail]
  ? idx[0] extends keyof head
    ? ArrayPick<tail, idx, Acc | Pick<head, idx[0]>>
    : `Err: Is not key of head?: ${idx & string}`
  : Acc;
