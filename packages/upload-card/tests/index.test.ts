import { ReadableStream } from "stream/web";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Card } from "@yugiohbot/types";

import { mockClient } from "aws-sdk-client-mock";

import { commentOnPost, uploadToFacebook } from "../src/facebook";

import { handler } from "../src/index";
import { Context } from "aws-lambda";

jest.mock("../src/facebook");

const mockCommentOnPost = commentOnPost as jest.MockedFunction<
  typeof commentOnPost
>;
const mockUploadToFacebook = uploadToFacebook as jest.MockedFunction<
  typeof uploadToFacebook
>;

const mockS3Client = mockClient(S3Client);

jest.spyOn(console, "log").mockImplementation(jest.fn());

describe("Handler", () => {
  const buffer = Buffer.from("hello world") as unknown as ReadableStream;
  const card = {
    name: "Cardy McCardface",
  } as unknown as Card;

  beforeAll(() => {
    process.env.AWS_REGION = "eu-central-1";
    process.env.S3_BUCKET = "bucket";
  });

  beforeEach(() => {
    mockS3Client.on(GetObjectCommand).resolves({ Body: buffer });
    mockUploadToFacebook.mockResolvedValue({
      post_id: "1234_5678",
      id: "5678",
    });
    mockCommentOnPost.mockResolvedValue({ id: "9876" });
  });

  it("should upload an image and post a comment to facebook", async () => {
    await handler(
      { card, cardKey: "1234.png", imageName: "Card Image" },
      {} as Context,
      jest.fn()
    );

    expect(mockS3Client.call(0).args[0].input).toEqual({
      Bucket: "bucket",
      Key: "1234.png",
    });

    expect(mockUploadToFacebook).toBeCalledWith({
      fileStream: buffer,
      message: expect.any(String),
    });

    expect(mockCommentOnPost).toBeCalledWith({
      post_id: "1234_5678",
      message: "Card name: Cardy McCardface\nCard image: Card Image",
    });
  });
});
