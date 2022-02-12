import { randomInt, roundUp } from "./utils";

export const chooseStats = (level: number) => {
  const choose = () => {
    switch (level) {
      case 0:
        return {
          atk: 0,
          def: 0,
        };
      case 1:
        return {
          atk: randomInt(0, 500),
          def: randomInt(0, 500),
        };
      case 2:
        return {
          atk: randomInt(0, 1000),
          def: randomInt(0, 1000),
        };
      case 3:
        return {
          atk: randomInt(0, 1750),
          def: randomInt(0, 1750),
        };
      case 4:
        return {
          atk: randomInt(0, 2000),
          def: randomInt(0, 2000),
        };
      case 5:
      case 6:
        return {
          atk: randomInt(0, 2600),
          def: randomInt(0, 2600),
        };
      case 7:
      case 8:
        return {
          atk: randomInt(0, 3000),
          def: randomInt(0, 3000),
        };
      case 9:
      case 10:
        return {
          atk: randomInt(0, 4000),
          def: randomInt(0, 4000),
        };
      case 11:
      case 12:
        return {
          atk: randomInt(0, 5000),
          def: randomInt(0, 5000),
        };
      default:
        return {
          atk: 0,
          def: 0,
        };
    }
  };

  const stats = choose();

  return {
    atk: roundUp(stats.atk, 100),
    def: roundUp(stats.def, 100),
  };
};
