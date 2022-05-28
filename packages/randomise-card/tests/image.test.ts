import fs from "fs";

import {
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  _Object,
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

import { randomElement } from "@yugiohbot/utils";

import {
  chooseCardImage,
  copyAcrossS3,
  cropImage,
  getFromSPB,
  getFromSubmissions,
  getRandomOfficialImage,
  uploadToS3,
} from "../src/image";

jest.mock("@yugiohbot/utils");

const mockRandomElement = randomElement as jest.MockedFunction<
  typeof randomElement
>;

describe("Image", () => {
  const mockS3Client = mockClient(S3Client);

  beforeAll(() => {
    process.env.CARD_IMAGE_BUCKET = "card-image-bucket";
    process.env.PRIVATE_SUBMISSION_BUCKET = "private-submission-bucket";
    process.env.AWS_REGION = "eu-central-1";
  });

  beforeEach(() => {
    mockS3Client.reset();

    mockS3Client.on(ListObjectsV2Command).resolves({
      Contents: [{ Key: "key1" }, { Key: "key2" }, { Key: "key3" }],
    });
    // Select the 2nd element
    mockRandomElement.mockImplementation((arr: _Object[]) => arr[1]);
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

  describe("getFromSubmissions", () => {
    it("should get a random image from the submissions bucket", async () => {
      const key = await getFromSubmissions();

      expect(key).toEqual("key2");
    });

    describe("given there are no objects in the bucket", () => {
      beforeEach(() => {
        mockS3Client.on(ListObjectsV2Command).resolves({});
      });

      it("should return undefined", async () => {
        const key = await getFromSubmissions();

        expect(key).toBeUndefined();
      });
    });
  });

  describe("chooseCardImage", () => {
    it.each([
      {
        percentage: 0.01,
        expected: "https://card-image-bucket.s3.eu-central-1.amazonaws.com",
      },
      {
        percentage: 0.02,
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

        const { url, name } = await chooseCardImage();
        expect(url).toContain(expected);
        expect(name).toBeDefined();
      }
    );

    describe("given no user submission is found", () => {
      beforeEach(() => {
        mockS3Client.on(ListObjectsV2Command).resolves({});
      });

      it("should choose a SPB image", async () => {
        jest.spyOn(Math, "random").mockReturnValue(0.01);

        const { url, name } = await chooseCardImage();
        expect(url).toContain("https://www.shitpostbot.com/img/sourceimages");
        expect(name).toBeDefined();
      });
    });
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

  describe("copyAcrossS3", () => {
    it("should copy a key from one bucket to another", async () => {
      const result = await copyAcrossS3("1234.png");

      expect(result).toBe(
        "https://card-image-bucket.s3.eu-central-1.amazonaws.com/1234.png"
      );
      expect(mockS3Client.call(0).args[0].input).toEqual({
        Bucket: process.env.CARD_IMAGE_BUCKET,
        CopySource: "private-submission-bucket/1234.png",
        Key: "1234.png",
      });
    });
  });
});
