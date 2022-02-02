import { createTitle, parseTitles } from "../src/title";

const warnSpy = jest.spyOn(console, "warn").mockImplementation(jest.fn());

describe("Title", () => {
  const mockTitles = [
    "dark magician",
    "blue eyes white dragon",
    "pot of greed",
    "dark magician 2",
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("parseTitles", () => {
    it("should return lists of nouns and adjectives", () => {
      const { nouns, adjectives } = parseTitles(mockTitles);

      expect(nouns).toEqual(["magician", "eyes", "dragon", "pot"]);
      expect(adjectives).toEqual(["dark", "blue", "white"]);
    });

    describe("given the titles list is empty", () => {
      it("should return empty lists of nouns and adjectives", () => {
        const { nouns, adjectives } = parseTitles([]);

        expect(nouns).toEqual([]);
        expect(adjectives).toEqual([]);
      });
    });
  });

  describe("createTitle", () => {
    describe("given the title has one part", () => {
      beforeEach(() => {
        jest
          .spyOn(Math, "random")
          .mockReturnValueOnce(0.25) // Return 1 for sections
          .mockReturnValueOnce(0.25) // Return 1 for first component
          .mockReturnValueOnce(0.25); // Return 1 for 2nd noun
      });

      it("should return a random title", () => {
        const nouns = ["magician", "eyes", "dragon", "pot"];
        const adjectives = ["dark", "blue", "white"];

        const result = createTitle({ nouns, adjectives });

        expect(result).toEqual("eyes");
      });
    });

    describe("given the title has two parts", () => {
      beforeEach(() => {
        jest
          .spyOn(Math, "random")
          .mockReturnValueOnce(0.5) // Return 2 for sections
          .mockReturnValueOnce(0.5) // Return 2 for first component
          .mockReturnValueOnce(1 / 3) // Return 1 for 2nd adjective
          .mockReturnValueOnce(0) // Return 0 for 1st noun
          .mockReturnValueOnce(0) // Return 0 for 1st connecting word
          .mockReturnValueOnce(0.25) // Return 1 for second component
          .mockReturnValueOnce(0.5); // Return 2 for 3rd noun
      });

      it("should return a random title with a connecting word", () => {
        const nouns = ["magician", "eyes", "dragon", "pot"];
        const adjectives = ["dark", "blue", "white"];

        const result = createTitle({ nouns, adjectives });

        expect(result).toEqual("blue magician of dragon");
      });
    });

    describe("given the nouns and adjectives lists are both empty", () => {
      it("should log a warning and return an empty string", () => {
        expect(createTitle({ nouns: [], adjectives: [] })).toEqual("");
        expect(warnSpy).toBeCalledTimes(1);
      });
    });
  });
});
