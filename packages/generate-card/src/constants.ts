export const CARD_WIDTH = 420;

export const CARD_HEIGHT = 610;

export const STYLES = {
  normal: {
    left: 50,
    top: 110,
    width: 320,
    height: 320,
  },
  pendulum: {
    left: 30,
    top: 110,
    width: 360,
    height: 360,
  },
};

export const ATTRIBUTE_STYLE = {
  left: 350,
  top: 28,
  width: 40,
  height: 40,
};

export const MAX_LEVEL = 12;

export const STAR_STYLES = {
  level1: {
    left: 43, // (420 - width) / 2
    top: 73, // Measured from the image.

    width: 28, // Width of a star.
    height: 28, // Height of a star.
    maxWidth: 334, // Max width of the total number of stars.
  },
  level12: {
    left: 35, // (420 - width) / 2
    top: 73, // Measured from the image.

    width: 28, // Width of a star.
    height: 28, // Height of a star.
    maxWidth: 350, // Max width of the total number of stars.
  },
};

export const CARD_NAME_STYLES = {
  regular: {
    fontFamily: "Matrix Regular Small Caps",
    fontSize: 48,
    fontStyle: "normal",
    fontWeight: 600,

    left: 32,
    top: 28,
    width: 315,
  },
  skill: {
    fontFamily: "Heebo",
    fontSize: 32,
    fontStyle: "normal",
    fontWeight: 500,

    left: 32,
    top: 22,
    width: 315,
  },
};

export const CARD_NAME_COLORS = {
  default: { highlight: { color: "transparent" }, base: { color: "#000000" } },
  white: { highlight: { color: "transparent" }, base: { color: "#ffffff" } },
  silver: { highlight: { color: "#b6b6b6" }, base: { color: "#1e1e1e" } },
  gold: { highlight: { color: "#d3b146" }, base: { color: "#4e3518" } },
};

export const TYPE_STYLES = {
  monster: {
    fontFamily: "Spectral SC",
    fontSize: 16,
    fontWeight: 800,

    left: 35,
    top: 458,
    width: 350,
  },
  backrow: {
    Icon: {
      left: 420 - 24 - 50,
      top: 74,
      width: 24,
      height: 24,
    },
    Type: {
      fontFamily: "Spectral SC",
      fontSize: 16,
      fontWeight: 800,

      left: 420 - 40,
      top: 75,
      width: 340,
      height: 20,
    },
    TypeWithIcon: {
      fontFamily: "Spectral SC",
      fontSize: 16,
      fontWeight: 800,

      left: 420 - 24 /*width of icon*/ - 55,
      top: 75,
      width: 420 - 24 /*width of icon*/ - 50 /**/ - 40,
    },
    TypeWithIconClosing: {
      fontFamily: "Spectral SC",
      fontSize: 16,
      fontWeight: 800,

      left: 420 - 50,
      top: 75,
      width: 10,
    },
  },
};

export const EFFECT_STYLES = {
  monster: {
    fontFamily: "Spectral",
    fontStyle: "",
    fontSize: 13,

    left: 35,
    top: 475,
    width: 350,
    height: 75,
  },
  backrow: {
    fontFamily: "Spectral",
    fontStyle: "",
    fontSize: 13,

    left: 35,
    top: 460,
    width: 350,
    height: 110,
  },
  vanilla: {
    fontFamily: "Amiri",
    fontStyle: "italic",
    fontSize: 13,

    left: 35,
    top: 475,
    width: 350,
    height: 75,
  },
  skill: {
    fontFamily: "Spectral",
    fontStyle: "",
    fontSize: 13,

    left: 35,
    top: 475,
    width: 350,
    height: 95,
  },
};

export const STAT_STYLES = {
  fontFamily: "Crimson Text",
  fontSize: 18,

  atkLeft: 300,
  defLeft: 385,
  top: 551,
  width: 40,
};

export const SERIAL_STYLES = {
  fontFamily: "Spectral",
  fontSize: 12,

  left: 20,
  top: 580,
  width: 150,
};

export const ID_STYLES = {
  shared: {
    fontFamily: "Spectral",
    fontSize: 12,
  },
  regular: {
    textAlign: "right",
    left: 370,
    top: 435,
    width: 80,
  },
  pendulum: {
    color: "black",
    textAlign: "left",
    left: 35,
    top: 555,
    width: 80,
  },
  link: {
    textAlign: "right",
    left: 325,
    top: 437,
    width: 80,
  },
};

export const COPYRIGHT_STYLE = {
  fontFamily: "Spectral",
  fontSize: 12,

  left: 380,
  top: 580,
  width: 150,
};

export const PENDULUM_STYLES = {
  effect: {
    fontFamily: "Spectral",
    fontStyle: "",
    fontSize: 13,

    left: 65,
    top: 385,
    width: 290,
    height: 70,
  },
  blue: {
    fontFamily: "Crimson Text",
    fontStyle: "",
    fontSize: 28,
    fontWeight: 600,

    left: 43,
    top: 410,
    width: 23,
    height: 30,
  },
  red: {
    fontFamily: "Crimson Text",
    fontStyle: "",
    fontSize: 28,
    fontWeight: 600,

    left: 375,
    top: 410,
    width: 23,
    height: 30,
  },
};

export const LINK_STYLE = {
  fontFamily: "IDroid",
  fontSize: 16,

  left: 385,
  top: 552,
  width: 15,
};

export const LINK_MARKERS = {
  regular: {
    topLeft: {
      top: 95,
      left: 32,
      width: 42,
      height: 42,
    },
    topCenter: {
      top: 86,
      left: 420 / 2 - 72 / 2,
      width: 72,
      height: 25,
    },
    topRight: {
      top: 95,
      left: 420 - 32 - 42,
      width: 42,
      height: 42,
    },
    middleLeft: {
      top: 235,
      left: 26,
      width: 25,
      height: 72,
    },
    middleRight: {
      top: 235,
      left: 420 - 26 - 25,
      width: 25,
      height: 72,
    },
    bottomLeft: {
      top: 402,
      left: 32,
      width: 42,
      height: 42,
    },
    bottomCenter: {
      top: 428,
      left: 420 / 2 - 72 / 2,
      width: 72,
      height: 25,
    },
    bottomRight: {
      top: 402,
      left: 420 - 32 - 42,
      width: 42,
      height: 42,
    },
  },
  pendulum: {
    topLeft: {
      top: 95,
      left: 16,
      width: 42,
      height: 42,
    },
    topCenter: {
      top: 86,
      left: 420 / 2 - 72 / 2,
      width: 72,
      height: 25,
    },
    topRight: {
      top: 95,
      left: 420 - 16 - 42,
      width: 42,
      height: 42,
    },
    middleLeft: {
      top: 302,
      left: 6,
      width: 25,
      height: 72,
    },
    middleRight: {
      top: 302,
      left: 420 - 6 - 25,
      width: 25,
      height: 72,
    },
    bottomLeft: {
      top: 610 - 23 - 42,
      left: 16,
      width: 42,
      height: 42,
    },
    bottomCenter: {
      top: 610 - 13 - 25,
      left: 420 / 2 - 72 / 2,
      width: 72,
      height: 25,
    },
    bottomRight: {
      top: 610 - 23 - 42,
      left: 420 - 16 - 42,
      width: 42,
      height: 42,
    },
  },
};
