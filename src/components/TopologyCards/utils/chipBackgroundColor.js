export const chipBackgroundColor = (color) => {
  switch (color) {
    case "red":
      return "bg-light-red";
    case "orange":
      return "bg-light-orange";
    case "green":
      return "bg-light-green";
    case "gray":
      return "bg-light-gray";
    default:
      return "bg-light-green";
  }
};
