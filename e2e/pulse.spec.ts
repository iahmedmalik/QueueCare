import { expect, test, type Page } from "@playwright/test";
import { PULSE_EVENTS } from "../src/lib/pulse";
import { RECEPTION, signIn, withWindows } from "./helpers";

// Usage measurement (PulseMetrics): only fixed event names leave the app, and never a patient's private link.
// The real snippet is replaced by a stand-in that records what the page asks it to track, so these tests need
// no PulseMetrics server. They run only on a build made with the three NEXT_PUBLIC_PULSE_* settings, for example:
//   NEXT_PUBLIC_PULSE_KEY=0123456789abcdef01234567 NEXT_PUBLIC_PULSE_SRC=https://pulse.test/p.js \
//   NEXT_PUBLIC_PULSE_API=https://pulse.test npm run test:e2e

const configured = Boolean(process.env.NEXT_PUBLIC_PULSE_KEY && process.env.NEXT_PUBLIC_PULSE_SRC && process.env.NEXT_PUBLIC_PULSE_API);

async function standIn(page: Page) {
  await page.route("https://pulse.test/**", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "window.__pulseCalls=[];window.pulse={track:function(){window.__pulseCalls.push(Array.prototype.slice.call(arguments))}};",
    }),
  );
}
const calls = (page: Page) => page.evaluate(() => (window as unknown as { __pulseCalls: unknown[][] }).__pulseCalls);

test.describe("PulseMetrics events", () => {
  test("without the settings, no snippet is added at all", async ({ page }) => {
    test.skip(configured, "this build has the settings");
    await page.goto("/");
    expect(await page.locator("script[data-key]").count()).toBe(0);
  });

  test("a patient opening their private link sends only fixed event names, never the link", async ({ browser }) => {
    test.skip(!configured, "needs a build with the NEXT_PUBLIC_PULSE_* settings");
    test.setTimeout(90_000);
    await withWindows(browser, async (open) => {
      const reception = await open();
      await standIn(reception);
      await signIn(reception, RECEPTION);
      await reception.getByLabel("Patient name or initials").fill("E2E test patient");
      await reception.getByRole("button", { name: "Register and issue token" }).click();
      await reception.getByTestId("issued-token").waitFor();
      const link = await reception.getByRole("link", { name: "Open status page" }).getAttribute("href");
      const code = link!.split("/").pop()!;
      expect(code).toMatch(/^[0-9a-f]{32}$/);

      // reception: issuing a token is counted, by name only
      expect(await calls(reception)).toContainEqual(["patient_registered"]);

      // the patient's phone: a fresh browser with the private link
      const phone = await open();
      await standIn(phone);
      const requested: string[] = [];
      phone.on("request", (r) => requested.push(r.url()));
      await phone.goto(link!);
      await expect(phone.getByTestId("status-token")).toBeVisible();
      await phone.waitForFunction(() => (window as unknown as { __pulseCalls: unknown[] }).__pulseCalls.length > 0);

      const sent = await calls(phone);
      expect(sent).toContainEqual(["status_viewed"]);
      for (const call of sent) {
        expect(call, "exactly one argument, the event name").toHaveLength(1);
        expect(PULSE_EVENTS as readonly string[]).toContain(call[0]);
        expect(JSON.stringify(call)).not.toContain(code);
      }
      // and the snippet's own address carries nothing private either
      for (const url of requested.filter((u) => u.startsWith("https://pulse.test"))) expect(url).not.toContain(code);
    });
  });
});

test("the privacy page is public and says what is counted and what is never sent", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
  await expect(page.getByText("never a name, a phone number, an email or any health detail")).toBeVisible();
  for (const name of PULSE_EVENTS) await expect(page.getByText(`(${name})`)).toBeVisible();
});
