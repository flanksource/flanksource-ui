// With 1Password CLI:
// eval $(op signin) && \
// USERNAME=$(op read "op://va5bovofhet2mrx3l2ekeyxknu/67fub5vvxgnemnadtjq6zwg2zq/username") \
// PASSWORD=$(op read "op://va5bovofhet2mrx3l2ekeyxknu/67fub5vvxgnemnadtjq6zwg2zq/password") \
// npx playwright test config-changes-swimlane --project=chromium

import { expect, Page, test } from "@playwright/test";

test.setTimeout(60000);

const ROW_SEL = ".border-b.border-gray-100";
const LEGEND_SEL = ".sticky.top-\\[28px\\]";

async function gotoGraphView(page: Page) {
  await page.goto("/catalog/changes?view=Graph");

  await expect(
    page.locator("li").filter({ hasText: "Catalog" }).getByRole("link")
  ).toBeVisible({ timeout: 30000 });

  await page.getByRole("button", { name: "Graph" }).click();
  await expect(page.locator(ROW_SEL).first()).toBeVisible({ timeout: 30000 });
}

test.describe.serial("Config Changes Swimlane", () => {
  test("view=Graph renders swimlane with legend", async ({ page }) => {
    await gotoGraphView(page);

    const legend = page.locator(LEGEND_SEL);
    await expect(legend).toBeVisible({ timeout: 10000 });

    const legendEntries = legend.locator(
      "span.inline-flex.items-center.gap-1"
    );
    expect(await legendEntries.count()).toBeGreaterThanOrEqual(1);
  });

  test("view toggle updates URL", async ({ page }) => {
    await gotoGraphView(page);

    await page.getByRole("button", { name: "Table" }).click();
    await expect(page).toHaveURL(/view=Table/);
    await expect(page.locator(ROW_SEL).first()).not.toBeVisible({
      timeout: 10000
    });

    await page.getByRole("button", { name: "Graph" }).click();
    await expect(page).toHaveURL(/view=Graph/);
    await expect(page.locator(ROW_SEL).first()).toBeVisible({
      timeout: 30000
    });
  });

  test("group rows collapse and expand", async ({ page }) => {
    await gotoGraphView(page);

    const groupToggle = page
      .locator("button")
      .filter({ hasText: /\(\d+\)/ })
      .first();
    await expect(groupToggle).toBeVisible({ timeout: 10000 });

    // Button is inside: div(group wrapper) > div.flex.flex-row(parent row) > div.sticky > button
    // We need the outermost group wrapper div that contains both the parent row and child rows
    const groupContainer = groupToggle.locator(
      "xpath=ancestor::div[contains(@class,'border-b')]/.."
    );
    const childRows = groupContainer.locator(".pl-6");
    const initialChildCount = await childRows.count();
    expect(initialChildCount).toBeGreaterThan(0);

    await groupToggle.click();
    await expect(childRows).toHaveCount(0);

    await groupToggle.click();
    await expect(childRows).toHaveCount(initialChildCount);
  });

  test("infinite scroll triggers next page fetch", async ({ page }) => {
    await gotoGraphView(page);

    const sentinel = page.locator("div.h-1").last();
    await expect(sentinel).toBeAttached({ timeout: 10000 });

    const nextPagePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/catalog/changes") &&
        resp.request().postData()?.includes('"page":2') === true,
      { timeout: 15000 }
    );

    await sentinel.scrollIntoViewIfNeeded();
    const response = await nextPagePromise;
    expect(response.status()).toBe(200);
  });
});
