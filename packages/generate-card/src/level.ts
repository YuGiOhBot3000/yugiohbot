import { loadImage, CanvasRenderingContext2D } from "canvas";
import { STAR_STYLES, MAX_LEVEL } from "./constants";
import { Layout } from "@yugiohbot/types";

type Star = "Normal" | "Negative" | "Xyz";

type Props = {
  context: CanvasRenderingContext2D;
  level: number;
  layout: Layout;
};

export const applyLevel = async ({ context, level, layout }: Props) => {
  const withoutLevels = [Layout.LINK, Layout.SKILL, Layout.SPELL, Layout.TRAP];
  if (withoutLevels.includes(layout)) return;
  if (level <= 0 || level > MAX_LEVEL) return;

  let star: Star = "Normal";
  if (layout === Layout.DARK_SYNCHRO) star = "Negative";
  if (layout === Layout.XYZ) star = "Xyz";

  const image = await loadImage(`assets/star/${star}.png`);

  const spacing =
    (STAR_STYLES.level12.maxWidth - MAX_LEVEL * STAR_STYLES.level12.width) /
    MAX_LEVEL;
  const style = level < 12 ? STAR_STYLES.level1 : STAR_STYLES.level12;
  const width = style.maxWidth - (style.width + spacing);

  for (let i = 0; i < level; i++) {
    context.drawImage(
      image,
      style.left + width + -1 * i * (style.width + spacing),
      style.top,
      style.width,
      style.height
    );
  }
};
