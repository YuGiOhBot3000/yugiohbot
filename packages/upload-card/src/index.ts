import type { Handler } from "aws-lambda";
import type { Readable } from "stream";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { Card } from "@yugiohbot/types";

import { createCaption } from "./captions";
import { uploadToTwitter } from "./twitter";

type Event = {
  card: Card;
  cardKey: string;
  imageName: string;
};

export const handler: Handler<Event> = async ({ card, cardKey, imageName }) => {
  const message = createCaption(card.name);
  const comment = `Card name: ${card.name}\nCard image: ${imageName}`;

  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: cardKey,
  });

  const { Body } = await s3Client.send(getObjectCommand);

  if (Body) {
    await uploadToTwitter({
      fileStream: Body as Readable,
      message,
      comment,
    });
  } else {
    console.warn("Object not found, cannot upload");
  }
};
