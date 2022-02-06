import canvas, { createCanvas, Image } from "canvas";

import { CARD_HEIGHT, CARD_WIDTH, TYPE_STYLES } from "../src/constants";

import { Icon, Layout } from "../src/types";
import { applyType } from "../src/type";

describe("Type", () => {
  describe("applyType", () => {
    const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
    const drawImageSpy = jest
      .spyOn(context, "drawImage")
      .mockImplementation(jest.fn());
    const fillTextSpy = jest
      .spyOn(context, "fillText")
      .mockImplementation(jest.fn());
    const loadImageSpy = jest.spyOn(canvas, "loadImage");

    beforeEach(() => {
      jest.clearAllMocks();

      loadImageSpy.mockResolvedValue({ image: true } as unknown as Image);
    });

    describe("given the layout is Normal", () => {
      it.each([[undefined], [Icon.CONTINUOUS]])(
        "should fillText with the correct styles",
        async (icon) => {
          await applyType({
            context,
            text: "Hello World",
            layout: Layout.NORMAL,
            icon,
          });

          expect(drawImageSpy).not.toBeCalled();
          expect(fillTextSpy).toBeCalledWith(
            "[ Hello World ]",
            TYPE_STYLES.monster.left,
            TYPE_STYLES.monster.top,
            TYPE_STYLES.monster.width
          );
          expect(context.font).toBe(
            `${TYPE_STYLES.monster.fontWeight} ${TYPE_STYLES.monster.fontSize}px ${TYPE_STYLES.monster.fontFamily}`
          );
        }
      );
    });

    describe("given the layout is Spell", () => {
      describe("given the icon is not provided", () => {
        it("should fillText with the correct styles", async () => {
          await applyType({
            context,
            text: "Hello World",
            layout: Layout.SPELL,
          });

          expect(drawImageSpy).not.toBeCalled();
          expect(fillTextSpy).toBeCalledWith(
            "[ Hello World ]",
            TYPE_STYLES.backrow.Type.left,
            TYPE_STYLES.backrow.Type.top,
            TYPE_STYLES.backrow.Type.width
          );
          expect(context.font).toBe(
            `${TYPE_STYLES.backrow.Type.fontWeight} ${TYPE_STYLES.backrow.Type.fontSize}px ${TYPE_STYLES.backrow.Type.fontFamily}`
          );
        });
      });

      describe("given the icon is provided", () => {
        it("should fillText with the correct styles", async () => {
          await applyType({
            context,
            text: "Hello World",
            layout: Layout.SPELL,
            icon: Icon.FIELD,
          });

          expect(fillTextSpy).toBeCalledWith(
            "[ Hello World",
            TYPE_STYLES.backrow.TypeWithIcon.left,
            TYPE_STYLES.backrow.TypeWithIcon.top,
            TYPE_STYLES.backrow.TypeWithIcon.width
          );

          expect(loadImageSpy).toBeCalledWith("assets/icon/Field.png");
          expect(drawImageSpy).toBeCalledWith(
            { image: true },
            TYPE_STYLES.backrow.Icon.left,
            TYPE_STYLES.backrow.Icon.top,
            TYPE_STYLES.backrow.Icon.width,
            TYPE_STYLES.backrow.Icon.height
          );

          expect(fillTextSpy).toBeCalledWith(
            " ]",
            TYPE_STYLES.backrow.TypeWithIconClosing.left,
            TYPE_STYLES.backrow.TypeWithIconClosing.top,
            TYPE_STYLES.backrow.TypeWithIconClosing.width
          );
        });
      });
    });
  });
});
