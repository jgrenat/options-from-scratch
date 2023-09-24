export type Some<T> = {
  readonly _tag: "Some";
  value: T;
};
export type None = {
  readonly _tag: "None";
};
export const none: None = {
  _tag: "None",
};
export type Option<T> = Some<T> | None;

export const some = <T>(value: T): Some<T> => ({
  _tag: "Some",
  value,
});

export const O = {
  isSome: <T>(o: Option<T>): o is Some<T> => o._tag === "Some",
  getOrElse:
    <T>(fn: () => T) =>
    (o: Option<T>): T => {
      throw new Error("Not implemented");
    },
  fromNullable: <T>(value: T): Option<NonNullable<T>> => {
    throw new Error("Not implemented");
  },
  fromPredicate:
    <T>(predicate: (value: T) => boolean) =>
    (value: T): Option<T> => {
      throw new Error("Not implemented");
    },
  match:
    <T, S>(onNone: () => S, onSome: (value: T) => S) =>
    (o: Option<T>): S => {
      throw new Error("Not implemented");
    },
  map:
    <T, S>(fn: (value: T) => S) =>
    (o: Option<T>): Option<S> => {
      throw new Error("Not implemented");
    },
  filter:
    <T>(predicate: (value: T) => boolean) =>
    (o: Option<T>): Option<T> => {
      throw new Error("Not implemented");
    },
  filterMap:
    <T, S>(fn: (value: T) => Option<S>) =>
    (o: Option<T>): Option<S> => {
      throw new Error("Not implemented");
    },
};

export const A = {
  map:
    <T, S>(fn: (item: T) => S) =>
    (d: T[]) =>
      d.map(fn),
  reduce:
    <T, S>(init: S, fn: (acc: S, value: T) => S) =>
    (array: Array<T>) =>
      array.reduce(fn, init),
  findFirst:
    <T>(predicate: (value: T) => boolean) =>
    (array: Array<T>): Option<T> => {
      throw new Error("Not implemented");
    },
  compact: <T>(array: Array<Option<T>>): Array<T> => {
    throw new Error("Not implemented");
  },
};

export const R = {
  toArray: <K extends string, T>(record: Record<K, T>) =>
    Object.keys(record)
      .sort()
      .map((k) => [k, record[k]]),
};
