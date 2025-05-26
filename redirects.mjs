import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import StoryblokClient from "storyblok-js-client";

const storyblokApi = new StoryblokClient({
  accessToken: process.env.STORYBLOK_TOKEN,
  region: "eu", // Adjust region if needed
});

// [[redirects]]
//   from = "/*"
//   to = "404.html"
//   status = 404

async function fetchAndSaveRedirects() {
  try {
    // Fetch theme data from Storyblok
    const { data } = await storyblokApi.get("cdn/stories/global/redirects", {
      version: "draft", // Use 'draft' for preview mode
    });

    if (!data || data.length === 0) {
      console.log("No redirect found.");
    }

    let content = "/* 404.html 404";
    content += "\n";

    // Download and save each redirect
    for (const redirect of data.story.content.redirects) {
      content += `${redirect.from} ${redirect.to} ${redirect.code ? redirect.code : "301"}${redirect.force ? "!" : ""}`;
      content += "\n";
    }
    console.log("Redirects saved");

    try {
      // Ensure the output directory exists
      const redirectDir = path.resolve("./public");
      await fs.mkdir(redirectDir, { recursive: true });

      // Define the path for the _redirects file
      const redirectsPath = path.join(redirectDir, "_redirects");

      fs.appendFile("dist/_redirects", content, (err) => {
        if (err) throw err;
        console.log(`Nouvelles redirections ajoutées`);
      });
    } catch (error) {
      console.error("Error writing _redirects", error);
    }

    console.log("All redirects have been writed.");
  } catch (error) {
    console.error("Error fetching or saving redirects:", error);
  }
}

fetchAndSaveRedirects();
