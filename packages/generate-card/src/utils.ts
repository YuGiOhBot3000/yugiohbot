import { CanvasRenderingContext2D } from "canvas";

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

export const createParagraphs = (
  context: CanvasRenderingContext2D,
  text: string,
  width: number
) => text.split("\n").map((p) => wrapParagraph(context, p, width));

type Style = {
  fontFamily: string;
  fontStyle: string;
  fontSize: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

export const resizeTextForParagraphs = (
  context: CanvasRenderingContext2D,
  text: string,
  style: Style
) => {
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

  return paragraphs;
};
