import { S3CreateEvent } from "aws-lambda";
import {
  DetectModerationLabelsCommand,
  DetectModerationLabelsCommandInput,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";
import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";

export const handler = async (event: S3CreateEvent) => {
  const region = event.Records[0].awsRegion;
  const paramList: DetectModerationLabelsCommandInput[] = event.Records.map(
    ({ s3 }) => ({
      Image: {
        S3Object: { Bucket: s3.bucket.name, Name: s3.object.key },
      },
    })
  );

  const rekognitionClient = new RekognitionClient({ region });
  const s3Client = new S3Client({ region });

  const labels = await Promise.all(
    paramList.map((params) => {
      const command = new DetectModerationLabelsCommand(params);
      return rekognitionClient.send(command);
    })
  );

  await Promise.all(
    paramList.map(({ Image }, i) => {
      const moderatedLabels = labels[i].ModerationLabels;

      if (
        moderatedLabels?.some(
          (label) => label.Confidence && label.Confidence >= 80
        )
      ) {
        console.log(
          `Detected offensive image: ${JSON.stringify(moderatedLabels)}`
        );
        return;
      }

      console.log(`Image deemed safe: ${JSON.stringify(moderatedLabels)}`);

      const copyObjectCommand = new CopyObjectCommand({
        CopySource: `${Image?.S3Object?.Bucket}/${Image?.S3Object?.Name}`,
        Bucket: process.env.S3_PRIVATE_BUCKET,
        Key: Image?.S3Object?.Name,
      });

      return s3Client.send(copyObjectCommand);
    })
  );
};
