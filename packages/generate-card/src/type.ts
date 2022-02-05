import { loadImage, CanvasRenderingContext2D } from "canvas";
import { TYPE_STYLES } from "./constants";
import { Icon, Layout } from "./types";

type Props = {
  context: CanvasRenderingContext2D;
  text: string;
  layout: Layout;
  icon?: Icon;
};

export const applyType = async ({
  context,
  text,
  layout,
  icon = Icon.NONE,
}: Props) => {
  const backrowLayouts = [Layout.SPELL, Layout.TRAP];
  const type = backrowLayouts.includes(layout) ? "backrow" : "monster";
  context.fillStyle = "black";

  if (type === "monster") {
    const style = TYPE_STYLES.monster;

    context.textBaseline = "top";
    context.font = [
      style.fontWeight,
      style.fontSize + "px",
      style.fontFamily,
    ].join(" ");
    context.fillText(`[ ${text} ]`, style.left, style.top, style.width);
  } else {
    const style = TYPE_STYLES.backrow;
    context.textBaseline = "top";

    if (icon === Icon.NONE) {
      context.textAlign = "right";
      context.font = [
        style.Type.fontWeight,
        style.Type.fontSize + "px",
        style.Type.fontFamily,
      ].join(" ");
      context.fillText(
        `[ ${text} ]`,
        style.Type.left,
        style.Type.top,
        style.Type.width
      );
    } else {
      context.textAlign = "right";
      context.font = [
        style.TypeWithIcon.fontWeight,
        style.TypeWithIcon.fontSize + "px",
        style.TypeWithIcon.fontFamily,
      ].join(" ");
      context.fillText(
        `[ ${text}`,
        style.TypeWithIcon.left,
        style.TypeWithIcon.top,
        style.TypeWithIcon.width
      );

      const image = await loadImage(`assets/icon/${icon}.png`);
      context.drawImage(
        image,
        style.Icon.left,
        style.Icon.top,
        style.Icon.width,
        style.Icon.height
      );

      context.textAlign = "left";
      context.font = [
        style.TypeWithIconClosing.fontWeight,
        style.TypeWithIconClosing.fontSize + "px",
        style.TypeWithIconClosing.fontFamily,
      ].join(" ");
      context.fillText(
        " ]",
        style.TypeWithIconClosing.left,
        style.TypeWithIconClosing.top,
        style.TypeWithIconClosing.width
      );
    }
  }
};
