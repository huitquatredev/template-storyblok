export default function toCssClassName(input) {
  return input
    .normalize('NFKD') // Normalize to decompose accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
    .replace(/[^a-zA-Z0-9]/g, '') // Remove special characters
    .replace(/^\d+/, '') // Remove leading numbers
    .toLowerCase(); // Convert to lowercase
}