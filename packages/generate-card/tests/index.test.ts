import {
  S3Client,
  PutObjectCommandInput,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Context } from "aws-lambda";
import fs from "fs";
import { mockClient } from "aws-sdk-client-mock";

import { handler } from "../src/index";
import { Attribute, Card, Icon, Layout, Rarity } from "@yugiohbot/types";

const mockS3Client = mockClient(S3Client);

describe("Handler", () => {
  const event = {
    name: "Cardy McCardface",
    level: 12,
    atk: 1240,
    def: 5,
    image:
      "https://static.wikia.nocookie.net/vsbattles/images/d/d4/Blue_Eyes.png",
    layout: Layout.LINK,
    pendulum: {
      enabled: true,
      red: 5,
      blue: 5,
      effect:
        "A card maker that supports the creation of Normal, Effect, Ritual, Fusion, Synchro, Dark Synchro, Xyz and Link monsters. It also provides support for creating Pendulum versions of some card types. A card maker that supports the creation of Normal, Effect, Ritual, Fusion, Synchro, Dark Synchro, Xyz and Link monsters. It also provides support for creating Pendulum versions of some card types.",
    },
    link: {
      topLeft: true,
      topCenter: true,
      topRight: true,
      middleLeft: true,
      middleRight: true,
      bottomLeft: true,
      bottomCenter: true,
      bottomRight: true,
    },
    rarity: Rarity.COMMON,
    attribute: Attribute.NONE,
    type: "Hello World",
    icon: Icon.NONE,
    serial: "12345678",
    id: "YGOBOT123",
    copyright: "© 2022 YuGiOhBot",
    effect:
      "A card maker that supports the creation of Normal, Effect, Ritual, Fusion, Synchro, Dark Synchro, Xyz and Link monsters. It also provides support for creating Pendulum versions of some card types. A card maker that supports the creation of Normal, Effect, Ritual, Fusion, Synchro, Dark Synchro, Xyz and Link monsters. It also provides support for creating Pendulum versions of some card types.",
  } as Card;
  const context = {} as Context;
  const callback = jest.fn();

  beforeAll(() => {
    process.env.S3_BUCKET = "bucket";
  });

  beforeEach(() => {
    mockS3Client.on(PutObjectCommand).resolves({});
  });

  it("should create card", async () => {
    const key = await handler(event, context, callback);

    const input = mockS3Client.call(0).args[0].input as PutObjectCommandInput;

    expect(input).toEqual({
      Bucket: "bucket",
      Key: key,
      Body: expect.any(Buffer),
      ContentEncoding: "base64",
      ContentType: "image/png",
    });

    fs.writeFileSync("test.png", input.Body as Buffer);
  });
});
