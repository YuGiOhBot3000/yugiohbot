import { Handler } from "aws-lambda";
import {
  Attribute,
  Card,
  Icon,
  Layout,
  Link,
  Pendulum,
  Rarities,
} from "@yugiohbot/types";
import { randomBool, randomElement, randomInt } from "@yugiohbot/utils";
import { chooseStats } from "./stats";
import { createType } from "./type";
import { chooseCardImage } from "./image";
import { parseEffect } from "./effect";

type Event = {
  title: string;
  text: string;
  cardType: string;
};

type Response = {
  card: Card;
  imageName: string;
};

// Hack to make Canvas work on Lambda
if (process.env["LAMBDA_TASK_ROOT"]) {
  process.env["PATH"] =
    process.env["PATH"] + ":" + process.env["LAMBDA_TASK_ROOT"] + "/lib";
  process.env["LD_LIBRARY_PATH"] = process.env["LAMBDA_TASK_ROOT"] + "/lib";
  process.env["PKG_CONFIG_PATH"] = process.env["LAMBDA_TASK_ROOT"] + "/lib";
}

export const handler: Handler<Event, Response> = async ({
  title,
  text,
  cardType,
}) => {
  const level = randomInt(0, 12);
  const type = createType(cardType);
  const { atk, def } = chooseStats(level);
  const icon = randomElement<Icon>(Object.values(Icon));
  const serial = randomInt(0, 9999999999).toString(10).padStart(10, "0");
  const copyright = `© ${new Date().getFullYear()} Yu-Gi-Oh Bot`;
  const attribute = randomElement<Attribute>(Object.values(Attribute));
  const id = `YGOBOT${randomInt(0, 99).toString().padStart(2, "0")}`;

  const { pendulumEffect, cardEffect } = parseEffect(cardType, text);

  const pendulum: Pendulum = {
    enabled: randomBool(),
    // TODO: Generate pendulum effects too
    effect: pendulumEffect,
    blue: randomInt(0, 9),
    red: randomInt(0, 9),
  };

  const link: Link = {
    topLeft: randomBool(),
    topCenter: randomBool(),
    topRight: randomBool(),
    middleLeft: randomBool(),
    middleRight: randomBool(),
    bottomLeft: randomBool(),
    bottomCenter: randomBool(),
    bottomRight: randomBool(),
  };

  const layout = randomElement<Layout>(Object.values(Layout));
  const rarity = randomElement<Rarities>(Object.values(Rarities));

  const { url: image, name: imageName } = await chooseCardImage();

  const card: Card = {
    name: title,
    level,
    image,
    type,
    icon,
    effect: cardEffect,
    atk,
    def,
    serial,
    copyright,
    attribute,
    id,
    pendulum,
    link,
    layout,
    rarity,
  };

  return { card, imageName };
};
