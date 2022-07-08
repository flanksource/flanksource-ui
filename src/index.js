import React from "react";
import ReactDOM from "react-dom";
import dayjs from "dayjs";
import "./index.css";
import { App, CanaryCheckerApp } from "./App";
import reportWebVitals from "./reportWebVitals";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

ReactDOM.render(
  <React.StrictMode>
    {window.APP_DEPLOYMENT === "CANARY_CHECKER" ? (
      <CanaryCheckerApp />
    ) : (
      <App />
    )}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
