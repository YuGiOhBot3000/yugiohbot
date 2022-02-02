import { BrillPOSTagger, Lexicon, RuleSet } from "natural";

type TitleParts = {
  nouns: string[];
  adjectives: string[];
};

const LANGUAGE = "EN";
const DEFAULT_CATEGORY = "N";

/**
 * Generates a random integer between min and max inclusive
 * @param min Start of the range
 * @param max End of the range
 * @returns Random integer
 */
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomElement = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

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

export const createTitle = ({ nouns, adjectives }: TitleParts) => {
  if (!nouns.length && !adjectives.length) {
    console.warn("No title parts found, aborting");
    return "";
  }

  const title = [];
  const connectingWords = ["of", "of the", "the"];

  // 1. Decide number of sections the title will have
  const sections = randomInt(1, 2);

  // 2. Create a new title component for each section
  for (let i = 0; i < sections; i++) {
    // 3. Decide number of parts this component will have
    const components = randomInt(1, 2);

    // 4. Create the component (noun or adjective + noun)
    if (components === 1) {
      title.push(randomElement(nouns));
    } else {
      title.push(randomElement(adjectives), randomElement(nouns));
    }

    // 5. Add connecting words if it's not the last component
    if (i + 1 < sections) {
      title.push(randomElement(connectingWords));
    }
  }

  return title.join(" ");
};
