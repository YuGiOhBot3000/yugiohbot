import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { handler } from "../src/index";

jest.mock("@aws-sdk/s3-request-presigner");

const mockGetSignedUrl = getSignedUrl as jest.MockedFunction<
  typeof getSignedUrl
>;

describe("Handler", () => {
  const mockUrl = "https://some.url";

  beforeAll(() => {
    process.env.AWS_REGION = "eu-central-1";
    process.env.S3_BUCKET = "bucket";
  });

  beforeEach(() => {
    mockGetSignedUrl.mockResolvedValue(mockUrl);
  });

  it("should return a signed URL", async () => {
    const result = await handler();

    expect(mockGetSignedUrl).toBeCalledWith(
      expect.any(S3Client),
      expect.any(PutObjectCommand),
      { expiresIn: 60 }
    );

    expect(result).toEqual(mockUrl);
  });
});
