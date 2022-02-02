import fs from "fs";

import { sendRequest } from "./api.js";
import { parseTitles } from "./title.js";

const generate = async (arg: string) => {
  if (arg === "title") {
    const names = (await sendRequest()).map(({ name }) => name);
    const { nouns, adjectives } = parseTitles(names);

    fs.mkdirSync("../../data", { recursive: true });
    fs.writeFileSync("../../data/nouns.csv", nouns.join(",\n"));
    fs.writeFileSync("../../data/adjectives.csv", adjectives.join(",\n"));
  }
};

const args = process.argv.slice(2);
generate(args[0]);
