
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
  value
});

export const O = {
  isSome: <T>(o: Option<T>): o is Some<T> => o._tag === 'Some',
  getOrElse: <T>(fn: () => T) => (o: Option<T>): T => O.isSome(o) ? o.value : fn(),
  fromNullable: <T>(value: T): Option<T> => (value === undefined || value === null) ? none : some(value),
  fromPredicate: <T>(predicate: (value: T) => boolean) => (value: T): Option<T> => predicate(value) ? some(value) : none,
  match: <T, S>(onNone: () => S, onSome: (value: T) => S) => (o: Option<T>): S => O.isSome(o) ? onSome(o.value) : onNone(),
  map: <T, S>(fn: (value: T) => S) => (o: Option<T>): Option<S> => O.isSome(o) ? some(fn(o.value)) : none,
  filter:  <T>(predicate: (value: T) => boolean) => (o: Option<T>): Option<T> => O.isSome(o) ? predicate(o.value) ? o : none : none,
  filterMap: <T, S>(fn: (value: T) => Option<S>) => (o: Option<T>): Option<S> => O.isSome(o) ? O.isSome(fn(o.value)) ? fn(o.value) : none : none,
};

export const A = {
  map: <T, S>(fn: (item: T) => S) => (d: T[]) => d.map(fn),
  reduce: <T, S>(init: S, fn: (acc: S, value: T) => S) => (array: Array<T>) => array.reduce(fn, init),
  findFirst: <T>(predicate: (value: T) => boolean) => (array: Array<T>): Option<T> => array.some(predicate) ? some(array.find(predicate) as T) : none,
  compact: <T>(array: Array<Option<T>>): Array<T> => array.filter(O.isSome).map((o: Some<T>) => o.value),
}

export const R = {
  toArray: <K extends string, T>(record: Record<K, T>) => Object.keys(record).sort().map(k => ([k, record[k]]))
}
