import { Context } from "aws-lambda";
import fs from "fs";

import { handler } from "../src/index";
import { Event, Layout, Rarities } from "../src/types";

describe("Handler", () => {
  const event = {
    name: "Cardy McCardface",
    image: "https://ygoprodeck.com/pics/89631139.jpg",
    layout: Layout.SKILL,
    pendulum: { enabled: false },
    rarity: Rarities.SECRET,
  } as Event;
  const context = {} as Context;
  const callback = jest.fn();

  it("should create card", async () => {
    const stream = await handler(event, context, callback);

    fs.writeFileSync("test.png", stream);
  });
});
