import { createCanvas } from "canvas";

import {
  CARD_WIDTH,
  CARD_HEIGHT,
  CARD_NAME_STYLES,
  CARD_NAME_COLORS,
} from "../src/constants";
import { Rarities } from "../src/types";

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

    describe.each([["regular"], ["skill"]])(
      "given a %s card is made",
      (type) => {
        it.each([
          [Rarities.COMMON, "default"],
          [Rarities.RARE, "silver"],
          [Rarities.SECRET, "silver"],
          [Rarities.ULTRA, "gold"],
        ])(
          "should fillText for a %s rarity with %s color and style",
          (rarity, color) => {
            const cardType = type as "regular" | "skill";

            applyCardName({
              context,
              name: "Hello World",
              type: cardType,
              rarity,
            });

            expect(context.textBaseline).toBe("top");
            expect(context.globalCompositeOperation).toBe("source-over");
            expect(context.font).toBe(
              `${CARD_NAME_STYLES[cardType].fontStyle} ${CARD_NAME_STYLES[cardType].fontWeight} ${CARD_NAME_STYLES[cardType].fontSize}px ${CARD_NAME_STYLES[cardType].fontFamily}`
            );
            expect(context.fillStyle).toBe(CARD_NAME_COLORS[color].base.color);

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
      }
    );
  });
});
