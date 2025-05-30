import { languages } from './langs'
 
export default function parseUrl(url) {
  //converting the current url to an array based on '/'
  let urlToArray = url?.split('/')
  //Setting the fallback language to be french
  let defaultLang = 'fr'
  //Checking if current url contains a known language
  //If it does, we set the current language to the first element of the url array
  let isKnownLang = languages.some((l) => l === urlToArray?.[0])
  //setting current language based on above
  let currentLang = url && isKnownLang ? urlToArray[0] : defaultLang
  // removing language from the url and only keeping the slug
  let slug = url
    ? isKnownLang
      ? urlToArray?.slice(1)?.join('/') || undefined
      : urlToArray?.join('/')
    : undefined
 
  //Same logic for generating the lang switch as we have in getStaticPaths
  let langSwitch = {}
  languages.forEach((lang) => {
    langSwitch = {
      ...langSwitch,
      [lang]: lang === 'fr' ? `/${slug ?? ''}` : `/${lang}/${slug ?? ''}`,
    }
  })
  //finally returning the same three variables we also get from getStaticPaths
  return { language: currentLang, slug, langSwitch }
}