import { loadImage, CanvasRenderingContext2D } from "canvas";
import { STYLES } from "./constants";
import { Layout, Rarity } from "@yugiohbot/types";

type Props = {
  context: CanvasRenderingContext2D;
  filename: string;
  pendulum: boolean;
  rarity: Rarity;
  layout: Layout;
};

export const applyImage = async ({
  context,
  filename,
  pendulum,
  rarity,
  layout,
}: Props) => {
  const image = await loadImage(filename);
  const style =
    pendulum || layout === Layout.UNITY ? STYLES.pendulum : STYLES.normal;

  context.drawImage(image, style.left, style.top, style.width, style.height);

  if (rarity === Rarity.SECRET || rarity === Rarity.ULTRA) {
    context.save();
    context.globalCompositeOperation = "color-dodge";
    const foilImage = await loadImage("assets/foil/Secret.png");
    context.drawImage(
      foilImage,
      style.left,
      style.top,
      style.width,
      style.height
    );
    context.restore();
  }
};
