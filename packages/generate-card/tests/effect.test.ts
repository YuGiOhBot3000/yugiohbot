import canvas, { createCanvas, Image } from "canvas";

import {
  CARD_HEIGHT,
  CARD_WIDTH,
  ATTRIBUTE_STYLE,
  EFFECT_STYLES,
} from "../src/constants";
import { Attribute, Layout } from "../src/types";

import { applyEffect } from "../src/effect";

describe("Effect", () => {
  describe("applyEffect", () => {
    const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
    const fillTextSpy = jest
      .spyOn(context, "fillText")
      .mockImplementation(jest.fn());

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.each([
      [Layout.NORMAL, EFFECT_STYLES.vanilla],
      [Layout.SKILL, EFFECT_STYLES.skill],
      [Layout.SPELL, EFFECT_STYLES.backrow],
      [Layout.TRAP, EFFECT_STYLES.backrow],
      [Layout.DARK_SYNCHRO, EFFECT_STYLES.monster],
    ])(
      "should call fillText for each line in the paragraph",
      (layout, style) => {
        applyEffect({
          context,
          layout,
          text: "A card maker that supports the creation of Normal, Effect, Ritual, Fusion, Synchro, Dark Synchro, Xyz and Link monsters. It also provides support for creating Pendulum versions of some card types.",
        });

        expect(fillTextSpy).toBeCalledWith(
          "A card maker that supports the creation of Normal, Effect,",
          style.left,
          style.top
        );
        expect(fillTextSpy).toBeCalledWith(
          "Ritual, Fusion, Synchro, Dark Synchro, Xyz and Link",
          style.left,
          style.top + 13
        );
        expect(fillTextSpy).toBeCalledWith(
          "monsters. It also provides support for creating Pendulum",
          style.left,
          style.top + 26
        );
        expect(fillTextSpy).toBeCalledWith(
          "versions of some card types.",
          style.left,
          style.top + 39
        );
      }
    );
  });
});
