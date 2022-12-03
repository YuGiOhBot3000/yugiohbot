import axios from "axios";

import { sendRequest } from "../src/api";

jest.mock("axios");

const mockGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe("API", () => {
  const data = [
    {
      id: "1234",
      name: "card",
      type: "monster",
      desc: "example description",
    },
  ];

  beforeEach(() => {
    mockGet.mockResolvedValue({
      data: {
        data,
      },
    });
  });

  it("should return the data from the fetch request", async () => {
    const params = {
      type: "monster",
    };

    const result = await sendRequest(params);

    expect(mockGet).toBeCalledWith(
      "https://db.ygoprodeck.com/api/v7/cardinfo.php?type=monster",
      { headers: { Accept: "application/json", "Accept-Encoding": "identity" } }
    );
    expect(result).toEqual(data);
  });
});
