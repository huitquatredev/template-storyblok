export let FIRST = true;

export function notFirstAnymore() {
  FIRST = false;
}

export function newPage() {
  FIRST = true;
}
