import { CanvasRenderingContext2D } from "canvas";

import { CARD_NAME_STYLES, CARD_NAME_COLORS } from "./constants";
import { Rarities } from "./types";

type Props = {
  context: CanvasRenderingContext2D;
  name: string;
  type: "regular" | "skill";
  rarity: Rarities;
};

export const applyCardName = ({ context, name, type, rarity }: Props) => {
  const style = CARD_NAME_STYLES[type];
  let color: "silver" | "gold" | undefined = undefined;
  if (rarity === Rarities.RARE || rarity === Rarities.SECRET) color = "silver";
  if (rarity === Rarities.ULTRA) color = "gold";

  const { highlight, base } = color
    ? CARD_NAME_COLORS[color]
    : CARD_NAME_COLORS.default;

  context.textBaseline = "top";
  context.globalCompositeOperation = "source-over";
  context.fillStyle = highlight.color;
  context.font = [
    style.fontStyle,
    style.fontWeight,
    style.fontSize + "px",
    style.fontFamily,
  ].join(" ");

  context.fillText(name, style.left - 1, style.top - 1, style.width);

  context.fillStyle = base.color;
  context.fillText(name, style.left, style.top, style.width);
};
