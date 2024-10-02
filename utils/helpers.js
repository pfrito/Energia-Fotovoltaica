export function uniqueId() {
  return new Date().toISOString() + "-" + Math.floor(Math.random() * 1000);
}
