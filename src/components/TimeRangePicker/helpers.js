export const getFromValues = (str) => {
  const data = str.replace("now-", "");
  const intervalName = data.slice(-1);
  const intervalTime = Number(data.slice(0, -1));
  return [intervalTime, intervalName];
};
