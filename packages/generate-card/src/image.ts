import { loadImage, CanvasRenderingContext2D } from "canvas";
import { STYLES } from "./constants";
import { Rarities } from "./types";

type Props = {
  context: CanvasRenderingContext2D;
  filename: string;
  pendulum: boolean;
  rarity: Rarities;
};

export const applyImage = async ({
  context,
  filename,
  pendulum,
  rarity,
}: Props) => {
  const image = await loadImage(filename);
  const style = pendulum ? STYLES.pendulum : STYLES.normal;

  context.drawImage(image, style.left, style.top, style.width, style.height);

  if (rarity === Rarities.SECRET || rarity === Rarities.ULTRA) {
    context.globalCompositeOperation = "color-dodge";
    const foilImage = await loadImage("assets/foil/Secret.png");
    context.drawImage(
      foilImage,
      style.left,
      style.top,
      style.width,
      style.height
    );
  }
};
