import { CanvasRenderingContext2D } from "canvas";
import { PENDULUM_STYLES } from "./constants";
import { Layout, Pendulum } from "./types";
import { resizeTextForParagraphs } from "./utils";

type Props = {
  context: CanvasRenderingContext2D;
  layout: Layout;
  pendulum: Pendulum;
};

export const applyPendulum = ({ context, layout, pendulum }: Props) => {
  if (layout === Layout.SKILL) return;
  if (layout === Layout.UNITY) pendulum.enabled = true;

  const { enabled, red, blue, effect } = pendulum;

  if (!enabled) return;

  const paragraphs = resizeTextForParagraphs(
    context,
    effect,
    PENDULUM_STYLES.effect
  );

  context.fillStyle = "black";
  let top = PENDULUM_STYLES.effect.top;

  paragraphs.forEach((lines) => {
    lines.forEach((line) => {
      const textWidth = context.measureText(line).width;
      const scale = Math.min(
        PENDULUM_STYLES.effect.width / Math.max(textWidth, 1),
        1
      );
      context.scale(scale, 1);
      context.fillText(line, PENDULUM_STYLES.effect.left, top);
      top += PENDULUM_STYLES.effect.fontSize;
    });
  });

  context.textAlign = "center";
  context.font = [
    PENDULUM_STYLES.blue.fontSize + "px",
    PENDULUM_STYLES.blue.fontFamily,
  ].join(" ");
  context.fillText(
    blue.toString(),
    PENDULUM_STYLES.blue.left,
    PENDULUM_STYLES.blue.top,
    PENDULUM_STYLES.blue.width
  );

  context.font = [
    PENDULUM_STYLES.red.fontSize + "px",
    PENDULUM_STYLES.red.fontFamily,
  ].join(" ");
  context.fillText(
    red.toString(),
    PENDULUM_STYLES.red.left,
    PENDULUM_STYLES.red.top,
    PENDULUM_STYLES.red.width
  );
};
