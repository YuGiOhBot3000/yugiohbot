export enum FINE_TUNES {
  MONSTERS = "ada:ft-personal-2022-02-03-17-12-33",
  EFFECTS = "ada:ft-personal-2022-02-03-16-45-25",
  CARDS = "ada:ft-personal-2022-02-03-17-06-30",
}

export const MONSTERS = [
  "normal",
  "pendulum normal",
  "spirit",
  "toon",
  "tuner",
];

export const EFFECT_MONSTERS = [
  "effect",
  "flip effect",
  "pendulum effect",
  "ritual effect",
  "union effect",
];

export const CARDS = ["skill", "spell", "trap"];

export const CARD_TYPES = [...MONSTERS, ...EFFECT_MONSTERS, ...CARDS];
