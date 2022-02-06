import canvas, { createCanvas, Image } from "canvas";

import { CARD_HEIGHT, CARD_WIDTH, LINK_STYLE } from "../src/constants";
import { Layout, Link } from "@yugiohbot/types";

import { applyLink, applyLinkMarkers } from "../src/link";

describe("Links", () => {
  const context = createCanvas(CARD_WIDTH, CARD_HEIGHT).getContext("2d");
  const fillTextSpy = jest
    .spyOn(context, "fillText")
    .mockImplementation(jest.fn());
  jest.spyOn(context, "drawImage").mockImplementation(jest.fn());
  const loadImageSpy = jest.spyOn(canvas, "loadImage");

  beforeEach(() => {
    jest.clearAllMocks();

    loadImageSpy.mockResolvedValue({ image: true } as unknown as Image);
  });

  describe("applyLink", () => {
    it.each([Object.values(Layout).filter((l) => l !== Layout.LINK)])(
      "should not call fillText for the %s layout",
      (layout) => {
        applyLink({ context, layout, value: 5 });

        expect(fillTextSpy).not.toBeCalled();
      }
    );

    it("should call fillText for a Link layout", () => {
      applyLink({ context, layout: Layout.LINK, value: 5 });

      expect(context.textAlign).toBe("right");
      expect(context.font).toBe(
        `${LINK_STYLE.fontSize}px ${LINK_STYLE.fontFamily}`
      );
      expect(fillTextSpy).toBeCalledWith(
        "5",
        LINK_STYLE.left,
        LINK_STYLE.top,
        LINK_STYLE.width
      );
    });
  });

  describe("applyLinkMarkers", () => {
    const link: Link = {
      topLeft: true,
      topCenter: true,
      topRight: true,
      middleLeft: true,
      middleRight: true,
      bottomLeft: true,
      bottomCenter: true,
      bottomRight: true,
    };

    it.each([Object.values(Layout).filter((l) => l !== Layout.LINK)])(
      "should not call loadImage for the %s layout",
      (layout) => {
        applyLinkMarkers({ context, layout, pendulum: false, link });

        expect(loadImageSpy).not.toBeCalled();
      }
    );

    it("should load all the marker images", async () => {
      await applyLinkMarkers({
        context,
        layout: Layout.LINK,
        pendulum: false,
        link,
      });

      expect(loadImageSpy).toBeCalledWith("assets/marker/topLeft.png");
      expect(loadImageSpy).toBeCalledWith("assets/marker/topCenter.png");
      expect(loadImageSpy).toBeCalledWith("assets/marker/topRight.png");
      expect(loadImageSpy).toBeCalledWith("assets/marker/middleLeft.png");
      expect(loadImageSpy).toBeCalledWith("assets/marker/middleRight.png");
      expect(loadImageSpy).toBeCalledWith("assets/marker/bottomLeft.png");
      expect(loadImageSpy).toBeCalledWith("assets/marker/bottomCenter.png");
      expect(loadImageSpy).toBeCalledWith("assets/marker/bottomRight.png");
    });
  });
});
