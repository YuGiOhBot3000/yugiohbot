export const parseEffect = (cardType: string, effect: string) => {
  const result = {
    pendulumEffect: "",
    cardEffect: effect,
  };

  if (cardType.includes("pendulum")) {
    const parts = effect
      .replace("\n", "")
      .replace(/-{2,}/gm, "")
      .replace("[ Pendulum Effect ]", "")
      .split(/(\[ Monster Effect \]|\[ Flavor Text \])/g);

    result.pendulumEffect = parts[0].trim();
    result.cardEffect = parts[parts.length - 1].trim();
  }

  return result;
};
