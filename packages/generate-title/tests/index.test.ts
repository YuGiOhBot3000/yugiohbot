import fs from "fs";

import { createTitle } from "../src/title";
import { handler } from "../src/index";

jest.mock("fs");
jest.mock("../src/title");

const mockReadFileSync = fs.readFileSync as jest.MockedFunction<
  typeof fs.readFileSync
>;
const mockCreateTitle = createTitle as jest.MockedFunction<typeof createTitle>;

describe("Handler", () => {
  const nounsFile = `
    noun1,
    noun2,
    noun3
    `;
  const adjectivesFile = `
    adj1,
    adj2,
    adj3
    `;

  beforeEach(() => {
    jest.clearAllMocks();

    mockCreateTitle.mockReturnValue("mockTitle");
    mockReadFileSync
      .mockReturnValueOnce(nounsFile)
      .mockReturnValueOnce(adjectivesFile);
  });

  it("should return a created title", () => {
    expect(handler()).toEqual("mockTitle");
    expect(mockCreateTitle).toBeCalledWith({
      nouns: ["noun1", "noun2", "noun3"],
      adjectives: ["adj1", "adj2", "adj3"],
    });
  });
});
