import { BrillPOSTagger, Lexicon, RuleSet } from "natural";

type TitleParts = {
  nouns: string[];
  adjectives: string[];
};

const LANGUAGE = "EN";
const DEFAULT_CATEGORY = "N";

export const parseTitles = (titles: string[]): TitleParts => {
  const lexicon = new Lexicon(LANGUAGE, DEFAULT_CATEGORY);
  const ruleSet = new RuleSet(LANGUAGE);
  const tagger = new BrillPOSTagger(lexicon, ruleSet);

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
    { nouns: [], adjectives: [] } as TitleParts
  );

  return {
    nouns: [...new Set(titleParts.nouns)],
    adjectives: [...new Set(titleParts.adjectives)],
  };
};
