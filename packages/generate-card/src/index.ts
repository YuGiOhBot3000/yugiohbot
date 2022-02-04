import { Handler } from "aws-lambda";
import { createCanvas } from "canvas";
import { applyBorder } from "./border";
import { CARD_WIDTH, CARD_HEIGHT } from "./constants";

import { Event } from "./types";

export const handler: Handler<Event> = async (event, _context, callback) => {
  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const context = canvas.getContext("2d");

  await applyBorder({
    context,
    layout: event.layout,
    pendulum: event.pendulum.enabled,
  });

  return canvas.toBuffer();
};
