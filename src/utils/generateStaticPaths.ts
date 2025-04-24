import { useStoryblokApi } from "@storyblok/astro";
import isPreview from "./isPreview";
import { languages } from "./langs";

export default async function generateStaticPaths() {
  const storyblokApi = useStoryblokApi();
  const links = await storyblokApi.getAll("cdn/links", {
    version: isPreview() ? "draft" : "published",
  });
  // @ts-ignore
  let paths = [];
  links
    //Don't generate paths for folders
    .filter((link) => !link.is_folder)
    //Don't generate paths for global links except in preview mode
    .filter((link) => {
      return link.slug.split("/")[0] !== "global" || isPreview() === true;
    })
    .forEach((link: { slug: string }) => {
      languages.forEach((language) => {
        //This slug will be used for fetching data from storyblok
        let slug = link.slug === "home" ? undefined : link.slug;
        //This will be used for generating all the urls for astro
        let full_url = language === "fr" ? slug : `${language}/${slug ?? ""}`;
        //This will let us change the url for diffrent versions
        let langSwitch = {};
        languages.forEach((lang) => {
          langSwitch = {
            ...langSwitch,
            [lang]: lang === "fr" ? `/${slug ?? ""}` : `/${lang}/${slug ?? ""}`,
          };
        });
        paths.push({
          props: { language, slug, langSwitch },
          params: {
            slug: full_url,
            name: link.name,
          },
        });
      });
    });
  // @ts-ignore
  return paths;
}
