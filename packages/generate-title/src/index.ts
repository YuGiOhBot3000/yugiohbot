import fs from "fs";
import { Handler } from "aws-lambda";

import { createTitle } from "./title";

const convertToArray = (filename: string) =>
  fs
    .readFileSync(filename)
    .toString()
    .split(",\n")
    .map((l) => l.trim());

export const handler: Handler = (_event, _context, callback) => {
  const nouns = convertToArray("nouns.csv");
  const adjectives = convertToArray("adjectives.csv");

  callback(null, createTitle({ nouns, adjectives }));
};
