import { CanvasRenderingContext2D } from "canvas";
import { STAT_STYLES } from "./constants";
import { Layout } from "@yugiohbot/types";

type Props = {
  context: CanvasRenderingContext2D;
  layout: Layout;
  value: number;
};

const applyStat = (
  context: CanvasRenderingContext2D,
  value: number,
  left: number
) => {
  context.fillStyle = "black";
  context.textAlign = "right";
  context.font = [STAT_STYLES.fontSize + "px", STAT_STYLES.fontFamily].join(
    " "
  );
  context.fillText(value.toString(), left, STAT_STYLES.top, STAT_STYLES.width);
};

export const applyAtk = ({ context, layout, value }: Props) => {
  const ignoredLayouts = [Layout.SKILL, Layout.SPELL, Layout.TRAP];
  if (ignoredLayouts.includes(layout)) return;

  applyStat(context, value, STAT_STYLES.atkLeft);
};

export const applyDef = ({ context, layout, value }: Props) => {
  const ignoredLayouts = [Layout.LINK, Layout.SKILL, Layout.SPELL, Layout.TRAP];
  if (ignoredLayouts.includes(layout)) return;

  applyStat(context, value, STAT_STYLES.defLeft);
};
