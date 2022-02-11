import axios from "axios";
import FormData from "form-data";
import fs from "fs";

import { commentOnPost, uploadToFacebook } from "../src/facebook";

jest.mock("axios");

const mockPost = axios.post as jest.MockedFunction<typeof axios.post>;

describe("Upload", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockPost.mockResolvedValue({ data: true });
  });

  describe("uploadToFacebook", () => {
    const file = "test.png";

    beforeEach(() => {
      fs.writeFileSync(file, "hello world");
    });

    afterEach(() => {
      fs.rmSync(file);
    });

    it("should call axios with the correct data", async () => {
      const result = await uploadToFacebook({
        fileStream: fs.createReadStream(file),
        message: "Hello, World",
        token: "mockToken",
      });

      expect(mockPost).toBeCalledWith(
        "https://graph.facebook.com/me/photos",
        expect.any(FormData),
        {
          params: { access_token: "mockToken", message: "Hello, World" },
          headers: {
            "content-type": expect.stringContaining("multipart/form-data;"),
          },
        }
      );
      expect(result).toBe(true);
    });
  });

  describe("commentOnPost", () => {
    it("should call axios with the correct data", async () => {
      const result = await commentOnPost({
        post_id: "1234_5678",
        message: "Hello, World",
        token: "mockToken",
      });

      expect(mockPost).toBeCalledWith(
        "https://graph.facebook.com/1234_5678/comments",
        { message: "Hello, World" },
        {
          params: { access_token: "mockToken" },
        }
      );
      expect(result).toBe(true);
    });
  });
});
