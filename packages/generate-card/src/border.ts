import { loadImage, CanvasRenderingContext2D } from "canvas";
import { CARD_HEIGHT, CARD_WIDTH } from "./constants";
import { Layout } from "./types";

type Props = {
  context: CanvasRenderingContext2D;
  layout: Layout;
  pendulum: boolean;
};

export const applyBorder = async ({ context, layout, pendulum }: Props) => {
  const filename = `./assets/border/${layout}${
    (pendulum && layout !== Layout.SKILL) || layout === Layout.UNITY
      ? ".pendulum"
      : ""
  }.png`;

  const image = await loadImage(filename);
  context.drawImage(image, 0, 0, CARD_WIDTH, CARD_HEIGHT);
};
