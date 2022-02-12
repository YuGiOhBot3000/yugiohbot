import { randomInt, randomElement } from "@yugiohbot/utils";

type TitleParts = {
  nouns: string[];
  adjectives: string[];
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
