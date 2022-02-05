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

      left: 40,
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
