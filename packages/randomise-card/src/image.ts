import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import axios from "axios";
import { createCanvas, loadImage } from "canvas";

const SIZE = 324;
const RANDOM_URL = "https://db.ygoprodeck.com/api/v7/randomcard.php";
const SPB_BASE_URL = "https://www.shitpostbot.com/";

type DBCard = {
  id: string;
  name: string;
  type: string;
  card_images: { image_url: string }[];
};

type SPBSource = {
  sub: {
    id: string;
    name: string;
    img: {
      full: string;
    };
  };
};

export const cropImage = async (imageUrl: string) => {
  const image = await loadImage(imageUrl);
  const canvas = createCanvas(SIZE, SIZE);
  canvas
    .getContext("2d")
    .drawImage(image, 48, 110, SIZE, SIZE, 0, 0, SIZE, SIZE);

  return canvas.toBuffer();
};

export const getRandomOfficialImage = async () => {
  let url = "";
  let id = "";
  let type = "";

  do {
    const { data } = await axios.get<DBCard>(RANDOM_URL);

    url = data.card_images?.[0].image_url;
    ({ id, type } = data);
  } while (type.includes("pendulum"));

  return { id, url };
};

export const getFromSPB = async () => {
  const path = "api/randsource";
  const { data } = await axios.get<SPBSource>(SPB_BASE_URL + path);

  return SPB_BASE_URL + data.sub.img.full;
};

export const chooseCardImage = async () => {
  const choice = Math.random();

  // 30% chance of a SPB image
  if (choice < 0.3) {
    return await getFromSPB();
  } else {
    const { url, id } = await getRandomOfficialImage();
    const buffer = await cropImage(url);
    return await uploadToS3(id, buffer);
  }
};

export const uploadToS3 = async (id: string, buffer: Buffer) => {
  const Key = `${id}.png`;
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/png",
  });

  await client.send(command);

  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};
