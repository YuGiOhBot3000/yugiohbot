import { registerFont } from "canvas";

export const registerFonts = () => {
  registerFont("assets/fonts/MatrixRegularSmallCaps.ttf", {
    family: "Matrix Regular Small Caps",
  });
  registerFont("assets/fonts/Heebo.ttf", { family: "Heebo" });
  registerFont("assets/fonts/SpectralSC-Regular.ttf", {
    family: "Spectral SC",
    weight: "regular",
  });
  registerFont("assets/fonts/SpectralSC-ExtraBold.ttf", {
    family: "Spectral SC",
    weight: "800",
  });
  registerFont("assets/fonts/Amiri-Italic.ttf", {
    family: "Amiri italic",
  });
  registerFont("assets/fonts/Spectral-Regular.ttf", {
    family: "Spectral",
  });
  registerFont("assets/fonts/CrimsonPro.ttf", {
    family: "Crimson Text",
  });
};
