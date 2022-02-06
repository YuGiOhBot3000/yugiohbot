import { loadImage, CanvasRenderingContext2D } from "canvas";
import { ATTRIBUTE_STYLE } from "./constants";
import { Attribute, Layout } from "@yugiohbot/types";

type Props = {
  context: CanvasRenderingContext2D;
  attribute: Attribute;
  layout: Layout;
};

export const applyAttribute = async ({ context, attribute, layout }: Props) => {
  if (layout === Layout.SKILL || attribute === Attribute.NONE) return;

  const image = await loadImage(`assets/attribute/${attribute}.png`);
  context.drawImage(
    image,
    ATTRIBUTE_STYLE.left,
    ATTRIBUTE_STYLE.top,
    ATTRIBUTE_STYLE.width,
    ATTRIBUTE_STYLE.height
  );
};
