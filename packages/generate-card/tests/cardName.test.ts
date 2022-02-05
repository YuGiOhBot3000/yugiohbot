import canvas, { createCanvas, Image } from "canvas";

import { CARD_WIDTH, CARD_HEIGHT, CARD_NAME_STYLES } from "../src/constants";
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

    describe("given a regular card is made", () => {
      it("should fillText with default color and style", () => {
        applyCardName({
          context,
          name: "Hello World",
          type: "regular",
          rarity: Rarities.COMMON,
        });

        expect(context.textBaseline).toBe("top");
        expect(context.globalCompositeOperation).toBe("source-over");
        expect(context.font).toBe(
          `${CARD_NAME_STYLES.regular.fontStyle} ${CARD_NAME_STYLES.regular.fontWeight} ${CARD_NAME_STYLES.regular.fontSize}px ${CARD_NAME_STYLES.regular.fontFamily}`
        );

        expect(fillTextSpy).toBeCalledTimes(2);
        expect(fillTextSpy).toBeCalledWith(
          "Hello World",
          CARD_NAME_STYLES.regular.left - 1,
          CARD_NAME_STYLES.regular.top - 1,
          CARD_NAME_STYLES.regular.width
        );
        expect(fillTextSpy).toBeCalledWith(
          "Hello World",
          CARD_NAME_STYLES.regular.left,
          CARD_NAME_STYLES.regular.top,
          CARD_NAME_STYLES.regular.width
        );
      });
    });
  });
});
