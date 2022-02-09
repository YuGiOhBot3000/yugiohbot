import { createType } from "../src/type";

describe("Type", () => {
  describe("createType", () => {
    beforeEach(() => {
      jest.spyOn(Math, "random").mockReturnValue(0);
    });

    it.each([
      { base: "spell", expected: "Spell Card" },
      { base: "trap", expected: "Trap Card" },
      { base: "pendulum effect", expected: "Aqua / Pendulum / Effect" },
      { base: "normal", expected: "Aqua" },
    ])("should return $expected for a base of $base", ({ expected, base }) => {
      expect(createType(base)).toEqual(expected);
    });
  });
});
