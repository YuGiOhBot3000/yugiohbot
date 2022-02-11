import { Handler } from "aws-lambda";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Card } from "@yugiohbot/types";

import { createCaption } from "./captions";
import { commentOnPost, uploadToFacebook } from "./facebook";

type Event = {
  card: Card;
  cardKey: string;
  imageName: string;
};

export const handler: Handler<Event> = async ({ card, cardKey, imageName }) => {
  const message = createCaption(card.name);
  const comment = `Card name: ${card.name}\nCard image: ${imageName}`;

  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: cardKey,
  });

  const { Body } = await client.send(command);
  const { post_id } = await uploadToFacebook({ fileStream: Body, message });
  const { id } = await commentOnPost({ post_id, message: comment });

  console.log({ post_id, comment_id: id });
};
