import fs from "fs";

import { sendRequest } from "./api";
import { parseTitles } from "./title";
import { createFineTune, generateDescriptions } from "./gpt3";

const MONSTERS = ["normal", "pendulum normal", "spirit", "toon", "tuner"];

const EFFECT_MONSTERS = [
  "effect",
  "flip effect",
  "pendulum effect",
  "ritual effect",
  "union effect",
];

const CARDS = ["skill", "spell", "trap"];

const generate = async (arg: string) => {
  if (arg === "title") {
    const names = (await sendRequest()).map(({ name }) => name);
    const { nouns, adjectives } = parseTitles(names);

    fs.mkdirSync("../../data", { recursive: true });
    fs.writeFileSync("../../data/nouns.csv", nouns.join(",\n"));
    fs.writeFileSync("../../data/adjectives.csv", adjectives.join(",\n"));
  } else if (arg === "gpt3") {
    await Promise.all([
      generateDescriptions(MONSTERS, "monster", "monsters"),
      generateDescriptions(EFFECT_MONSTERS, "monster", "effects"),
      generateDescriptions(CARDS, "card", "cards"),
    ]);

    await Promise.all([
      createFineTune("monsters"),
      createFineTune("effects"),
      createFineTune("cards"),
    ]);
  }
};

const args = process.argv.slice(2);
generate(args[0]);
