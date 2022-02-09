import { createCanvas } from "canvas";

import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_NAME_STYLES,
  CARD_NAME_COLORS,
} from "../src/constants";
import { Layout, Rarities } from "@yugiohbot/types";

import { applyCardName } from "../src/cardName";

describe("Card Name", () => {
  describe("applyCardName", () => {
    const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
    const fillTextSpy = jest
      .spyOn(context, "fillText")
      .mockImplementation(jest.fn());

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("given a regular card is made", () => {
      it.each([
        [Rarities.COMMON, "default"],
        [Rarities.RARE, "silver"],
        [Rarities.SECRET, "silver"],
        [Rarities.ULTRA, "gold"],
      ])(
        "should fillText for a %s rarity with %s color and style",
        (rarity, color) => {
          applyCardName({
            context,
            name: "Hello World",
            layout: Layout.NORMAL,
            rarity,
          });

          const cardType = "regular";

          expect(context.textBaseline).toBe("top");
          expect(context.globalCompositeOperation).toBe("source-over");
          expect(context.font).toBe(
            `${CARD_NAME_STYLES[cardType].fontStyle} ${CARD_NAME_STYLES[cardType].fontWeight} ${CARD_NAME_STYLES[cardType].fontSize}px ${CARD_NAME_STYLES[cardType].fontFamily}`
          );
          expect(context.fillStyle).toBe(
            CARD_NAME_COLORS[color as keyof typeof CARD_NAME_COLORS].base.color
          );

          expect(fillTextSpy).toBeCalledTimes(2);
          expect(fillTextSpy).toBeCalledWith(
            "Hello World",
            CARD_NAME_STYLES[cardType].left - 1,
            CARD_NAME_STYLES[cardType].top - 1,
            CARD_NAME_STYLES[cardType].width
          );
          expect(fillTextSpy).toBeCalledWith(
            "Hello World",
            CARD_NAME_STYLES[cardType].left,
            CARD_NAME_STYLES[cardType].top,
            CARD_NAME_STYLES[cardType].width
          );
        }
      );
    });

    describe("given a skill card is made", () => {
      it.each([
        [Rarities.COMMON, "white"],
        [Rarities.RARE, "silver"],
        [Rarities.SECRET, "silver"],
        [Rarities.ULTRA, "gold"],
      ])(
        "should fillText for a %s rarity with %s color and style",
        (rarity, color) => {
          applyCardName({
            context,
            name: "Hello World",
            layout: Layout.SKILL,
            rarity,
          });

          const cardType = "skill";

          expect(context.textBaseline).toBe("top");
          expect(context.globalCompositeOperation).toBe("source-over");
          expect(context.font).toBe(
            `${CARD_NAME_STYLES[cardType].fontStyle} ${CARD_NAME_STYLES[cardType].fontWeight} ${CARD_NAME_STYLES[cardType].fontSize}px ${CARD_NAME_STYLES[cardType].fontFamily}`
          );
          expect(context.fillStyle).toBe(
            CARD_NAME_COLORS[color as keyof typeof CARD_NAME_COLORS].base.color
          );

          expect(fillTextSpy).toBeCalledTimes(2);
          expect(fillTextSpy).toBeCalledWith(
            "Hello World",
            CARD_NAME_STYLES[cardType].left - 1,
            CARD_NAME_STYLES[cardType].top - 1,
            CARD_NAME_STYLES[cardType].width
          );
          expect(fillTextSpy).toBeCalledWith(
            "Hello World",
            CARD_NAME_STYLES[cardType].left,
            CARD_NAME_STYLES[cardType].top,
            CARD_NAME_STYLES[cardType].width
          );
        }
      );
    });
  });
});
