import { Context } from "aws-lambda";
import { OpenAIApi } from "openai";
import { FINE_TUNES } from "../src/constants";

jest.mock("openai");

const mockOpenAI = OpenAIApi as jest.MockedClass<typeof OpenAIApi>;

import { handler } from "../src/index";

describe("Handler", () => {
  const mockCreateCompletion = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOpenAI.mockImplementation(
      () =>
        ({
          createCompletionFromModel: mockCreateCompletion,
        } as unknown as OpenAIApi)
    );
    mockCreateCompletion.mockResolvedValue({
      data: { choices: [{ text: "mockText" }] },
    });
  });

  describe("given a monster is selected", () => {
    beforeEach(() => {
      jest.spyOn(Math, "random").mockReturnValueOnce(0); // Choose first option
    });

    it("should generate text from the monster model", async () => {
      const callback = jest.fn();

      await handler({}, {} as Context, callback);

      expect(mockCreateCompletion).toBeCalledWith({
        prompt: `normal ->`,
        stop: "\n",
        max_tokens: 100,
        temperature: 0.7,
        model: FINE_TUNES.MONSTERS,
      });
      expect(callback).toBeCalledWith(null, {
        text: "mockText",
        cardType: "normal monster",
      });
    });
  });

  describe("given an effect monster is selected", () => {
    beforeEach(() => {
      jest.spyOn(Math, "random").mockReturnValueOnce(6 / 13); // Choose 7th option
    });

    it("should generate text from the effects model", async () => {
      const callback = jest.fn();

      await handler({}, {} as Context, callback);

      expect(mockCreateCompletion).toBeCalledWith({
        prompt: `flip effect ->`,
        stop: "\n",
        max_tokens: 100,
        temperature: 0.7,
        model: FINE_TUNES.EFFECTS,
      });
      expect(callback).toBeCalledWith(null, {
        text: "mockText",
        cardType: "flip effect monster",
      });
    });
  });

  describe("given a card is selected", () => {
    beforeEach(() => {
      jest.spyOn(Math, "random").mockReturnValueOnce(12 / 13); // Choose last option
    });

    it("should generate text from the effects model", async () => {
      const callback = jest.fn();

      await handler({}, {} as Context, callback);

      expect(mockCreateCompletion).toBeCalledWith({
        prompt: `trap ->`,
        stop: "\n",
        max_tokens: 100,
        temperature: 0.7,
        model: FINE_TUNES.CARDS,
      });
      expect(callback).toBeCalledWith(null, {
        text: "mockText",
        cardType: "trap card",
      });
    });
  });
});
