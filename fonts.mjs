import fs from "fs/promises";
import path from "path";
import StoryblokClient from "storyblok-js-client";

const storyblokApi = new StoryblokClient({
  accessToken: "nmeqwOQvt86ZpJFS7aoWyAtt",
  region: "eu", // Adjust region if needed
});

async function fetchAndSaveFonts() {
  try {
    // Fetch theme data from Storyblok
    const { data } = await storyblokApi.get("cdn/stories/global/theme", {
      version: "draft", // Use 'draft' for preview mode
    });

    const fonts = data.story.content.fonts;

    if (!fonts || fonts.length === 0) {
      console.log("No fonts found in the theme.");
      return;
    }

    // Ensure the public/fonts directory exists
    const fontsDir = path.resolve("./public/fonts");
    await fs.mkdir(fontsDir, { recursive: true });

    // Download and save each font file
    for (const font of fonts) {
      const fontUrl = font.url; // Assuming the font object has a `url` property
      const fontFileName = font.nom + ".woff2";

      const response = await fetch(fontUrl);
      if (!response.ok) {
        console.error(`Failed to download font: ${fontUrl}`);
        continue;
      }

      const fontBuffer = await response.arrayBuffer();
      await fs.writeFile(
        path.join(fontsDir, fontFileName),
        Buffer.from(fontBuffer),
      );
      console.log(`Saved font: ${fontFileName}`);
    }

    console.log("All fonts have been downloaded and saved.");
  } catch (error) {
    console.error("Error fetching or saving fonts:", error);
  }
}

fetchAndSaveFonts();
