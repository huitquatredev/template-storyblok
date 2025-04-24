export default function toUrl(input) {
  if (input && !/^https?:\/\//i.test(input)) {
    input = `https://${input}`;
  }
  return input;
}
