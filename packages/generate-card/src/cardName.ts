import { CanvasRenderingContext2D } from "canvas";

import { CARD_NAME_STYLES, CARD_NAME_COLORS } from "./constants";
import { Layout, Rarities } from "./types";

type Props = {
  context: CanvasRenderingContext2D;
  name: string;
  layout: Layout;
  rarity: Rarities;
};

export const applyCardName = ({ context, name, layout, rarity }: Props) => {
  const type = layout === Layout.SKILL ? "skill" : "regular";
  const style = CARD_NAME_STYLES[type];

  let color: "white" | "silver" | "gold" | undefined = undefined;

  const darkLayouts = [
    Layout.DARK_SYNCHRO,
    Layout.LINK,
    Layout.SKILL,
    Layout.SPELL,
    Layout.TRAP,
    Layout.XYZ,
  ];
  if (darkLayouts.includes(layout)) color = "white";
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
