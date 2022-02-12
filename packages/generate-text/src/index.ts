import { Handler } from "aws-lambda";
import {
  Configuration,
  CreateCompletionFromModelRequest,
  OpenAIApi,
} from "openai";
import { randomElement } from "@yugiohbot/utils";
import { CARD_TYPES, EFFECT_MONSTERS, FINE_TUNES, MONSTERS } from "./constants";

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
    temperature: 0.9,
    model: FINE_TUNES.CARDS,
  };

  if (MONSTERS.includes(selectedCardType)) {
    completionRequest.model = FINE_TUNES.MONSTERS;
  } else if (EFFECT_MONSTERS.includes(selectedCardType)) {
    completionRequest.model = FINE_TUNES.EFFECTS;
  }

  const { data } = await openai.createCompletionFromModel(completionRequest);
  const text = data.choices?.[0].text;

  callback(null, { text, cardType: selectedCardType });
};
