import canvas, { createCanvas, Image } from "canvas";

import { CARD_HEIGHT, CARD_WIDTH } from "../src/constants";
import { Layout } from "@yugiohbot/types";

import { applyLevel } from "../src/level";

describe("Level", () => {
  describe("applyLevel", () => {
    const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
    const drawImageSpy = jest
      .spyOn(context, "drawImage")
      .mockImplementation(jest.fn());
    const loadImageSpy = jest.spyOn(canvas, "loadImage");

    beforeEach(() => {
      jest.clearAllMocks();

      loadImageSpy.mockResolvedValue({ image: true } as unknown as Image);
    });

    describe.each([
      [Layout.LINK],
      [Layout.SKILL],
      [Layout.SPELL],
      [Layout.TRAP],
    ])("given a %s layout is provided", (layout) => {
      it("should not draw any images", async () => {
        await applyLevel({ context, level: 1, layout });

        expect(loadImageSpy).not.toBeCalled();
        expect(drawImageSpy).not.toBeCalled();
      });
    });

    describe.each([[-1], [0], [13]])(
      "given %d levels are provided",
      (level) => {
        it("should not draw any images", async () => {
          await applyLevel({ context, level, layout: Layout.NORMAL });

          expect(loadImageSpy).not.toBeCalled();
          expect(drawImageSpy).not.toBeCalled();
        });
      }
    );

    describe.each([
      [Layout.NORMAL, "Normal"],
      [Layout.DARK_SYNCHRO, "Negative"],
      [Layout.XYZ, "Xyz"],
    ])("given a %s layout is provided", (layout, star) => {
      it.each([[1], [12]])(
        "should load the image with %d levels",
        async (level) => {
          await applyLevel({ context, level, layout });

          expect(loadImageSpy).toBeCalledWith(`assets/star/${star}.png`);
          expect(drawImageSpy).toBeCalledTimes(level);
        }
      );
    });
  });
});
