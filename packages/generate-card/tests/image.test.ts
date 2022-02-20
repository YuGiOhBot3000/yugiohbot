import canvas, { createCanvas, Image } from "canvas";

import { CARD_WIDTH, CARD_HEIGHT, STYLES } from "../src/constants";
import { Layout, Rarity } from "@yugiohbot/types";

import { applyImage } from "../src/image";

describe("Image", () => {
  describe("applyImage", () => {
    const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
    const drawImageSpy = jest
      .spyOn(context, "drawImage")
      .mockImplementation(jest.fn());
    const loadImageSpy = jest.spyOn(canvas, "loadImage");

    beforeEach(() => {
      jest.clearAllMocks();

      loadImageSpy.mockResolvedValue({ image: true } as unknown as Image);
    });

    it.each([
      ["normal", Layout.NORMAL, false],
      ["pendulum", Layout.NORMAL, true],
      ["pendulum", Layout.UNITY, false],
    ])(
      "should draw a common image with a %s style",
      async (style, layout, pendulum) => {
        await applyImage({
          context,
          filename: "image.png",
          pendulum,
          rarity: Rarity.COMMON,
          layout,
        });

        expect(loadImageSpy).toBeCalledTimes(1);
        expect(loadImageSpy).toBeCalledWith("image.png");

        expect(drawImageSpy).toBeCalledTimes(1);
        expect(drawImageSpy).toBeCalledWith(
          { image: true },
          STYLES[style as keyof typeof STYLES].left,
          STYLES[style as keyof typeof STYLES].top,
          STYLES[style as keyof typeof STYLES].width,
          STYLES[style as keyof typeof STYLES].height
        );
      }
    );

    it.each([
      [Rarity.SECRET, "normal", false],
      [Rarity.ULTRA, "pendulum", true],
    ])(
      "should draw a foil image with a %s rarity",
      async (rarity, style, pendulum) => {
        await applyImage({
          context,
          filename: "image.png",
          pendulum,
          rarity,
          layout: Layout.NORMAL,
        });

        expect(loadImageSpy).toBeCalledTimes(2);
        expect(loadImageSpy).toBeCalledWith("image.png");
        expect(loadImageSpy).toBeCalledWith("assets/foil/Secret.png");

        expect(drawImageSpy).toBeCalledTimes(2);
        expect(drawImageSpy).toBeCalledWith(
          { image: true },
          STYLES[style as keyof typeof STYLES].left,
          STYLES[style as keyof typeof STYLES].top,
          STYLES[style as keyof typeof STYLES].width,
          STYLES[style as keyof typeof STYLES].height
        );
      }
    );
  });
});
