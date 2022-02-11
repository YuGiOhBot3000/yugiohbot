import { Handler } from "aws-lambda";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
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

  const s3Client = new S3Client({ region: process.env.AWS_REGION });
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: cardKey,
  });

  const ssmClient = new SSMClient({ region: process.env.AWS_REGION });
  const getParameterCommand = new GetParameterCommand({
    Name: process.env.SSM_NAME,
    WithDecryption: true,
  });

  const { Parameter } = await ssmClient.send(getParameterCommand);

  const token = Parameter?.Value;

  if (!token) {
    throw new Error("Facebook token not found");
  }

  const { Body } = await s3Client.send(getObjectCommand);
  const { post_id } = await uploadToFacebook({
    fileStream: Body,
    message,
    token,
  });
  const { id } = await commentOnPost({ post_id, message: comment, token });

  console.log({ post_id, comment_id: id });
};
