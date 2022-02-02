import { parseTitles } from "../src/title";

describe("Title", () => {
  const mockTitles = [
    "dark magician",
    "blue eyes white dragon",
    "pot of greed",
  ];

  describe("parseTitles", () => {
    it("should return lists of nouns and adjectives", () => {
      const { nouns, adjectives } = parseTitles(mockTitles);

      expect(nouns).toEqual(["magician", "eyes", "dragon", "pot"]);
      expect(adjectives).toEqual(["dark", "blue", "white"]);
    });
  });
});
