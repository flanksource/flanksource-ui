import PageError from "../../../../../pages/error";
import PageHome from "../../../../../pages/index";
import PageLogin from "../../../../../pages/login/[[...index]]";
import PageProfileSettings from "../../../../../pages/profile-settings/[[...profile-settings]]";
import PageRecovery from "../../../../../pages/recovery";
import PageRegistration from "../../../../../pages/registration/[[...registration]]";
import PageVerification from "../../../../../pages/verification";

export {
  PageError,
  PageHome,
  PageLogin,
  PageProfileSettings,
  PageRecovery,
  PageRegistration,
  PageVerification
};

export * from "./hooks";
export * from "./sdk";
export * from "./styled";
export * from "./ui";
