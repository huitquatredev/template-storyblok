// @ts-check
import { defineConfig } from "astro/config";
import { storyblok } from "@storyblok/astro";
import { loadEnv } from "vite";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import StoryblokClient from "storyblok-js-client";

const env = loadEnv("", process.cwd(), "STORYBLOK");
//TODO : change site url
const siteurl = "https://jcchevalier-production.netlify.app";

// 1. Initialize the Client with the token
const Storyblok = new StoryblokClient({
  accessToken: env.STORYBLOK_TOKEN,
  region: "eu", // Region in which the space was created
  // Possible values: "ap", "eu", "us", "ca", "cn" (Default: "eu")
});

// 2. Retrieve stories
const storyblokStories = await Storyblok.get("cdn/stories", {
  version: "published",
});

// 3. Format the data
const filteredUrls = [];
storyblokStories.data.stories.map((story) => {
  if (story.content?.sitemap === false) {
    filteredUrls.push(siteurl + "/" + story.full_slug + "/");
  }
});

// https://astro.build/config
export default defineConfig({
  output: env.STORYBLOK_IS_PREVIEW === "yes" ? "server" : "static",
  adapter: netlify(),
  integrations: [
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      bridge: env.STORYBLOK_IS_PREVIEW === "yes",
      components: {
        page: "storyblok/Page",
        theme: "storyblok/global/Theme",
        hero: "storyblok/Hero",
        featureSimple: "storyblok/FeatureSimple",
        featureGalleryIcons: "storyblok/FeatureGalleryIcons",
        featureBgImageCard: "storyblok/FeatureBgImageCard",
        faq: "storyblok/Faq",
        timeline: "storyblok/Timeline",
        testimonialStats: "storyblok/TestimonialStats",
        logoGallery: "storyblok/LogoGallery",
        contactForm: "storyblok/ContactForm",
        contactInfo: "storyblok/ContactInfo",
        blocText: "storyblok/BlocText",
        stepsRows: "storyblok/StepsRows",
        stepsCols: "storyblok/StepsCols",
        testimonialSimple: "storyblok/TestimonialSimple",
        testimonialsMultiple: "storyblok/TestimonialsMultiple",
        team: "storyblok/Team",
        horizontalGallery: "storyblok/GalleryHorizontal",
        masonryGallery: "storyblok/GalleryMasonry",
      },
    }),
    sitemap({
      filter: (page) => !filteredUrls.includes(page),
    }),
  ],
  site: siteurl,
  vite: {
    plugins: [tailwindcss()],
  },
});
