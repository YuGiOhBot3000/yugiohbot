import axios from "axios";

import {
  getPosts,
  getPostInsights,
  getPostImage,
  postImage,
} from "../src/posts";

jest.mock("axios");

const mockGet = axios.get as jest.MockedFunction<typeof axios.get>;
const mockPost = axios.post as jest.MockedFunction<typeof axios.post>;

describe("Posts", () => {
  const token = "mockToken";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPosts", () => {
    beforeEach(() => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date("2022-02-14T12:00:00.000Z").getTime());

      mockGet
        .mockResolvedValueOnce({
          data: {
            data: [
              {
                created_time: "2022-02-14T09:00:00.000Z",
                message: "Card1",
                id: "1",
              },
              {
                created_time: "2022-02-14T10:00:00.000Z",
                message: "Card2",
                id: "2",
              },
              {
                created_time: "2022-02-14T11:00:00.000Z",
                message: "Card3",
                id: "3",
              },
            ],
            paging: {
              next: "next.url",
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: [
              {
                created_time: "2022-02-07T12:00:01.000Z",
                message: "Card4",
                id: "4",
              },
              {
                created_time: "2022-02-06T12:00:01.000Z",
                message: "Card5",
                id: "5",
              },
              {
                created_time: "2022-02-05T12:00:01.000Z",
                message: "Card6",
                id: "6",
              },
            ],
            paging: {
              next: "next.url",
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: [
              {
                created_time: "2022-02-04T12:00:01.000Z",
                message: "Card7",
                id: "7",
              },
              {
                created_time: "2022-02-03T12:00:01.000Z",
                message: "Card8",
                id: "8",
              },
              {
                created_time: "2022-02-02T12:00:01.000Z",
                message: "Card9",
                id: "9",
              },
            ],
            paging: {
              next: "next.url",
            },
          },
        });
    });

    it("should get all posts from the last 7 days", async () => {
      const posts = await getPosts({ token });

      expect(mockGet).toBeCalledTimes(3);
      expect(mockGet).toBeCalledWith("https://graph.facebook.com/me/posts", {
        params: { access_token: "mockToken" },
      });
      expect(mockGet).toBeCalledWith("next.url");

      expect(posts).toEqual([
        {
          created_time: "2022-02-14T09:00:00.000Z",
          message: "Card1",
          id: "1",
        },
        {
          created_time: "2022-02-14T10:00:00.000Z",
          message: "Card2",
          id: "2",
        },
        {
          created_time: "2022-02-14T11:00:00.000Z",
          message: "Card3",
          id: "3",
        },
        {
          created_time: "2022-02-07T12:00:01.000Z",
          message: "Card4",
          id: "4",
        },
      ]);
    });
  });

  describe("getPostInsights", () => {
    beforeEach(() => {
      mockGet.mockResolvedValue({
        data: {
          reactions: {
            summary: {
              total_count: 8,
            },
          },
        },
      });
    });

    it("should get all reactions on a post", async () => {
      const reactions = await getPostInsights({
        token,
        id: "1234",
      });

      expect(mockGet).toBeCalledTimes(1);
      expect(mockGet).toBeCalledWith("https://graph.facebook.com/1234", {
        params: {
          access_token: "mockToken",
          fields: "reactions.summary(total_count)",
        },
      });

      expect(reactions).toBe(8);
    });

    describe("getPostImage", () => {
      beforeEach(() => {
        mockGet.mockResolvedValue({
          data: {
            data: [{ media: { image: { src: "image.src" } } }],
          },
        });
      });

      it("should get the image on a post", async () => {
        const image = await getPostImage({
          token,
          id: "1234",
        });

        expect(mockGet).toBeCalledTimes(1);
        expect(mockGet).toBeCalledWith(
          "https://graph.facebook.com/1234/attachments",
          { params: { access_token: "mockToken" } }
        );

        expect(image).toBe("image.src");
      });
    });

    describe("postImage", () => {
      beforeEach(() => {
        mockPost.mockResolvedValue({
          data: {
            id: "1234",
            post_id: "1234_5678",
          },
        });

        process.env.FACEBOOK_ALBUM_ID = "9876";
      });

      it("should get the image on a post", async () => {
        const response = await postImage({
          token,
          url: "image.url",
          message: "test",
        });

        expect(mockPost).toBeCalledTimes(1);
        expect(mockPost).toBeCalledWith(
          "https://graph.facebook.com/9876/photos",
          { url: "image.url" },
          { params: { access_token: "mockToken", message: "test" } }
        );

        expect(response).toEqual({
          id: "1234",
          post_id: "1234_5678",
        });
      });
    });
  });
});
