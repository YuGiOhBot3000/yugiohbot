import {
  randomInt,
  randomElement,
  randomBool,
  capitalizeFirstLetter,
} from "../src/utils";

describe("Utils", () => {
  beforeEach(() => {
    jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.999);
  });

  describe("randomInt", () => {
    it("should return a number between min and max", () => {
      expect(randomInt(5, 10)).toBe(5);
      expect(randomInt(5, 10)).toBe(10);
    });
  });

  describe("randomElement", () => {
    it("should return an element in the list", () => {
      expect(randomElement<string>(["one", "two", "three"])).toBe("one");
      expect(randomElement<string>(["one", "two", "three"])).toBe("three");
    });
  });

  describe("randomBool", () => {
    it("should return a random boolean", () => {
      expect(randomBool()).toBe(true);
      expect(randomBool()).toBe(false);
    });
  });

  describe("capitalizeFirstLetter", () => {
    it("should capitalize the first letter", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter("hELLO")).toBe("HELLO");
    });
  });
});
