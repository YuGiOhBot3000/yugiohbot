import { Handler } from "aws-lambda";
import { createCanvas } from "canvas";

import { applyAttribute } from "./attribute";
import { applyBorder } from "./border";
import { applyCopyright, applyId, applySerial } from "./cardInfo";
import { applyCardName } from "./cardName";
import { CARD_WIDTH, CARD_HEIGHT } from "./constants";
import { applyEffect } from "./effect";
import { registerFonts } from "./fonts";
import { applyImage } from "./image";
import { applyLevel } from "./level";
import { applyPendulum } from "./pendulum";
import { applyAtk, applyDef } from "./stats";
import { applyType } from "./type";
import { Event } from "./types";

export const handler: Handler<Event> = async (event) => {
  registerFonts();

  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const context = canvas.getContext("2d");

  await applyImage({
    context,
    filename: event.image,
    pendulum: event.pendulum.enabled,
    rarity: event.rarity,
  });

  await applyBorder({
    context,
    layout: event.layout,
    pendulum: event.pendulum.enabled,
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

  applyPendulum({
    context,
    layout: event.layout,
    pendulum: event.pendulum,
  });

  await applyType({
    context,
    layout: event.layout,
    text: event.type,
    icon: event.icon,
  });

  applyEffect({
    context,
    layout: event.layout,
    text: event.effect,
  });

  applyAtk({ context, layout: event.layout, value: event.atk });

  applyDef({ context, layout: event.layout, value: event.def });

  applySerial({
    context,
    layout: event.layout,
    pendulum: event.pendulum.enabled,
    value: event.serial,
  });

  applyId({
    context,
    layout: event.layout,
    pendulum: event.pendulum.enabled,
    value: event.id,
  });

  applyCopyright({
    context,
    layout: event.layout,
    pendulum: event.pendulum.enabled,
    value: event.copyright,
  });

  return canvas.toBuffer();
};
