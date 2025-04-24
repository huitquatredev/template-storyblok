//You can have the languages in an utils file so it can be reused.
let languages = ['fr']
function getTransLink(language, slug) {
  return language === 'fr' ? slug : `/${language}${slug}`
}
export { getTransLink, languages }