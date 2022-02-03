import { Handler } from "aws-lambda";
import {
  Configuration,
  CreateCompletionFromModelRequest,
  OpenAIApi,
} from "openai";
import { CARD_TYPES, EFFECT_MONSTERS, FINE_TUNES, MONSTERS } from "./constants";

/**
 * Selects a random element from the array
 * @param arr The array to select the element from
 * @returns The random element
 */
const randomElement = (arr: string[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const handler: Handler = async (_event, _context, callback) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const selectedCardType = randomElement(CARD_TYPES);

  const completionRequest: CreateCompletionFromModelRequest = {
    prompt: `${selectedCardType} ->`,
    stop: "\n",
    max_tokens: 100,
    temperature: 0.7,
    model: FINE_TUNES.CARDS,
  };

  let cardType = `${selectedCardType} card`;

  if (MONSTERS.includes(selectedCardType)) {
    completionRequest.model = FINE_TUNES.MONSTERS;
    cardType = `${selectedCardType} monster`;
  } else if (EFFECT_MONSTERS.includes(selectedCardType)) {
    completionRequest.model = FINE_TUNES.EFFECTS;
    cardType = `${selectedCardType} monster`;
  }

  const { data } = await openai.createCompletionFromModel(completionRequest);
  const text = data.choices?.[0].text;

  callback(null, { text, cardType });
};
