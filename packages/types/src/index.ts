export type Pendulum = {
  enabled: boolean;
  effect: string;
  blue: number;
  red: number;
};

export interface Link {
  topLeft?: boolean;
  topCenter?: boolean;
  topRight?: boolean;
  middleLeft?: boolean;
  middleRight?: boolean;
  bottomLeft?: boolean;
  bottomCenter?: boolean;
  bottomRight?: boolean;
}

export enum Attribute {
  NONE = "None",
  DARK = "Dark",
  DIVINE = "Divine",
  EARTH = "Earth",
  FIRE = "Fire",
  LIGHT = "Light",
  WATER = "Water",
  WIND = "Wind",
  SPELL = "Spell",
  TRAP = "Trap",
}

export enum Layout {
  NORMAL = "Normal",
  EFFECT = "Effect",
  RITUAL = "Ritual",
  FUSION = "Fusion",
  SYNCHRO = "Synchro",
  XYZ = "Xyz",
  LINK = "Link",
  TOKEN = "Token",
  SPELL = "Spell",
  TRAP = "Trap",
  SKILL = "Skill",
  DARK_SYNCHRO = "DarkSynchro",
  UNITY = "Unity",
}

export enum Rarity {
  COMMON = "Common",
  RARE = "Rare",
  ULTRA = "Ultra",
  SECRET = "Secret",
}

export enum Icon {
  NONE = "None",
  CONTINUOUS = "Continuous",
  COUNTER = "Counter",
  EQUIP = "Equip",
  FIELD = "Field",
  QUICK_PLAY = "Quick-play",
  RITUAL = "Ritual",
}

export enum Race {
  AQUA = "Aqua",
  BEAST = "Beast",
  BEAST_WARROR = "Beast-Warrior",
  CREATOR_GOD = "Creator-God",
  CYBERSE = "Cyberse",
  DINOSAUR = "Dinosaur",
  DIVINE_BEAST = "Divine-Beast",
  DRAGON = "Dragon",
  FAIRY = "Fairy",
  FIEND = "Fiend",
  FISH = "Fish",
  INSECT = "Insect",
  MACHINE = "Machine",
  PLANT = "Plant",
  PSYCHIC = "Psychic",
  PYRO = "Pyro",
  REPTILE = "Reptile",
  ROCK = "Rock",
  SEA_SERPENT = "Sea Serpent",
  SPELLCASTER = "Spellcaster",
  THUNDER = "Thunder",
  WARRIOR = "Warrior",
  WINGED_BEAST = "Winged Beast",
}

export type Card = {
  name: string;
  image: string;
  level: number;
  type: string;
  icon: Icon;
  effect: string;
  atk: number;
  def: number;
  serial: string;
  copyright: string;
  attribute: Attribute;
  id: string;
  pendulum: Pendulum;
  link: Link;
  layout: Layout;
  rarity: Rarity;
};
