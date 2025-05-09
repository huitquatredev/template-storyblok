import fs from "fs/promises";
import path from "path";
import StoryblokClient from "storyblok-js-client";

const storyblokApi = new StoryblokClient({
  accessToken: "nmeqwOQvt86ZpJFS7aoWyAtt",
  region: "eu", // Adjust region if needed
});

async function fetchAndSaveFavicons() {
  try {
    // Fetch theme data from Storyblok
    const { data } = await storyblokApi.get("cdn/stories/global/theme", {
      version: "draft", // Use 'draft' for preview mode
    });

    const favicons = [
      { url: data.story.content.faviconSvg.filename, name: "favicon.svg" },
      { url: data.story.content.faviconIco.filename, name: "favicon.ico" },
      {
        url: data.story.content.faviconAppleTouch.filename,
        name: "apple-touch-icon.png",
      },
      { url: data.story.content.favicon96.filename, name: "favicon-96x96.png" },
      {
        url: data.story.content.favicon192.filename,
        name: "web-app-manifest-192x192.png",
      },
      {
        url: data.story.content.favicon512.filename,
        name: "web-app-manifest-512x512.png",
      },
    ];

    if (!favicons || favicons.length === 0) {
      console.log("No favicon found in the theme.");
      return;
    }

    // Ensure the public/favicons directory exists
    const faviconDir = path.resolve("./public/favicons");
    await fs.mkdir(faviconDir, { recursive: true });

    // Download and save each favicon file
    for (const favicon of favicons) {
      const faviconUrl = favicon.url; // Assuming the font object has a `url` property
      const faviconFileName = favicon.name;

      const response = await fetch(faviconUrl);
      if (!response.ok) {
        console.error(`Failed to download favicon: ${faviconUrl}`);
        continue;
      }

      const faviconBuffer = await response.arrayBuffer();
      await fs.writeFile(
        path.join(faviconDir, faviconFileName),
        Buffer.from(faviconBuffer),
      );
      console.log(`Saved favicon: ${faviconFileName}`);
    }

    //Write the site.webmanifest
    try {
      // Ensure the output directory exists
      await fs.mkdir(faviconDir, { recursive: true });

      // Define the path for the site.webmanifest file
      const manifestPath = path.join(faviconDir, "site.webmanifest");

      // Convert the JavaScript object to a JSON string
      const manifestData = {
        name: data.story.content.brandName,
        short_name: data.story.content.brandName,
        icons: [
          {
            src: "/favicons/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/favicons/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        theme_color: data.story.content.primary,
        background_color: data.story.content.base,
        display: "standalone",
      };
      const manifestJson = JSON.stringify(manifestData, null, 2);

      // Write the JSON string to the site.webmanifest file
      await fs.writeFile(manifestPath, manifestJson, "utf-8");

      console.log(
        `site.webmanifest has been successfully written to ${manifestPath}`,
      );
    } catch (error) {
      console.error("Error writing site.webmanifest:", error);
    }

    console.log("All favicons have been downloaded and saved.");
  } catch (error) {
    console.error("Error fetching or saving favicon:", error);
  }
}

fetchAndSaveFavicons();
