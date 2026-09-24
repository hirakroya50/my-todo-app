import { expect, test } from "@playwright/test";

test("creates a project and checks a template item", async ({ page }) => {
  await page.goto("/projects");

  await page.getByPlaceholder("New project").fill(`E2E ${Date.now()}`);
  await page.getByRole("button", { name: "Add project" }).click();
  await page.waitForURL(/\/projects\/[^/]+\/lists\/[^/]+/);

  await expect(page.getByText("0/186", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Expand" }).click();

  const row = page.locator("div.group").filter({
    hasText: "Understand the problem",
  });
  await row.getByRole("checkbox").click();
  await expect(page.getByText("1/186", { exact: true })).toBeVisible();
});
