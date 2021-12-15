export function toFixedIfNecessary(value, dp) {
  return +parseFloat(value).toFixed(dp);
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
