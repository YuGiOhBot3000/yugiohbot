import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

export const handler = async () => {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: nanoid(),
  });

  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 60,
  });

  return signedUrl;
};
