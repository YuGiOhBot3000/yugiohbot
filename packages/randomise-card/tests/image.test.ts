import fs from "fs";

import { OpenAIApi } from "openai";

import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

import {
  chooseCardImage,
  cropImage,
  getFromDALLE,
  getFromSPB,
  getRandomOfficialImage,
  uploadToS3,
} from "../src/image";

jest.mock("openai");

const mockOpenAI = OpenAIApi as jest.MockedClass<typeof OpenAIApi>;

describe("Image", () => {
  const mockS3Client = mockClient(S3Client);
  const mockCreateImage = jest.fn();

  beforeAll(() => {
    process.env.CARD_IMAGE_BUCKET = "card-image-bucket";
    process.env.PRIVATE_SUBMISSION_BUCKET = "private-submission-bucket";
    process.env.AWS_REGION = "eu-central-1";
    process.env.OPENAI_API_KEY = "open-ai-private-key";
  });

  beforeEach(() => {
    mockS3Client.reset();

    mockS3Client.on(ListObjectsV2Command).resolves({
      Contents: [{ Key: "key1" }, { Key: "key2" }, { Key: "key3" }],
    });

    mockOpenAI.mockImplementation(
      () =>
        ({
          createImage: mockCreateImage,
        } as unknown as OpenAIApi)
    );
    mockCreateImage.mockResolvedValue({
      data: { data: [{ url: "https://dalle.url" }] },
    });
  });

  it("should crop a random image", async () => {
    const { url } = await getRandomOfficialImage();
    const buffer = await cropImage(url);

    fs.writeFileSync("test.png", buffer);
  });

  describe("getFromSPB", () => {
    it("should get a random shitpostbot image", async () => {
      const { url, name } = await getFromSPB();

      expect(url).toContain("https://www.shitpostbot.com/img/sourceimages");
      expect(name).toBeDefined();
    });
  });

  describe("getFromDALLE", () => {
    it("should get an image from DALL-E", async () => {
      const result = await getFromDALLE("title");

      expect(result).toEqual({
        url: "https://dalle.url",
        name: 'DALL-E creation from prompt: "title yugioh card art"',
      });
    });

    it("should return null if an error is thrown", async () => {
      mockCreateImage.mockRejectedValue("Error");

      const result = await getFromDALLE("title");

      expect(result).toBeNull();
    });

    it("should return null if no URL is returned", async () => {
      mockCreateImage.mockResolvedValue({
        data: { data: [{}] },
      });

      const result = await getFromDALLE("title");

      expect(result).toBeNull();
    });
  });

  describe("chooseCardImage", () => {
    it.each([
      {
        percentage: 0.05,
        expected: "https://dalle.url",
      },
      {
        percentage: 0.2,
        expected: "https://www.shitpostbot.com/img/sourceimages",
      },
      {
        percentage: 0.3,
        expected: "https://card-image-bucket.s3.eu-central-1.amazonaws.com",
      },
    ])(
      "should return $expected with a $percentage% change",
      async ({ percentage, expected }) => {
        jest.spyOn(Math, "random").mockReturnValue(percentage);

        const { url, name } = await chooseCardImage("title");
        expect(url).toContain(expected);
        expect(name).toBeDefined();
      }
    );
  });

  describe("uploadToS3", () => {
    beforeEach(() => {
      mockS3Client.on(PutObjectCommand).resolves({});
    });

    it("should upload the buffer to S3", async () => {
      const buffer = Buffer.from("hello world");

      const result = await uploadToS3("1234", buffer);

      expect(result).toBe(
        "https://card-image-bucket.s3.eu-central-1.amazonaws.com/1234.png"
      );
      expect(mockS3Client.call(0).args[0].input).toEqual({
        Bucket: process.env.CARD_IMAGE_BUCKET,
        Key: "1234.png",
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/png",
      });
    });
  });
});
