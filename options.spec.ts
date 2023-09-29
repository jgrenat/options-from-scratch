import { expect, test } from "vitest";
import { A, O, R, none, some } from "./options";
import { pipe } from "./pipe";

/**
 * A little bit of context: The billion dollar mistake
 *
 * https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/
 *
 * The goal of this kata is to build a simple option implementation, a functionnal alternative to undefined/null.
 *
 */

test("is some?", () => {
  const firstOption = some(36);
  const secondOption = none;

  if (O.isSome(firstOption)) {
    expect(firstOption.value).toEqual(36);
  }

  expect(O.isSome(secondOption)).toBe(false);
});

test("pipe helps compose functions", () => {
  const value = pipe(
    "Hello",
    (s) => s + " world!",
    (s) => s.toUpperCase()
  );
  expect(value).toEqual("HELLO WORLD!");
});

test.skip("get some", () => {
  const value = pipe(
    some(36),
    O.getOrElse(() => 0)
  );
  expect(value).toEqual(36);
});
test.skip("get some or get something else", () => {
  const value = pipe(
    none,
    O.getOrElse(() => 0)
  );
  expect(value).toEqual(0);
});

test.skip("option from nullable", () => {
  const firstValue = pipe(
    O.fromNullable(123),
    O.getOrElse(() => 0)
  );
  const secondValue = pipe(
    O.fromNullable(undefined),
    O.getOrElse(() => 0)
  );
  expect(firstValue).toEqual(123);
  expect(secondValue).toEqual(0);
});

test.skip("option from nullable with falsy values", () => {
  const value = pipe(
    O.fromNullable(0),
    O.getOrElse(() => -1)
  );
  expect(value).toEqual(0);
});

test.skip("option from predicate", () => {
  const isEven = (x: number) => x % 2 === 0;
  const fn = (x: number) =>
    pipe(
      x,
      O.fromPredicate(isEven),
      O.getOrElse(() => x - 1)
    );
  expect(fn(124)).toBe(124);
  expect(fn(125)).toBe(124);
});

test.skip("pattern matching", () => {
  const isEven = (x: number) => x % 2 === 0;
  const fn = (x: number) =>
    pipe(
      x,
      O.fromPredicate(isEven),
      O.match(
        () => "Not an even value",
        (value) => `Even value = ${value}`
      )
    );

  expect(fn(42)).toEqual("Even value = 42");
  expect(fn(43)).toEqual("Not an even value");
});

test.skip("map", () => {
  const isEven = (x: number) => x % 2 === 0;
  const fn = (x: number) =>
    pipe(
      x,
      O.fromPredicate(isEven),
      O.map((x) => `_${x}_`),
      O.match(
        () => "Not an even value",
        (value) => `Even value = ${value}`
      )
    );

  expect(fn(42)).toEqual("Even value = _42_");
  expect(fn(43)).toEqual("Not an even value");
});
test.skip("filter", () => {
  const isPositive = (x: number) => x >= 0;
  const isNotZero = (x: number) => x !== 0;
  const fn = (x: number) =>
    pipe(
      some(x),
      O.filter(isNotZero),
      O.map((x) => 1 - 1 / x),
      O.filter(isPositive),
      O.map(Math.sqrt),
      O.getOrElse(() => 0)
    );

  expect(fn(0.1)).toEqual(0);
  expect(fn(-0.1)).not.toEqual(0);
});

const map =
  <T, S>(fn: (item: T) => S) =>
  (d: T[]) =>
    d.map(fn);

test.skip("find in arrays returns an option", () => {
  const data = [1, 2, 3, 4, 5];
  const isEven = (x: number) => x % 2 === 0;
  const result = pipe(
    data,
    A.findFirst(isEven),
    O.match(
      () => "No even value in the array",
      (value) => `Even value found = ${value}`
    )
  );

  expect(result).toBe("Even value found = 2");
});

test.skip("find in arrays should work with null values", () => {
  const data = ["not null", "not null either", null];
  const isNull = (x: string | null) => x === null;
  const result = pipe(
    data,
    A.findFirst(isNull),
    O.match(
      () => "No null value in array",
      () => "Null value found"
    )
  );

  expect(result).toBe("Null value found");
});

test.skip("filter and map at once", () => {
  const isPositive = (x: number) => x > 0;

  const cutIntoEqualParts = (pieSize: number, parts: number) =>
    pipe(
      some(parts),
      O.filter(isPositive),
      O.filterMap((x) => (x === 0 ? none : some(pieSize / x))),
      O.getOrElse(() => 0)
    );

  expect(cutIntoEqualParts(10, 4)).toBe(2.5);
});

test.skip("compact an array of options removing'none' options and getting values of 'some' options", () => {
  const unitPrices = {
    lunch: 25,
    drinks: 15,
    wellness: 5,
  };
  const planning: Array<[string, number]> = [
    ["breakfast", 17],
    ["lunch", 17],
    ["wellness", 10],
    ["drinks", 21],
  ];

  const price = pipe(
    planning,
    A.map(([service, pax]) =>
      pipe(
        unitPrices,
        R.toArray,
        A.findFirst(([serviceName, _price]) => service === serviceName),
        O.map(([_serviceName, price]) => pax * price)
      )
    ),
    A.compact,
    A.reduce(0, (acc: number, price: number) => acc + price)
  );

  expect(price).toBe(790);
});
