import { test } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const {
  // this are the defaults, but we can override them using environment variables
  TEST_URL = "https://incident-commander.demo.aws.flanksource.com/",
  USERNAME = "admin@local",
  PASSWORD = "admin",
  TEST_TARGET_ENV = "KRATOS"
} = process.env;

test.describe("Sing ", () => {
  test("should login to kratos dashboard successfully", async ({
    page
  }, testInfo) => {
    // skip this test if the test environment is not kratos
    if (TEST_TARGET_ENV !== "KRATOS") {
      testInfo.skip();
    }

    await page.goto(TEST_URL);
    await page.waitForURL("**/login*", { timeout: 10000 });
    // login as admin
    await page.getByLabel("ID").click();
    await page.getByLabel("ID").fill(USERNAME);
    await page.getByLabel("ID").press("Tab");
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    // wait for redirect to the topology page
    await page.waitForURL("**/topology", { timeout: 30000 });
    test.expect(page.url()).toContain("/topology");
  });

  test("should login to Clerk SaaS dashboard successfully", async ({
    page
  }, testInfo) => {
    // skip this test if the test environment is not clerk
    if (TEST_TARGET_ENV !== "CLERK") {
      testInfo.skip();
    }

    await page.goto(TEST_URL);
    await page.waitForURL("**/login*", { timeout: 20000 });
    // we should be able to login to the clerk dashboard
    await page.getByLabel("Email address").fill(PASSWORD);
    await page.getByLabel("Email address").press("Enter");
    await page
      .getByLabel("Password", { exact: true })
      // we probably should not hardcode the password here
      .fill(USERNAME);
    await page.getByRole("button", { name: "Continue" }).click();

    // once user is logged in, we should be redirected to the home page,
    // ideally, to the topology page
    const url = new URL("/", TEST_URL).href;
    await page.waitForURL(url, { timeout: 30000 });
    test.expect(page.url()).toEqual(url);

    // this will need to be updated, so that we can check the correct url
    // (/topology)
    await page.waitForSelector("button[aria-label='Open user button']", {
      timeout: 20000
    });
    await page.click("button[aria-label='Open user button']");
    test.expect(await page.isVisible("text=Sign out")).toBeTruthy();
  });
});
