import { CanvasRenderingContext2D } from "canvas";
import { EFFECT_STYLES } from "./constants";
import { Layout } from "./types";
import { resizeTextForParagraphs } from "./utils";

type Props = {
  context: CanvasRenderingContext2D;
  layout: Layout;
  text: string;
};

export const applyEffect = ({ context, layout, text }: Props) => {
  let style = EFFECT_STYLES.monster;

  switch (layout) {
    case Layout.NORMAL:
      style = EFFECT_STYLES.vanilla;
      break;
    case Layout.SKILL:
      style = EFFECT_STYLES.skill;
      break;
    case Layout.SPELL:
    case Layout.TRAP:
      style = EFFECT_STYLES.backrow;
      break;
    default:
      style = EFFECT_STYLES.monster;
      break;
  }

  context.fillStyle = "black";
  context.textAlign = "left";

  const paragraphs = resizeTextForParagraphs(context, text, style);

  let top = style.top;

  paragraphs.forEach((lines) => {
    lines.forEach((line) => {
      const textWidth = context.measureText(line).width;
      const scale = Math.min(style.width / Math.max(textWidth, 1), 1);
      context.scale(scale, 1);
      context.fillText(line, style.left, top);
      top += style.fontSize;
    });
  });
};
