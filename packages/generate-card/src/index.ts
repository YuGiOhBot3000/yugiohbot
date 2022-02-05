import { Handler } from "aws-lambda";
import { createCanvas, registerFont } from "canvas";

import { applyAttribute } from "./attribute";
import { applyBorder } from "./border";
import { applyCardName } from "./cardName";
import { CARD_WIDTH, CARD_HEIGHT } from "./constants";
import { applyImage } from "./image";
import { applyLevel } from "./level";
import { applyType } from "./type";
import { Event } from "./types";

export const handler: Handler<Event> = async (event) => {
  registerFont("assets/fonts/MatrixRegularSmallCaps.ttf", {
    family: "Matrix Regular Small Caps",
  });
  registerFont("assets/fonts/Heebo.ttf", { family: "Heebo" });
  registerFont("assets/fonts/SpectralSC-Regular.ttf", {
    family: "Spectral SC",
    weight: "regular",
  });
  registerFont("assets/fonts/SpectralSC-Bold.ttf", {
    family: "Spectral SC",
    weight: "bold",
  });
  registerFont("assets/fonts/SpectralSC-ExtraBold.ttf", {
    family: "Spectral SC",
    weight: "800",
  });

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

  await applyLevel({
    context,
    level: event.level,
    layout: event.layout,
  });

  await applyType({
    context,
    layout: event.layout,
    text: event.type,
    icon: event.icon,
  });

  return canvas.toBuffer();
};
