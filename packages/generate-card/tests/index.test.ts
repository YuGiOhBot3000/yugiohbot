import { Context } from "aws-lambda";
import fs from "fs";

import { handler } from "../src/index";
import { Attribute, Event, Icon, Layout, Rarities } from "../src/types";

describe("Handler", () => {
  const event = {
    name: "Cardy McCardface",
    level: 12,
    atk: 1240,
    def: 1899,
    image:
      "https://static.wikia.nocookie.net/vsbattles/images/d/d4/Blue_Eyes.png",
    layout: Layout.DARK_SYNCHRO,
    pendulum: { enabled: true },
    rarity: Rarities.COMMON,
    attribute: Attribute.LIGHT,
    type: "Hello World",
    icon: Icon.EQUIP,
    serial: "12345678",
    id: "YGOBOT123",
    copyright: "© 2022 YuGiOhBot",
    effect:
      "A card maker that supports the creation of Normal, Effect, Ritual, Fusion, Synchro, Dark Synchro, Xyz and Link monsters. It also provides support for creating Pendulum versions of some card types. A card maker that supports the creation of Normal, Effect, Ritual, Fusion, Synchro, Dark Synchro, Xyz and Link monsters. It also provides support for creating Pendulum versions of some card types.",
  } as Event;
  const context = {} as Context;
  const callback = jest.fn();

  it("should create card", async () => {
    const stream = await handler(event, context, callback);

    fs.writeFileSync("test.png", stream);
  });
});
