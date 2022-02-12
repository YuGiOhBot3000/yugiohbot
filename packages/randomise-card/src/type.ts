import { Race } from "@yugiohbot/types";
import { capitalizeFirstLetter, randomElement } from "@yugiohbot/utils";

export const createType = (base: string) => {
  const race = randomElement<Race>(Object.values(Race));

  if (base === "spell" || base === "trap") {
    return `${capitalizeFirstLetter(base)} Card`;
  } else if (base !== "normal") {
    return [race, ...base.split(" ")].map(capitalizeFirstLetter).join(" / ");
  } else {
    return race;
  }
};
