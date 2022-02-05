import canvas, { createCanvas, Image } from "canvas";

import { CARD_HEIGHT, CARD_WIDTH } from "../src/constants";
import { Layout } from "../src/types";

import { applyBorder } from "../src/border";

describe("Border", () => {
  describe("applyBorder", () => {
    const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
    const drawImageSpy = jest
      .spyOn(context, "drawImage")
      .mockImplementation(jest.fn());
    const loadImageSpy = jest.spyOn(canvas, "loadImage");

    beforeEach(() => {
      jest.clearAllMocks();

      loadImageSpy.mockResolvedValue({ image: true } as unknown as Image);
    });

    const testCases = Object.values(Layout).reduce(
      (acc, value) =>
        acc.concat(
          {
            layout: value,
            pendulum: false,
            expected: `./assets/border/${value}.png`,
          },
          {
            layout: value,
            pendulum: true,
            expected: `./assets/border/${value}.pendulum.png`,
          }
        ),
      [] as { layout: Layout; pendulum: boolean; expected: string }[]
    );

    it.each(testCases)(
      "should load an image from $expected",
      async ({ layout, pendulum, expected }) => {
        await applyBorder({ context, layout, pendulum });

        expect(loadImageSpy).toBeCalledWith(expected);
        expect(drawImageSpy).toBeCalledWith(
          { image: true },
          0,
          0,
          CARD_WIDTH,
          CARD_HEIGHT
        );
      }
    );
  });
});
