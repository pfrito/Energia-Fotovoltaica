export function formatDateToIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function formatIsoDateToDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return new Date(year, month - 1, day);
}
