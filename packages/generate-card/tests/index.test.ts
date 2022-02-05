import { Context } from "aws-lambda";
import fs from "fs";

import { handler } from "../src/index";
import { Attribute, Event, Layout, Rarities } from "../src/types";

describe("Handler", () => {
  const event = {
    name: "Cardy McCardface",
    image:
      "https://static.wikia.nocookie.net/vsbattles/images/d/d4/Blue_Eyes.png",
    layout: Layout.DARK_SYNCHRO,
    pendulum: { enabled: false },
    rarity: Rarities.RARE,
    attribute: Attribute.LIGHT,
  } as Event;
  const context = {} as Context;
  const callback = jest.fn();

  it("should create card", async () => {
    const stream = await handler(event, context, callback);

    fs.writeFileSync("test.png", stream);
  });
});
