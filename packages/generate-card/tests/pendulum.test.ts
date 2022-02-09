import { createCanvas } from "canvas";

import { CARD_HEIGHT, CARD_WIDTH, PENDULUM_STYLES } from "../src/constants";
import { Layout, Pendulum } from "@yugiohbot/types";

import { applyPendulum } from "../src/pendulum";

describe("Pendulum", () => {
  describe("applyPendulum", () => {
    const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
    const fillTextSpy = jest
      .spyOn(context, "fillText")
      .mockImplementation(jest.fn());

    const pendulum: Pendulum = {
      enabled: true,
      blue: 5,
      red: 10,
      effect: "mock effect",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should fillText for blue, red, and effect", () => {
      applyPendulum({ context, layout: Layout.NORMAL, pendulum });

      expect(fillTextSpy).toBeCalledTimes(3);
      expect(fillTextSpy).toBeCalledWith(
        "mock effect",
        PENDULUM_STYLES.effect.left,
        PENDULUM_STYLES.effect.top
      );
      expect(fillTextSpy).toBeCalledWith(
        "5",
        PENDULUM_STYLES.blue.left,
        PENDULUM_STYLES.blue.top,
        PENDULUM_STYLES.blue.width
      );
      expect(fillTextSpy).toBeCalledWith(
        "10",
        PENDULUM_STYLES.red.left,
        PENDULUM_STYLES.red.top,
        PENDULUM_STYLES.red.width
      );
    });

    describe("given the layout is SKILL", () => {
      it("should not draw any text", () => {
        applyPendulum({ context, layout: Layout.SKILL, pendulum });

        expect(fillTextSpy).not.toBeCalled();
      });
    });

    describe("given the layout is UNITY", () => {
      it("should draw text even if pendulum is disabled", () => {
        applyPendulum({
          context,
          layout: Layout.UNITY,
          pendulum: { ...pendulum, enabled: false },
        });

        expect(fillTextSpy).toBeCalledTimes(3);
      });
    });

    describe("given pendulum is disabled", () => {
      it("should not draw any text", () => {
        applyPendulum({
          context,
          layout: Layout.NORMAL,
          pendulum: { ...pendulum, enabled: false },
        });

        expect(fillTextSpy).not.toBeCalled();
      });
    });
  });
});
