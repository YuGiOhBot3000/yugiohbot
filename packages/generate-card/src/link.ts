import { loadImage, CanvasRenderingContext2D } from "canvas";
import { LINK_MARKERS, LINK_STYLE } from "./constants";
import { Layout, Link } from "@yugiohbot/types";

type LinkProps = {
  context: CanvasRenderingContext2D;
  layout: Layout;
  value: number;
};

type LinkMarkerProps = {
  context: CanvasRenderingContext2D;
  layout: Layout;
  pendulum: boolean;
  link: Link;
};

export const applyLink = ({ context, layout, value }: LinkProps) => {
  if (layout !== Layout.LINK) return;

  context.textAlign = "right";
  context.font = [LINK_STYLE.fontSize + "px", LINK_STYLE.fontFamily].join(" ");
  context.fillText(
    value.toString(),
    LINK_STYLE.left,
    LINK_STYLE.top,
    LINK_STYLE.width
  );
};

export const applyLinkMarkers = async ({
  context,
  layout,
  pendulum,
  link,
}: LinkMarkerProps) => {
  if (layout !== Layout.LINK) return;

  const positioning = pendulum ? LINK_MARKERS.pendulum : LINK_MARKERS.regular;
  const entries = Object.entries(link);

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];

    if (value) {
      const pos = positioning[key as keyof Link];
      const image = await loadImage(`assets/marker/${key}.png`);
      context.drawImage(image, pos.left, pos.top, pos.width, pos.height);
    }
  }
};
