import canvas, { createCanvas, Image } from "canvas";

import { CARD_HEIGHT, CARD_WIDTH, ATTRIBUTE_STYLE } from "../src/constants";

import { applyAttribute } from "../src/attribute";
import { Attribute, Layout } from "../src/types";

describe("Attribute", () => {
  describe("applyAttribute", () => {
    const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
    const drawImageSpy = jest
      .spyOn(context, "drawImage")
      .mockImplementation(jest.fn());
    const loadImageSpy = jest.spyOn(canvas, "loadImage");

    beforeEach(() => {
      jest.clearAllMocks();

      loadImageSpy.mockResolvedValue({ image: true } as unknown as Image);
    });

    it("should not load an image with NONE attribute", async () => {
      await applyAttribute({
        context,
        attribute: Attribute.NONE,
        layout: Layout.NORMAL,
      });

      expect(loadImageSpy).not.toBeCalled();
      expect(drawImageSpy).not.toBeCalled();
    });

    it("should not load an image with SKILL layout", async () => {
      await applyAttribute({
        context,
        attribute: Attribute.DIVINE,
        layout: Layout.SKILL,
      });

      expect(loadImageSpy).not.toBeCalled();
      expect(drawImageSpy).not.toBeCalled();
    });

    it.each([
      [Attribute.DARK],
      [Attribute.DIVINE],
      [Attribute.EARTH],
      [Attribute.FIRE],
      [Attribute.LIGHT],
      [Attribute.WATER],
      [Attribute.WIND],
      [Attribute.SPELL],
      [Attribute.TRAP],
    ])("should load the %s attribute image", async (attribute) => {
      await applyAttribute({ context, attribute, layout: Layout.NORMAL });

      expect(loadImageSpy).toBeCalledWith(`assets/attribute/${attribute}.png`);
      expect(drawImageSpy).toBeCalledWith(
        { image: true },
        ATTRIBUTE_STYLE.left,
        ATTRIBUTE_STYLE.top,
        ATTRIBUTE_STYLE.width,
        ATTRIBUTE_STYLE.height
      );
    });
  });
});
