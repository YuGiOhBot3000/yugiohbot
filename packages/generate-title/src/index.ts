import fs from "fs";
import { createTitle } from "./title";

const convertToArray = (filename: string) =>
  fs
    .readFileSync(filename)
    .toString()
    .split(",\n")
    .map((l) => l.trim());

export const handler = () => {
  const nouns = convertToArray("nouns.csv");
  const adjectives = convertToArray("adjectives.csv");

  return createTitle({ nouns, adjectives });
};
