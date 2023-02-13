import { registerFont } from "canvas";

export const registerFonts = () => {
  registerFont("fonts/MatrixRegularSmallCaps.ttf", {
    family: "Matrix Regular Small Caps",
  });
  registerFont("fonts/Heebo.ttf", { family: "Heebo" });
  registerFont("fonts/SpectralSC-Regular.ttf", {
    family: "Spectral SC",
    weight: "regular",
  });
  registerFont("fonts/SpectralSC-ExtraBold.ttf", {
    family: "Spectral SC",
    weight: "800",
  });
  registerFont("fonts/Amiri-Italic.ttf", {
    family: "Amiri italic",
  });
  registerFont("fonts/Spectral-Regular.ttf", {
    family: "Spectral",
  });
  registerFont("fonts/CrimsonPro.ttf", {
    family: "Crimson Text",
  });
  registerFont("fonts/IDroid.otf", {
    family: "IDroid",
  });
};
