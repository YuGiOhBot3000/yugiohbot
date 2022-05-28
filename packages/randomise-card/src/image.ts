import {
  CopyObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomElement } from "@yugiohbot/utils";

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

type ImageData = {
  url: string;
  name: string;
};

const SUBMISSION_THRESHOLD = 0.01;
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
    const { data } = await axios.get<DBCard>(RANDOM_URL);

    url = data.card_images?.[0].image_url;
    ({ id, type, name } = data);
  } while (type.toLowerCase().includes("pendulum"));

  return { id, url, name };
};

export const getFromSPB = async (): Promise<ImageData> => {
  const path = "api/randsource";
  const { data } = await axios.get<SPBSource>(SPB_BASE_URL + path);

  return { url: SPB_BASE_URL + data.sub.img.full, name: data.sub.name };
};

export const getFromSubmissions = async (): Promise<string | undefined> => {
  const sourceBucket = process.env.PRIVATE_SUBMISSION_BUCKET;

  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new ListObjectsV2Command({
    Bucket: sourceBucket,
  });

  const objectsInBucket = await client.send(command);

  if (!objectsInBucket.Contents) {
    return;
  }

  const randomObject = randomElement(objectsInBucket.Contents);

  return randomObject.Key;
};

export const chooseCardImage = async (): Promise<ImageData> => {
  const choice = Math.random();
  const userSubmission = await getFromSubmissions();

  const shouldUseSubmission = choice <= SUBMISSION_THRESHOLD && userSubmission;

  // 30% chance of a SPB image
  const shouldGetFromSPB =
    (choice < SPB_THRESHOLD && choice > SUBMISSION_THRESHOLD) ||
    (choice <= SUBMISSION_THRESHOLD && !userSubmission);

  if (shouldUseSubmission) {
    const url = await copyAcrossS3(userSubmission);
    return {
      url,
      name: "Submission from a fan. Submit yours at yugiohbot3000.github.io/submission/",
    };
  } else if (shouldGetFromSPB) {
    return await getFromSPB();
  } else {
    const { url, id, name } = await getRandomOfficialImage();
    const buffer = await cropImage(url);
    const s3Url = await uploadToS3(id, buffer);

    return { url: s3Url, name };
  }
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

export const copyAcrossS3 = async (Key: string) => {
  const sourceBucket = process.env.PRIVATE_SUBMISSION_BUCKET;
  const destinationBucket = process.env.CARD_IMAGE_BUCKET;

  const client = new S3Client({ region: process.env.AWS_REGION });

  // Copy selected object across
  const copyCommand = new CopyObjectCommand({
    Bucket: destinationBucket,
    CopySource: `${sourceBucket}/${Key}`,
    Key,
  });
  await client.send(copyCommand);

  return `https://${destinationBucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};
