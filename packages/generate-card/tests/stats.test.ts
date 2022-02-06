import { createCanvas } from "canvas";

import { CARD_HEIGHT, CARD_WIDTH, STAT_STYLES } from "../src/constants";
import { Layout } from "../src/types";

import { applyAtk, applyDef } from "../src/stats";

describe("Stats", () => {
  const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
  const fillTextSpy = jest
    .spyOn(context, "fillText")
    .mockImplementation(jest.fn());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("applyAtk", () => {
    it.each([[Layout.SKILL], [Layout.SPELL], [Layout.TRAP]])(
      "should not apply ATK to a %s layout",
      (layout) => {
        applyAtk({ context, layout, value: 0 });

        expect(fillTextSpy).not.toBeCalled();
      }
    );

    it("should fillText with the Atk Stat", () => {
      applyAtk({ context, layout: Layout.NORMAL, value: 100 });

      expect(context.font).toBe(
        `${STAT_STYLES.fontSize}px ${STAT_STYLES.fontFamily}`
      );
      expect(fillTextSpy).toBeCalledWith(
        "100",
        STAT_STYLES.atkLeft,
        STAT_STYLES.top,
        STAT_STYLES.width
      );
    });
  });

  describe("applyDef", () => {
    it.each([[Layout.LINK], [Layout.SKILL], [Layout.SPELL], [Layout.TRAP]])(
      "should not apply DEF to a %s layout",
      (layout) => {
        applyDef({ context, layout, value: 0 });

        expect(fillTextSpy).not.toBeCalled();
      }
    );

    it("should fillText with the Def Stat", () => {
      applyDef({ context, layout: Layout.NORMAL, value: 100 });

      expect(context.font).toBe(
        `${STAT_STYLES.fontSize}px ${STAT_STYLES.fontFamily}`
      );
      expect(fillTextSpy).toBeCalledWith(
        "100",
        STAT_STYLES.defLeft,
        STAT_STYLES.top,
        STAT_STYLES.width
      );
    });
  });
});
