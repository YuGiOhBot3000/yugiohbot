import fs, { WriteStream } from "fs";

import { sendRequest } from "../src/api";
import { generateDescriptions } from "../src/gpt3";

jest.mock("fs");
jest.mock("../src/api");

const mockCreateWriteStream = fs.createWriteStream as jest.MockedFunction<
  typeof fs.createWriteStream
>;
const mockSendRequest = sendRequest as jest.MockedFunction<typeof sendRequest>;

describe("GPT3", () => {
  const mockWrite = jest.fn();
  const mockEnd = jest.fn();

  describe("generateDescriptions", () => {
    beforeEach(() => {
      mockSendRequest.mockResolvedValue([
        { name: "card1", id: "123", desc: "desc1", type: "monster" },
        { name: "card2", id: "456", desc: "desc2", type: "monster" },
      ]);
      mockCreateWriteStream.mockReturnValue({
        write: mockWrite,
        end: mockEnd,
      } as unknown as WriteStream);
    });

    it("should write the prompt and completion to the stream", async () => {
      await generateDescriptions(["effect", "normal"], "monster", "monsters");

      expect(mockSendRequest).toBeCalledWith({
        type: "effect monster",
        startdate: "08/07/2011",
        enddate: "01/01/2022",
        dataregion: "tcg_date",
      });
      expect(mockSendRequest).toBeCalledWith({
        type: "normal monster",
        startdate: "08/07/2011",
        enddate: "01/01/2022",
        dataregion: "tcg_date",
      });
      expect(mockWrite).toBeCalledTimes(4);
      expect(mockWrite).toBeCalledWith(
        '{"prompt":"effect ->","completion":" desc1\\n"}\n'
      );
      expect(mockWrite).toBeCalledWith(
        '{"prompt":"effect ->","completion":" desc2\\n"}\n'
      );
      expect(mockWrite).toBeCalledWith(
        '{"prompt":"normal ->","completion":" desc1\\n"}\n'
      );
      expect(mockWrite).toBeCalledWith(
        '{"prompt":"normal ->","completion":" desc2\\n"}\n'
      );
      expect(mockEnd).toBeCalledTimes(1);
    });
  });
});
