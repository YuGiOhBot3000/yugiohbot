import { Handler } from "aws-lambda";
import { createCanvas, registerFont } from "canvas";
import { applyAttribute } from "./attribute";
import { applyBorder } from "./border";
import { applyCardName } from "./cardName";
import { CARD_WIDTH, CARD_HEIGHT } from "./constants";
import { applyImage } from "./image";

import { Event, Layout } from "./types";

export const handler: Handler<Event> = async (event, _context, callback) => {
  registerFont("assets/fonts/MatrixRegularSmallCaps.ttf", {
    family: "Matrix Regular Small Caps",
  });
  registerFont("assets/fonts/Heebo.ttf", { family: "Heebo" });

  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const context = canvas.getContext("2d");

  await applyBorder({
    context,
    layout: event.layout,
    pendulum: event.pendulum.enabled,
  });

  await applyImage({
    context,
    filename: event.image,
    pendulum: event.pendulum.enabled,
    rarity: event.rarity,
  });

  applyCardName({
    context,
    name: event.name,
    layout: event.layout,
    rarity: event.rarity,
  });

  await applyAttribute({
    context,
    attribute: event.attribute,
    layout: event.layout,
  });

  return canvas.toBuffer();
};
