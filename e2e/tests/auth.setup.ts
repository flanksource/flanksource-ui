import { expect, test as setup } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const {
  TEST_USERNAME = "admin@local",
  TEST_PASSWORD = "admin"
} = process.env;

export const AUTH_STATE_PATH = path.join(
  __dirname,
  "../.auth/user.json"
);

setup("authenticate", async ({ page }) => {
  await page.goto("/");

  // If already logged in (saved session), skip login
  const isLoginPage = await page
    .waitForURL("**/login*", { timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (isLoginPage) {
    // Wait for the ID field to appear. If it doesn't, the login form is stuck
    // on a skeleton due to "return_to address is not allowed" from Kratos.
    // Recover by navigating to /login without any return_to query param.
    const idField = page.getByLabel("ID");
    let formVisible = await idField
      .waitFor({ state: "visible", timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (!formVisible) {
      await page.goto("/login");
      await idField.waitFor({ state: "visible", timeout: 15000 });
    }

    await idField.click();
    await idField.fill(TEST_USERNAME);
    await idField.press("Tab");
    await page.getByLabel("Password").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
  }

  // Wait for the app to fully load — the "Catalog" navlink in the sidebar
  // confirms the SPA has hydrated and the user is authenticated
  await expect(page.getByRole("link", { name: "Catalog" })).toBeVisible({
    timeout: 30000
  });

  await page.context().storageState({ path: AUTH_STATE_PATH });
});
