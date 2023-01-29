import { Readable } from "stream";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Card } from "@yugiohbot/types";

import { mockClient } from "aws-sdk-client-mock";
import { Context } from "aws-lambda";

import { handler } from "../src/index";
import { uploadToTwitter } from "../src/twitter";

jest.mock("../src/twitter");

const mockUploadToTwitter = jest.mocked(uploadToTwitter);

const mockS3Client = mockClient(S3Client);

describe("Handler", () => {
  const card = {
    name: "Cardy McCardface",
  } as unknown as Card;

  beforeAll(() => {
    process.env.AWS_REGION = "eu-central-1";
    process.env.S3_BUCKET = "bucket";
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const fileStream = new Readable();
    fileStream.push("hello world");
    fileStream.push(null);

    mockS3Client.on(GetObjectCommand).resolves({
      Body: fileStream,
    });
  });

  it("should upload an image to twitter", async () => {
    await handler(
      { card, cardKey: "1234.png", imageName: "Card Image" },
      {} as Context,
      jest.fn()
    );

    expect(mockS3Client.call(0).args[0].input).toEqual({
      Bucket: "bucket",
      Key: "1234.png",
    });

    expect(mockUploadToTwitter).toBeCalledWith({
      fileStream: expect.any(Readable),
      message: expect.any(String),
      comment: "Card name: Cardy McCardface\nCard image: Card Image",
    });
  });
});
