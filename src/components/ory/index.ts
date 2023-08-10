import PageError from "../../../pages/error";
import PageHome from "../../../pages/index";
import PageLogin from "../../../pages/login/[[...index]]";
import PageRecovery from "../../../pages/recovery";
import PageRegistration from "../../../pages/registration/[[...registration]]";
import PageProfileSettings from "../../../pages/profile-settings/[[...profile-settings]]";
import PageVerification from "../../../pages/verification";

export {
  PageError,
  PageHome,
  PageLogin,
  PageRecovery,
  PageRegistration,
  PageProfileSettings,
  PageVerification
};

export * from "./hooks";
export * from "./ui";
export * from "./sdk";
export * from "./styled";
