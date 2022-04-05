export const getTopologyCardStatusBorderTopColor = (status) => {
  switch (status) {
    case "healthy":
      return "border-light-orange";
    case "unhealthy":
      return "border-light-red";
    default:
      return "border-white";
  }
};
