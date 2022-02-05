import { CanvasRenderingContext2D } from "canvas";
import { EFFECT_STYLES } from "./constants";
import { Layout } from "./types";

type Props = {
  context: CanvasRenderingContext2D;
  layout: Layout;
  text: string;
};

const createParagraphs = (
  context: CanvasRenderingContext2D,
  text: string,
  width: number
) => text.split("\n").map((p) => wrapParagraph(context, p, width));

const wrapParagraph = (
  context: CanvasRenderingContext2D,
  paragraph: string,
  availableWidth: number
) => {
  const words = paragraph.split(" ").filter((word) => word.length > 0);
  const lines: string[] = [];

  const spaceWidth = context.measureText(" ").width;
  let line = { width: -spaceWidth, words: [] as string[] };

  words.forEach((word) => {
    const wordWidth = context.measureText(word).width;

    if (line.width + wordWidth + spaceWidth < availableWidth) {
      line.width += wordWidth + spaceWidth;
      line.words[line.words.length] = word;
    } else {
      if (line.words.length > 0) {
        lines[lines.length] = line.words.join(" ");
      }
      line = { width: wordWidth, words: [word] };
    }
  });

  lines[lines.length] = line.words.join(" ");
  return lines;
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

  let paragraphs: string[][];

  do {
    const fontArray = [style.fontSize + "px", style.fontFamily];
    if (style.fontStyle) fontArray.push(style.fontStyle);

    context.font = fontArray.join(" ");

    paragraphs = createParagraphs(context, text, style.width);

    // Calculate the height of the text, as it is needed for determining
    // whether the text should shrink or not.
    const height =
      style.fontSize *
      paragraphs.reduce(function (accumulator, current) {
        return accumulator + current.length;
      }, 0);

    // If no height is provided, there is no need to shrink the text.
    // The same applies if the text would fit naturally.
    if (style.height === undefined || height < style.height) {
      break;
    }

    // Lower the font size and try again.
    style.fontSize -= 0.25;
  } while (style.fontSize > 0);

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
