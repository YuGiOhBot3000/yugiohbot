import natural from "natural";

const LANGUAGE = "EN";
const DEFAULT_CATEGORY = "N";

export const parseTitles = (titles: string[]) => {
  const lexicon = new natural.Lexicon(LANGUAGE, DEFAULT_CATEGORY);
  const ruleSet = new natural.RuleSet(LANGUAGE);
  const tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

  const titleParts = titles.reduce(
    ({ nouns, adjectives }, current) => {
      const { taggedWords } = tagger.tag(current.split(" "));

      const newNouns = taggedWords
        .filter(({ tag }) => ["NNP", "NNS", "NN"].includes(tag))
        .map(({ token }) => token);
      const newAdjectives = taggedWords
        .filter(({ tag }) => tag === "JJ")
        .map(({ token }) => token);

      return {
        nouns: nouns.concat(newNouns),
        adjectives: adjectives.concat(newAdjectives),
      };
    },
    { nouns: [] as string[], adjectives: [] as string[] }
  );

  return {
    nouns: [...new Set(titleParts.nouns)],
    adjectives: [...new Set(titleParts.adjectives)],
  };
};
