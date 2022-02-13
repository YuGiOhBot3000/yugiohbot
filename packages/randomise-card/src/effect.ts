type Props = {
  cardName: string;
  cardType: string;
  effect: string;
};

export const parseEffect = ({ cardName, cardType, effect }: Props) => {
  const cardEffect = effect.replace(
    /effect of '.*?'/gm,
    `effect of '${cardName}'`
  );

  const result = {
    pendulumEffect: "",
    cardEffect,
  };

  if (cardType.includes("pendulum")) {
    const parts = cardEffect
      .replace("\n", "")
      .replace(/-{2,}/gm, "")
      .replace("[ Pendulum Effect ]", "")
      .split(/(\[ Monster Effect \]|\[ Flavor Text \])/g);

    result.pendulumEffect = parts[0].trim();
    result.cardEffect = parts[parts.length - 1].trim();
  }

  return result;
};
