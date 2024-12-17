import { expect, test } from "vitest";

import { calculateRank, calculateRating } from "./findRating.js";

test("Calculate Rank", () => {
  const testCases: [number, string][] = [
    [1009000, "SSS+"],
    [1007500, "SSS"],
    [1005000, "SS+"],
    [1000000, "SS"],
    [990000, "S+"],
    [975000, "S"],
    [950000, "AAA"],
    [925000, "AA"],
    [900000, "A"],
    [800000, "BBB"],
    [700000, "BB"],
    [600000, "B"],
    [500000, "C"],
    [499999, "D"],
    [989997, "S"],
    [999999, "S+"],
    [1004997, "SS"],
    [1007002, "SS+"],
  ];

  testCases.forEach((tc) => expect(calculateRank(tc[0])).toBe(tc[1]));
});

test("Calculate Rating", () => {
  const testCases: [number, number, number][] = [
    [1009000, 15, 17.15],
    [1007500, 15, 17],
    [1005000, 15, 16.5],
    [1000000, 15, 16],
    [990000, 15, 15.6],
    [975000, 15, 15],
    [950000, 15, 13.5],
    [925000, 15, 12],
    [900000, 15, 10],
    [800000, 15, 5],
    [700000, 15, 3.33],
    [600000, 15, 1.66],
    [500000, 15, 0],
    [200000, 15, 0],
    [950000, 1, 0],
  ];

  testCases.forEach((tc) => expect(calculateRating(tc[0], tc[1])).toBe(tc[2]));
});
