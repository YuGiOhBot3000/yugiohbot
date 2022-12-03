import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import axios from "axios";
import { createCanvas, loadImage } from "canvas";
import { Configuration, OpenAIApi } from "openai";

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

type ImageData = {
  url: string;
  name: string;
};

const DALLE_THRESHOLD = 0.05;
const SPB_THRESHOLD = 0.3;

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
  let name = "";

  do {
    const { data } = await axios.get<DBCard>(RANDOM_URL, {
      headers: { Accept: "application/json", "Accept-Encoding": "identity" },
    });

    url = data.card_images?.[0].image_url;
    ({ id, type, name } = data);
  } while (type.toLowerCase().includes("pendulum"));

  return { id, url, name };
};

export const getFromSPB = async (): Promise<ImageData> => {
  const path = "api/randsource";
  const { data } = await axios.get<SPBSource>(SPB_BASE_URL + path, {
    headers: { Accept: "application/json", "Accept-Encoding": "identity" },
  });

  return { url: SPB_BASE_URL + data.sub.img.full, name: data.sub.name };
};

export const getFromDALLE = async (
  title: string
): Promise<ImageData | null> => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `${title} yugioh card art`;
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
      response_format: "url",
    });

    const { url } = response.data.data[0];

    if (!url) return null;

    return {
      url,
      name: `DALL-E creation from prompt: "${prompt}"`,
    };
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const chooseCardImage = async (title: string): Promise<ImageData> => {
  const choice = Math.random();

  const shouldGetFromSPB = choice < SPB_THRESHOLD && choice > DALLE_THRESHOLD;
  const shouldUseDALLE = choice <= DALLE_THRESHOLD;

  if (shouldGetFromSPB) {
    return await getFromSPB();
  }

  if (shouldUseDALLE) {
    const image = await getFromDALLE(title);

    if (image) return image;
  }

  const { url, id, name } = await getRandomOfficialImage();
  const buffer = await cropImage(url);
  const s3Url = await uploadToS3(id, buffer);

  return { url: s3Url, name };
};

export const uploadToS3 = async (id: string, buffer: Buffer) => {
  const Key = `${id}.png`;
  const Bucket = process.env.CARD_IMAGE_BUCKET;
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand({
    Bucket,
    Key,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/png",
  });

  await client.send(command);

  return `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};
