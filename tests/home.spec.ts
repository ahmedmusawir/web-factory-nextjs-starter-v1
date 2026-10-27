import { test, expect } from "@playwright/test";

test("homepage, accessible navigation and responsive layout", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle("Stark Studio — A clear place to begin");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Make room for your next idea.");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  const image = page.getByRole("img");
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const noOverflow = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await noOverflow();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  const nav = page.getByRole("navigation", { name: "Primary" });
  if (testInfo.project.name === "mobile") {
    const menu = page.getByRole("button", { name: /^(Open|Close) menu$/ });
    await expect(nav).toBeHidden();
    await menu.focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(nav).toBeVisible();
    await noOverflow();
    await page.keyboard.press("Tab");
    await expect(nav.getByRole("link", { name: "Approach" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(nav).toBeHidden();
    await menu.click();
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(nav).toBeHidden();
    await menu.click();
  }
  await nav.getByRole("link", { name: "Approach" }).click();
  await expect(page).toHaveURL(/#approach$/);
  await expect(page.getByRole("heading", { name: "Good things start with the essentials." })).toBeInViewport();
  if (testInfo.project.name === "mobile") {
    await expect(nav).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  await nav.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.getByRole("heading", { name: "A little space. A lot of possibility." })).toBeInViewport();
  await page.getByRole("link", { name: "Back to top" }).click();
  await expect(page).toHaveURL(/#main$/);
  await page.getByRole("link", { name: "Explore our approach" }).click();
  await expect(page).toHaveURL(/#approach$/);
  await noOverflow();
  await page.goto("/");
  await page.screenshot({ path: `QAM/evidence/${testInfo.project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
});
