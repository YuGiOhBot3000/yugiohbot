import { createCanvas } from "canvas";

import {
  CARD_HEIGHT,
  CARD_WIDTH,
  COPYRIGHT_STYLE,
  ID_STYLES,
  SERIAL_STYLES,
} from "../src/constants";

import { Layout } from "../src/types";
import { applySerial, applyId, applyCopyright } from "../src/cardInfo";

describe("Card Info", () => {
  const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
  const fillTextSpy = jest
    .spyOn(context, "fillText")
    .mockImplementation(jest.fn());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("applySerial", () => {
    it.each([
      [Layout.NORMAL, false, "#000000"],
      [Layout.NORMAL, true, "#000000"],
      [Layout.SKILL, false, "#ffffff"],
      [Layout.DARK_SYNCHRO, false, "#000000"],
      [Layout.DARK_SYNCHRO, true, "#ffffff"],
      [Layout.XYZ, false, "#000000"],
      [Layout.XYZ, true, "#ffffff"],
    ])(
      "should fillText in a %s layout with pendulum %b",
      (layout, pendulum, color) => {
        applySerial({ context, layout, pendulum, value: "12345678" });

        expect(context.fillStyle).toBe(color);
        expect(fillTextSpy).toBeCalledWith(
          "12345678",
          SERIAL_STYLES.left,
          SERIAL_STYLES.top,
          SERIAL_STYLES.width
        );
      }
    );
  });

  describe("applyId", () => {
    describe("given pendulum is disabled", () => {
      it.each([
        [Layout.NORMAL, "#000000", ID_STYLES.regular],
        [Layout.SKILL, "#ffffff", ID_STYLES.regular],
        [Layout.DARK_SYNCHRO, "#000000", ID_STYLES.regular],
        [Layout.UNITY, "#000000", ID_STYLES.pendulum],
        [Layout.LINK, "#000000", ID_STYLES.link],
      ])("should fillText in a %s layout", (layout, color, style) => {
        applyId({ context, layout, pendulum: false, value: "123" });

        expect(context.fillStyle).toBe(color);
        expect(fillTextSpy).toBeCalledWith(
          "123",
          style.left,
          style.top,
          style.width
        );
      });
    });

    describe("given pendulum is enabled", () => {
      it.each([
        [Layout.NORMAL, "#000000", ID_STYLES.pendulum],
        [Layout.SKILL, "#ffffff", ID_STYLES.regular],
        [Layout.DARK_SYNCHRO, "#ffffff", ID_STYLES.pendulum],
        [Layout.XYZ, "#ffffff", ID_STYLES.pendulum],
        [Layout.UNITY, "#000000", ID_STYLES.pendulum],
        [Layout.LINK, "#000000", ID_STYLES.pendulum],
      ])("should fillText in a %s layout", (layout, color, style) => {
        applyId({ context, layout, pendulum: true, value: "123" });

        expect(context.fillStyle).toBe(color);
        expect(fillTextSpy).toBeCalledWith(
          "123",
          style.left,
          style.top,
          style.width
        );
      });
    });
  });

  describe("applyCopyright", () => {
    it.each([
      [Layout.NORMAL, true, "#000000"],
      [Layout.NORMAL, false, "#000000"],
      [Layout.SKILL, true, "#ffffff"],
      [Layout.SKILL, false, "#ffffff"],
      [Layout.DARK_SYNCHRO, true, "#ffffff"],
      [Layout.DARK_SYNCHRO, false, "#000000"],
      [Layout.XYZ, true, "#ffffff"],
      [Layout.XYZ, false, "#000000"],
    ])(
      "should fillText in a %s layout with pendulum %s",
      (layout, pendulum, color) => {
        applyCopyright({ context, layout, pendulum, value: "copyright" });

        expect(context.fillStyle).toBe(color);
        expect(fillTextSpy).toBeCalledWith(
          "copyright",
          COPYRIGHT_STYLE.left,
          COPYRIGHT_STYLE.top,
          COPYRIGHT_STYLE.width
        );
      }
    );
  });
});
