import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

import { sendRequest } from "./api";

export const generateDescriptions = async (
  types: string[],
  suffix: "monster" | "card",
  filename: string
) => {
  const cards = await Promise.all(
    types.map((type) => {
      const params = {
        type: `${type} ${suffix}`,
        startdate: "08/07/2011",
        enddate: "01/01/2022",
        dataregion: "tcg_date",
      };
      return sendRequest(params);
    })
  );

  const stream = fs.createWriteStream(`../../data/${filename}.jsonl`);

  types.forEach((type, i) =>
    cards[i].forEach(({ desc }) =>
      stream.write(
        `{"prompt":"${type} ->","completion":" ${desc
          .replace(/\\/gm, "\\\\")
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/"/gm, "'")}\\n"}\n`
      )
    )
  );

  stream.end();
};

export const createFineTune = async (uploadFilename: string) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const {
    data: { filename },
  } = await openai.createFile(
    fs.createReadStream(`../../data/${uploadFilename}.jsonl`),
    "fine-tune"
  );

  return openai.createFineTune({
    training_file: filename,
    model: "ada",
  });
};
