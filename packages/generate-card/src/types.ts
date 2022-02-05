export type Pendulum = {
  enabled: boolean;
  effect: string;
  blue: number;
  red: number;
};

export type Link = {
  topLeft: boolean;
  topCenter: boolean;
  topRight: boolean;
  middleLeft: boolean;
  middleRight: boolean;
  bottomLeft: boolean;
  bottomCenter: boolean;
  bottomRight: boolean;
};

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

export enum Rarities {
  COMMON = "Common",
  RARE = "Rare",
  ULTRA = "Ultra",
  SECRET = "Secret",
}

export type Event = {
  name: string;
  image: string;
  level: number;
  type?: string;
  effect?: string;
  atk?: number;
  def?: number;
  serial?: string;
  copyright?: "© 1993 YEMACHU";
  attribute: Attribute;
  id?: string;
  pendulum: Pendulum;
  link?: Link;
  layout: Layout;
  rarity: Rarities;
};
