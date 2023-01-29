import { Readable } from "stream";
import { TwitterApi } from "twitter-api-v2";

import { uploadToTwitter } from "../src/twitter";

jest.mock("twitter-api-v2");

const mockTwitterAPI = jest.mocked(TwitterApi);

jest.spyOn(console, "warn").mockImplementation(jest.fn());
jest.spyOn(console, "debug").mockImplementation(jest.fn());

describe("uploadToTwitter", () => {
  const mockUploadMedia = jest.fn();
  const mockTweet = jest.fn();
  const mockReply = jest.fn();

  mockTwitterAPI.mockImplementation(
    () =>
      ({
        readWrite: {
          v1: {
            uploadMedia: mockUploadMedia,
          },
          v2: {
            tweet: mockTweet,
            reply: mockReply,
          },
        },
      } as unknown as TwitterApi)
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not tweet if the media cannot be uploaded", async () => {
    const fileStream = new Readable();
    fileStream.push("hello world");
    fileStream.push(null);

    mockUploadMedia.mockResolvedValue("");

    await uploadToTwitter({
      fileStream,
      message: "message",
      comment: "comment",
    });

    expect(mockUploadMedia).toBeCalledWith(expect.any(Buffer), {
      mimeType: "png",
    });
    expect(mockTweet).not.toBeCalled();
    expect(mockReply).not.toBeCalled();
  });

  it("should tweet and comment with the uploaded media", async () => {
    const fileStream = new Readable();
    fileStream.push("hello world");
    fileStream.push(null);

    mockUploadMedia.mockResolvedValue("media1");
    mockTweet.mockResolvedValue({ data: { id: "tweet1" } });
    mockReply.mockResolvedValue({ data: { id: "tweet2" } });

    await uploadToTwitter({
      fileStream,
      message: "message",
      comment: "comment",
    });

    expect(mockTweet).toBeCalledWith("message", {
      media: { media_ids: ["media1"] },
    });
    expect(mockReply).toBeCalledWith("comment", "tweet1");
  });
});
