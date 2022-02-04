import { Context } from "aws-lambda";
import fs from "fs";

import { handler } from "../src/index";
import { Event, Layout } from "../src/types";

describe("Handler", () => {
  const event = {
    layout: Layout.SPELL,
    pendulum: { enabled: false },
  } as Event;
  const context = {} as Context;
  const callback = jest.fn();

  it("should create card", async () => {
    const stream = await handler(event, context, callback);

    fs.writeFileSync("test.png", stream);
  });
});
