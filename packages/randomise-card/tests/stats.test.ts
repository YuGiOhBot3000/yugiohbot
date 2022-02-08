import { chooseStats } from "../src/stats";

describe("Stats", () => {
  describe("chooseStats", () => {
    beforeEach(() => {
      jest.spyOn(Math, "random").mockReturnValue(0.999999);
    });

    it.each([
      { level: 0, expected: 0 },
      { level: 1, expected: 500 },
      { level: 2, expected: 1000 },
      { level: 3, expected: 1750 },
      { level: 4, expected: 2000 },
      { level: 5, expected: 2600 },
      { level: 6, expected: 2600 },
      { level: 7, expected: 3000 },
      { level: 8, expected: 3000 },
      { level: 9, expected: 4000 },
      { level: 10, expected: 4000 },
      { level: 11, expected: 5000 },
      { level: 12, expected: 5000 },
      { level: 13, expected: 0 },
    ])(
      "should return $expected for atk and def at level $level",
      ({ expected, level }) => {
        const { atk, def } = chooseStats(level);

        expect(atk).toBe(expected);
        expect(def).toBe(expected);
      }
    );
  });
});
