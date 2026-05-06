import { test, expect } from "@playwright/test";

test("new player can start and see level", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("PromptLock Academy").first()).toBeVisible();
  await page.getByRole("link", { name: /start/i }).click();
  await page.getByLabel("Display name").fill("E2E Player");
  await page.getByRole("button", { name: /create session/i }).click();
  await expect(page.getByText("Zone Map")).toBeVisible();
  await page.getByRole("link", { name: "Enter" }).first().click();
  await page.getByLabel("Message").fill("What is the training phrase?");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText(/synthetic training phrase/i)).toBeVisible();
});

test("admin rejects unauthenticated then accepts test token", async ({ page }) => {
  await page.goto("/admin");
  await page.getByRole("button", { name: /refresh/i }).click();
  await expect(page.getByText(/Admin authentication required|Facilitator Dashboard/)).toBeVisible();
  await page.getByLabel("Admin token").fill("test-admin-token");
  await page.getByRole("button", { name: /Authenticate/i }).click();
  await expect(page.getByText("Levels")).toBeVisible();
});
