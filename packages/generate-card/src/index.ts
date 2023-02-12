import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Card } from "@yugiohbot/types";
import { Handler } from "aws-lambda";
import { createCanvas } from "canvas";
import { nanoid } from "nanoid";

import { applyAttribute } from "./attribute";
import { applyBorder } from "./border";
import { applyCopyright, applyId, applySerial } from "./cardInfo";
import { applyCardName } from "./cardName";
import { CARD_WIDTH, CARD_HEIGHT } from "./constants";
import { applyEffect } from "./effect";
import { registerFonts } from "./fonts";
import { applyImage } from "./image";
import { applyLevel } from "./level";
import { applyLink, applyLinkMarkers } from "./link";
import { applyPendulum } from "./pendulum";
import { applyAtk, applyDef } from "./stats";
import { applyType } from "./type";

export const handler: Handler<Card> = async (event) => {
  registerFonts();

  const canvas = createCanvas(CARD_WIDTH, CARD_HEIGHT);
  const context = canvas.getContext("2d");

  const {
    atk,
    attribute,
    copyright,
    def,
    effect,
    icon,
    id,
    image,
    layout,
    level,
    link,
    name,
    pendulum,
    rarity,
    serial,
    type,
  } = event;

  await applyImage({
    context,
    filename: image,
    pendulum: pendulum.enabled,
    rarity,
    layout,
  });

  await applyBorder({
    context,
    layout,
    pendulum: pendulum.enabled,
  });

  applyCardName({
    context,
    name,
    layout,
    rarity,
  });

  await applyAttribute({
    context,
    attribute,
    layout,
  });

  await applyLevel({
    context,
    level,
    layout,
  });

  await applyLinkMarkers({
    context,
    layout,
    pendulum: pendulum.enabled,
    link,
  });

  applyPendulum({
    context,
    layout,
    pendulum,
  });

  await applyType({
    context,
    layout,
    text: type,
    icon,
  });

  applyEffect({
    context,
    layout,
    text: effect,
  });

  applyAtk({ context, layout, value: atk });
  applyDef({ context, layout, value: def });
  applyLink({ context, layout, value: def });

  applySerial({
    context,
    layout,
    pendulum: pendulum.enabled,
    value: serial,
  });

  applyId({
    context,
    layout,
    pendulum: pendulum.enabled,
    value: id,
  });

  applyCopyright({
    context,
    layout,
    pendulum: pendulum.enabled,
    value: copyright,
  });

  const client = new S3Client({
    region: process.env.AWS_REGION,
    forcePathStyle: true,
  });
  const Key = `${nanoid()}.png`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key,
    Body: canvas.toBuffer(),
    ContentEncoding: "base64",
    ContentType: "image/png",
  });
  await client.send(command);

  return Key;
};
