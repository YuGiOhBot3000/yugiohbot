import {
  DetectModerationLabelsCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";
import { S3Client, CopyObjectCommand } from "@aws-sdk/client-s3";
import { S3CreateEvent } from "aws-lambda";
import { mockClient } from "aws-sdk-client-mock";

import { handler } from "../src/index";

jest.spyOn(console, "log").mockImplementation(jest.fn());

const mockS3Client = mockClient(S3Client);
const mockRekognitionClient = mockClient(RekognitionClient);

describe("Handler", () => {
  const event = {
    Records: [
      {
        awsRegion: "eu-central-1",
        s3: {
          bucket: {
            name: "public-bucket",
          },
          object: {
            key: "image-name",
          },
        },
      },
    ],
  } as unknown as S3CreateEvent;

  beforeAll(() => {
    process.env.S3_PRIVATE_BUCKET = "private-bucket";
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockS3Client.reset();
    mockRekognitionClient.reset();
  });

  describe("given the image is offensive", () => {
    beforeEach(() => {
      mockRekognitionClient.on(DetectModerationLabelsCommand).resolves({
        ModerationLabels: [
          {
            Confidence: 75,
          },
          {
            Confidence: 80,
          },
        ],
      });
    });

    it("should not upload it to the private bucket", async () => {
      await handler(event);

      expect(mockRekognitionClient.call(0).args[0].input).toEqual({
        Image: {
          S3Object: { Bucket: "public-bucket", Name: "image-name" },
        },
      });
      expect(mockS3Client.calls()).toHaveLength(0);
    });
  });

  describe("given the image is not offensive", () => {
    beforeEach(() => {
      mockRekognitionClient.on(DetectModerationLabelsCommand).resolves({
        ModerationLabels: [
          {
            Confidence: 75,
          },
          {
            Confidence: 60,
          },
        ],
      });
      mockS3Client.on(CopyObjectCommand).resolves({});
    });

    it("should upload it to the private bucket", async () => {
      await handler(event);

      expect(mockRekognitionClient.call(0).args[0].input).toEqual({
        Image: {
          S3Object: { Bucket: "public-bucket", Name: "image-name" },
        },
      });
      expect(mockS3Client.call(0).args[0].input).toEqual({
        CopySource: "public-bucket/image-name",
        Bucket: "private-bucket",
        Key: "image-name",
      });
    });
  });
});
