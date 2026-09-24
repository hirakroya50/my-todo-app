import { PrismaClient } from "@prisma/client";
import { expect, test } from "@playwright/test";

const email = `e2e-${Date.now()}@example.com`;
const password = "password1";
const prisma = new PrismaClient();

test.afterAll(async () => {
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
});

test("signup creates a project and checks a template item", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL(/\/projects/);

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
