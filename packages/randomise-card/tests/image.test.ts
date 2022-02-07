import fs from "fs";
import { cropImage, getFromSPB, getRandomOfficialImage } from "../src/image";

describe("Image", () => {
  it("should crop a random image", async () => {
    const { url } = await getRandomOfficialImage();
    const buffer = await cropImage(url);

    fs.writeFileSync("test.png", buffer);
  });

  it("should get a random spb image", async () => {
    const url = await getFromSPB();

    expect(url.includes("https://www.shitpostbot.com/img/sourceimages"));
  });
});
