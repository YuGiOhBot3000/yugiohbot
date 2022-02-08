import fs from "fs";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";

import {
  chooseCardImage,
  cropImage,
  getFromSPB,
  getRandomOfficialImage,
  uploadToS3,
} from "../src/image";

describe("Image", () => {
  beforeAll(() => {
    process.env.S3_BUCKET = "bucket";
    process.env.AWS_REGION = "eu-central-1";
  });

  it("should crop a random image", async () => {
    const { url } = await getRandomOfficialImage();
    const buffer = await cropImage(url);

    fs.writeFileSync("test.png", buffer);
  });

  describe("getFromSPB", () => {
    it("should get a random shitpostbot image", async () => {
      const url = await getFromSPB();

      expect(url).toContain("https://www.shitpostbot.com/img/sourceimages");
    });
  });

  describe("chooseCardImage", () => {
    it.each([
      {
        percentage: 0.2,
        expected: "https://www.shitpostbot.com/img/sourceimages",
      },
      {
        percentage: 0.3,
        expected: "https://bucket.s3.eu-central-1.amazonaws.com",
      },
    ])(
      "should return $expected with a $percentage% change",
      async ({ percentage, expected }) => {
        jest.spyOn(Math, "random").mockReturnValue(percentage);

        const result = await chooseCardImage();
        expect(result).toContain(expected);
      }
    );
  });

  describe("uploadToS3", () => {
    const mockS3Client = mockClient(S3Client);

    beforeEach(() => {
      mockS3Client.reset();
      mockS3Client.on(PutObjectCommand).resolves({});
    });

    it("should upload the buffer to S3", async () => {
      const buffer = Buffer.from("hello world");

      const result = await uploadToS3("1234", buffer);

      expect(result).toBe(
        "https://bucket.s3.eu-central-1.amazonaws.com/1234.png"
      );
      expect(mockS3Client.call(0).args[0].input).toEqual({
        Bucket: process.env.S3_BUCKET,
        Key: "1234.png",
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/png",
      });
    });
  });
});
