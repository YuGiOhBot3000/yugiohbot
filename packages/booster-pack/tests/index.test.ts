import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";
import { mockClient } from "aws-sdk-client-mock";

import {
  getPostImage,
  getPostInsights,
  getPosts,
  postImage,
} from "../src/posts";

import { handler } from "../src/index";
import { Context } from "aws-lambda";

jest.mock("../src/posts");
jest.spyOn(console, "warn").mockImplementation(jest.fn());

const mockSSMClient = mockClient(SSMClient);

const mockGetPostImage = getPostImage as jest.MockedFunction<
  typeof getPostImage
>;
const mockGetPostInsights = getPostInsights as jest.MockedFunction<
  typeof getPostInsights
>;
const mockGetPosts = getPosts as jest.MockedFunction<typeof getPosts>;
const mockPostImage = postImage as jest.MockedFunction<typeof postImage>;

describe("Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSSMClient
      .on(GetParameterCommand)
      .resolves({ Parameter: { Value: "mockToken" } });
    mockGetPosts.mockResolvedValue([
      {
        id: "1",
        message: "Card name: card1\nCard image: image1",
        created_time: "2022-02-14T09:00:00.000Z",
      },
      {
        id: "2",
        message: "Card name: card2\nCard image: image2",
        created_time: "2022-02-14T09:00:00.000Z",
      },
      {
        id: "3",
        message: "Card name: card3\nCard image: image3",
        created_time: "2022-02-14T09:00:00.000Z",
      },
    ]);
    mockGetPostInsights
      .mockResolvedValueOnce(7)
      .mockResolvedValueOnce(4)
      .mockResolvedValueOnce(22);

    mockGetPostImage
      .mockResolvedValueOnce("image1.url")
      .mockResolvedValueOnce("image2.url");

    mockPostImage
      .mockResolvedValueOnce({ id: "1", post_id: "123" })
      .mockResolvedValueOnce({ id: "2", post_id: "456" });
  });

  it("should post all images above 5 reactions", async () => {
    await handler({}, {} as Context, jest.fn());

    expect(mockGetPosts).toBeCalledWith({ token: "mockToken" });

    expect(mockGetPostInsights).toBeCalledTimes(3);
    expect(mockGetPostInsights).toBeCalledWith({ token: "mockToken", id: "1" });
    expect(mockGetPostInsights).toBeCalledWith({ token: "mockToken", id: "2" });
    expect(mockGetPostInsights).toBeCalledWith({ token: "mockToken", id: "3" });

    expect(mockGetPostImage).toBeCalledTimes(2);
    expect(mockGetPostImage).toBeCalledWith({ token: "mockToken", id: "1" });
    expect(mockGetPostImage).toBeCalledWith({ token: "mockToken", id: "3" });

    expect(mockPostImage).toBeCalledTimes(2);
    expect(mockPostImage).toBeCalledWith({
      token: "mockToken",
      url: "image2.url",
      message: "Card Name: card1\nTotal Reactions: 7",
    });
    expect(mockPostImage).toBeCalledWith({
      token: "mockToken",
      url: "image1.url",
      message: "Card Name: card3\nTotal Reactions: 22",
    });
  });

  describe("given no token is found", () => {
    beforeEach(() => {
      mockSSMClient.on(GetParameterCommand).resolves({});
    });

    it("should throw an error", async () => {
      expect(handler({}, {} as Context, jest.fn())).rejects.toThrow(
        "No Facebook Token found"
      );

      expect(mockGetPosts).not.toBeCalled();
    });
  });
});
