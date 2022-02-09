import { CanvasRenderingContext2D } from "canvas";
import { COPYRIGHT_STYLE, ID_STYLES, SERIAL_STYLES } from "./constants";
import { Layout } from "@yugiohbot/types";

type Props = {
  context: CanvasRenderingContext2D;
  layout: Layout;
  pendulum: boolean;
  value: string;
};

export const applySerial = ({ context, layout, pendulum, value }: Props) => {
  let color = "black";

  if (
    layout === Layout.SKILL ||
    ((layout == Layout.DARK_SYNCHRO || layout == Layout.XYZ) && pendulum)
  )
    color = "white";

  context.textAlign = "left";
  context.fillStyle = color;
  context.font = [SERIAL_STYLES.fontSize + "px", SERIAL_STYLES.fontFamily].join(
    " "
  );
  context.fillText(
    value,
    SERIAL_STYLES.left,
    SERIAL_STYLES.top,
    SERIAL_STYLES.width
  );
};

export const applyId = ({ context, layout, pendulum, value }: Props) => {
  let color = "black";
  let style = {
    ...ID_STYLES.shared,
    ...ID_STYLES.regular,
  };

  const pendulumLayouts = [
    Layout.DARK_SYNCHRO,
    Layout.EFFECT,
    Layout.FUSION,
    Layout.NORMAL,
    Layout.RITUAL,
    Layout.SPELL,
    Layout.SYNCHRO,
    Layout.TOKEN,
    Layout.TRAP,
    Layout.XYZ,
  ];

  if (
    (pendulumLayouts.includes(layout) && pendulum) ||
    layout === Layout.UNITY
  ) {
    style = {
      ...ID_STYLES.shared,
      ...ID_STYLES.pendulum,
    };

    color = ID_STYLES.pendulum.color;
  }

  if (
    layout === Layout.SKILL ||
    ((layout == Layout.DARK_SYNCHRO || layout == Layout.XYZ) && pendulum)
  ) {
    color = "white";
  }

  if (layout === Layout.LINK) {
    style = pendulum
      ? {
          ...ID_STYLES.shared,
          ...ID_STYLES.pendulum,
        }
      : {
          ...ID_STYLES.shared,
          ...ID_STYLES.link,
        };
  }

  context.fillStyle = color;
  context.textAlign = style.textAlign as CanvasTextAlign;
  context.font = [style.fontSize + "px", style.fontFamily].join(" ");
  context.fillText(value, style.left, style.top, style.width);
};

export const applyCopyright = ({ context, layout, pendulum, value }: Props) => {
  let color = "black";

  const pendulumLayouts = [Layout.DARK_SYNCHRO, Layout.XYZ];

  if (
    (pendulumLayouts.includes(layout) && pendulum) ||
    layout === Layout.SKILL
  ) {
    color = "white";
  }

  context.fillStyle = color;
  context.textAlign = "right";
  context.font = [
    COPYRIGHT_STYLE.fontSize + "px",
    COPYRIGHT_STYLE.fontFamily,
  ].join(" ");
  context.fillText(
    value,
    COPYRIGHT_STYLE.left,
    COPYRIGHT_STYLE.top,
    COPYRIGHT_STYLE.width
  );
};
