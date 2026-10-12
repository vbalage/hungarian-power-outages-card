import assert from "node:assert/strict";
import { mkdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
const { chromium } = await import(
  process.env.CARD_PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CARD_BROWSER_PATH
    ? { executablePath: process.env.CARD_BROWSER_PATH }
    : {}),
});
await mkdir("artifacts", { recursive: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 440, height: 1050 } });
page.on("pageerror", (error) => errors.push(error.message));
const root = new URL("../dist/", import.meta.url);
const server = createServer(async (req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.end(
      '<!doctype html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:16px;background:#eef1f5"><main style="max-width:460px;margin:auto"></main></body></html>',
    );
    return;
  }
  const name = req.url.slice(1);
  if (!["hungarian-power-outages-card.js", "leaflet.js"].includes(name)) {
    res.writeHead(404).end();
    return;
  }
  res.setHeader("Content-Type", "text/javascript");
  res.end(await readFile(new URL(name, root)));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = "http://127.0.0.1:" + server.address().port;
await page.route("https://tile.openstreetmap.org/**", (route) =>
  route.fulfill({
    status: 200,
    contentType: "image/png",
    body: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6PFAAAAAASUVORK5CYII=",
      "base64",
    ),
  }),
);
async function mount({
  lang = "hu",
  status = "next",
  expanded = false,
  readOnly = false,
  failRegistry = false,
  device = "device-a",
} = {}) {
  await page.goto(base);
  await page.addScriptTag({
    type: "module",
    url: base + "/hungarian-power-outages-card.js",
  });
  await page.evaluate(
    async (options) => {
      Date.now = () => Date.parse("2026-10-12T09:00:00Z");
      const keys = [
        "planned_count",
        "planned_now",
        "next_planned_start",
        "next_planned_end",
        "fault_reports",
        "planned_health",
        "faults_health",
        "planned_last_success",
        "faults_last_success",
        "refresh",
        "nearby_planned_count",
        "nearby_fault_reports",
      ];
      window.registry = keys.map((key, i) => ({
        platform: "hungarian_power_outages",
        device_id: "device-a",
        translation_key: key,
        unique_id: "entry_" + key,
        entity_id: (key === "refresh" ? "button." : "sensor.") + "renamed_" + i,
      }));
      window.devices = [
        { id: "device-a", name: "E.ON · Budapest, HRSZ 0123/4" },
      ];
      window.calls = [];
      window.unsubscribed = 0;
      window.info = [];
      const value = {
        planned_count: options.status === "empty" ? "0" : "1",
        planned_now: options.status === "now" ? "on" : "off",
        next_planned_start: "2026-10-21T08:00:00+02:00",
        next_planned_end: "2026-10-21T16:00:00+02:00",
        fault_reports: "1",
        planned_health: ["stale", "degraded"].includes(options.status)
          ? options.status
          : "ok",
        faults_health: "ok",
        planned_last_success: "2026-10-12T09:00:00Z",
        faults_last_success: "2026-10-12T09:00:00Z",
        refresh: "unknown",
        nearby_planned_count: "1",
        nearby_fault_reports: "1",
      };
      window.hass = {
        language: options.lang,
        config: { time_zone: "Europe/Budapest" },
        user: { is_read_only: options.readOnly },
        connection: {
          subscribeEvents: async () => () => window.unsubscribed++,
        },
        callWS: async ({ type }) => {
          if (options.failRegistry) throw Error("registry error");
          return type === "config/entity_registry/list"
            ? window.registry
            : window.devices;
        },
        callService: async (...args) => {
          window.calls.push(args);
          if (window.serviceFails) throw Error("<img src=x onerror=bad>");
        },
        states: Object.fromEntries(
          window.registry.map((r) => {
            const key = r.translation_key;
            return [
              r.entity_id,
              {
                state: value[key],
                attributes: {
                  friendly_name: key,
                  ...(key === "planned_count"
                    ? {
                        outages:
                          options.status === "empty"
                            ? []
                            : [
                                {
                                  id: "example",
                                  latitude: 47.5,
                                  longitude: 19.2,
                                  start: value.next_planned_start,
                                  end: value.next_planned_end,
                                  match: "parcel",
                                },
                              ],
                      }
                    : key === "nearby_planned_count"
                      ? {
                          radius_m: 3000,
                          search_center: { latitude: 47.501, longitude: 19.2 },
                          reports: [
                            {
                              id: "nearby",
                              latitude: 47.505,
                              longitude: 19.202,
                              start: value.next_planned_start,
                              end: value.next_planned_end,
                              distance_m: 758,
                              match: "nearby",
                            },
                          ],
                        }
                      : key.includes("fault_reports")
                        ? {
                            reports: [
                              {
                                id: "fault",
                                latitude: 47.501,
                                longitude: 19.2,
                                provider_radius_m: 600,
                                started_at: "2026-10-12T08:00:00+02:00",
                                affected_customers: 0,
                                distance_m: 1500,
                                basis: "provider_area_overlap",
                              },
                            ],
                          }
                        : {}),
                },
              },
            ];
          }),
        ),
      };
      window.card = document.createElement("hungarian-power-outages-card");
      card.setConfig({ device_id: options.device, expanded: options.expanded });
      card.hass = hass;
      card.addEventListener("hass-more-info", (ev) =>
        info.push(ev.detail.entityId),
      );
      document.querySelector("main").append(card);
    },
    { lang, status, expanded, readOnly, failRegistry, device },
  );
  await page.waitForTimeout(120);
}
try {
  await mount();
  await page
    .getByText("Következő tervezett áramszünet", { exact: true })
    .waitFor();
  assert.match(await page.locator(".date").innerText(), /08:00.*16:00/);
  assert.equal(await page.locator("#refresh").isEnabled(), true);
  await page.screenshot({
    path: "artifacts/card-hu-desktop.png",
    fullPage: true,
  });
  await page.locator("summary").click();
  await page.waitForTimeout(50);
  assert.equal(await page.locator(".report-details").getAttribute("open"), "");
  assert.match(
    await page.locator(".report-details").innerText(),
    /Keresési sugár 3 km/,
  );
  assert.match(
    await page.locator(".report-details").innerText(),
    /Érintett fogyasztók:\s*0/,
  );
  await page.screenshot({
    path: "artifacts/card-details-hu.png",
    fullPage: true,
  });
  await page.evaluate(() => {
    card.hass = { ...hass };
  });
  assert.equal(await page.locator(".report-details").getAttribute("open"), "");
  await page.locator('[data-info="planned_count"]').first().click();
  assert.equal(await page.evaluate(() => info[0]), "sensor.renamed_0");
  await page.locator("#refresh").click();
  await page.waitForTimeout(60);
  assert.deepEqual(await page.evaluate(() => calls), [
    ["button", "press", { entity_id: "button.renamed_9" }],
  ]);
  assert.equal(await page.locator("#refresh").isDisabled(), true);
  assert.match(await page.locator(".notice").innerText(), /Frissítés kérve/);
  await page.evaluate(() => card.remove());
  await page.waitForTimeout(30);
  assert.equal(await page.evaluate(() => unsubscribed), 2);
  await mount({ lang: "en", expanded: true });
  await page.getByText("Next planned outage", { exact: true }).waitFor();
  await page.setViewportSize({ width: 320, height: 1400 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({
    path: "artifacts/card-en-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 440, height: 1050 });
  await mount({ status: "stale" });
  assert.match(await page.locator(".status").innerText(), /nem érhetők el/);
  assert.match(await page.locator(".feed").first().innerText(), /Elavult/);
  await page.screenshot({ path: "artifacts/card-stale.png", fullPage: true });
  await mount({ status: "degraded" });
  assert.match(
    await page.locator(".feed").first().innerText(),
    /Adatok betöltve/,
  );
  assert.equal(await page.locator(".feed .bad").count(), 0);
  await page.locator(".source-note summary").click();
  assert.match(
    await page.locator(".coverage-explanation").innerText(),
    /E.ON teljes listájában/,
  );
  await page.locator(".report-details summary").click();
  assert.equal(await page.locator(".report-details").getAttribute("open"), "");
  await page.screenshot({
    path: "artifacts/card-provider-note.png",
    fullPage: true,
  });
  await mount({ status: "empty" });
  assert.match(await page.locator(".status").innerText(), /Nincs egyező/);
  assert.equal(await page.getByText("power is OK").count(), 0);
  await mount({ status: "now" });
  assert.match(await page.locator(".status").innerText(), /időszaka most/);
  await mount({ readOnly: true });
  assert.equal(await page.locator("#refresh").isDisabled(), true);
  await mount();
  await page.evaluate(() => {
    window.serviceFails = true;
  });
  await page.locator("#refresh").click();
  await page.waitForTimeout(40);
  assert.equal(await page.locator(".notice img").count(), 0);
  assert.match(
    await page.locator(".notice").innerText(),
    /frissítés sikertelen/,
  );
  assert.equal(await page.locator("#refresh").isEnabled(), true);
  await mount({ failRegistry: true });
  await page.locator(".retry").waitFor();
  await page.evaluate(() => {
    hass.callWS = async ({ type }) =>
      type === "config/entity_registry/list" ? registry : devices;
  });
  await page.locator(".retry").click();
  await page.locator(".status").waitFor();
  await mount({ device: "nonexistent" });
  assert.match(await page.locator(".placeholder").innerText(), /nem található/);
  await mount();
  await page.evaluate(() => {
    window.changes = [];
    const editor = document.createElement(
      "hungarian-power-outages-card-editor",
    );
    editor.setConfig({ device_id: "device-a" });
    editor.hass = hass;
    editor.addEventListener("config-changed", (e) =>
      changes.push(e.detail.config),
    );
    document.querySelector("main").append(editor);
  });
  await page
    .locator('hungarian-power-outages-card-editor select[data-key="device_id"]')
    .waitFor();
  await page
    .locator('hungarian-power-outages-card-editor select[data-key="language"]')
    .selectOption("en");
  await page
    .locator('hungarian-power-outages-card-editor input[data-key="title"]')
    .fill("My outages");
  assert.equal(await page.evaluate(() => changes.at(-1).title), "My outages");
  assert.equal(await page.evaluate(() => changes.at(-1).language), "en");
  await mount();
  assert.equal(await page.locator(".map-host").count(), 0);
  await page.locator(".map-toggle").click();
  await page.locator(".leaflet-container").waitFor();
  await page.waitForTimeout(150);
  assert.equal(await page.locator(".map-pin").count(), 3);
  await page.locator(".map-pin").first().click();
  await page.locator(".leaflet-popup-content").waitFor();
  assert.match(
    await page.locator(".leaflet-popup-content").innerText(),
    /HRSZ-egyezés/,
  );
  assert.equal(await page.evaluate(() => card._map.getZoom() > 0), true);
  const zoom = await page.evaluate(() => card._map.getZoom());
  await page.evaluate(() => {
    card.hass = { ...hass };
  });
  assert.equal(await page.evaluate(() => card._map.getZoom()), zoom);
  await page.evaluate(() => {
    window.mapHost = card.shadowRoot.querySelector(".map-host");
    window.mapDetached = false;
    window.mapObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations)
        for (const node of mutation.removedNodes)
          if (node === mapHost || node.contains?.(mapHost)) mapDetached = true;
    });
    mapObserver.observe(card.shadowRoot, { childList: true, subtree: true });
  });
  await page.locator('[data-map="days"]').selectOption("7");
  assert.equal(await page.locator(".map-pin").count(), 1);
  for (const days of ["30", "7", "0", "7"]) {
    await page.locator('[data-map="days"]').selectOption(days);
    await page.locator(".map-pin").first().click();
    await page.locator(".leaflet-popup-content").waitFor();
    await page.locator(".leaflet-popup-close-button").click();
    assert.equal(
      await page.evaluate(() => card._map._animatingZoom === true),
      false,
    );
  }
  await page.evaluate(() => {
    card._renderKey = null;
    card.render();
  });
  assert.equal(await page.evaluate(() => mapDetached), false);
  assert.equal(
    await page.evaluate(
      () => card.shadowRoot.querySelector(".map-host") === mapHost,
    ),
    true,
  );
  await page.locator(".map-pin").first().click();
  await page.locator(".leaflet-popup-content").waitFor();
  await page.locator(".leaflet-popup-close-button").click();
  await page.evaluate(() => mapObserver.disconnect());
  await page.locator('[data-map="fault"]').uncheck();
  assert.equal(await page.locator(".map-pin").count(), 0);
  await page.locator('[data-map="days"]').selectOption("0");
  await page.locator('[data-map="fault"]').check();
  await page.screenshot({
    path: "artifacts/card-map-test.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 320, height: 1200 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.locator(".map-toggle").click();
  assert.equal(await page.evaluate(() => card._map), undefined);
  assert.deepEqual(errors, []);
  console.log(
    "Browser checks passed: localization, Budapest times, mobile layout, details, registry retry, refresh success/failure/cooldown, permissions, entity info, cleanup and visual editor.",
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
