import test from "node:test";
import assert from "node:assert/strict";
import {
  entityMap,
  summary,
  escapeHtml,
  relativeTime,
  language,
  validateConfig,
  available,
  refreshAvailable,
  mapReports,
} from "../src/hungarian-power-outages-card.js";
const registry = [
  {
    platform: "hungarian_power_outages",
    device_id: "a",
    translation_key: "planned_count",
    unique_id: "entry_planned_count",
    entity_id: "sensor.renamed_hungarian",
  },
  {
    platform: "hungarian_power_outages",
    device_id: "b",
    translation_key: "planned_count",
    entity_id: "sensor.other",
  },
  {
    platform: "hungarian_power_outages",
    device_id: "a",
    unique_id: "entry_nearby_fault_reports",
    entity_id: "sensor.nearby",
  },
  {
    platform: "other",
    device_id: "a",
    translation_key: "refresh",
    entity_id: "button.other",
  },
  {
    platform: "hungarian_power_outages",
    device_id: "a",
    unique_id: "entry_refresh",
    entity_id: "button.disabled",
    disabled_by: "user",
  },
];
const entities = {
  planned_count: "sensor.count",
  planned_health: "sensor.health",
  planned_now: "binary_sensor.now",
  next_planned_start: "sensor.start",
};
const state = (value, attributes = {}) => ({ state: value, attributes });
const states = {
  "sensor.count": state("1"),
  "sensor.health": state("ok"),
  "binary_sensor.now": state("off"),
  "sensor.start": state("2026-10-21T06:00:00Z"),
};
test("discovers renamed and translated entities, isolates devices and excludes disabled/foreign entities", () =>
  assert.deepEqual(entityMap(registry, "a"), {
    planned_count: "sensor.renamed_hungarian",
    nearby_fault_reports: "sensor.nearby",
  }));
test("no configured device cannot accidentally pick an unbound entity", () =>
  assert.deepEqual(entityMap(registry, undefined), {}));
test("scheduled, current and empty summaries", () => {
  assert.equal(summary(states, entities), "next");
  assert.equal(
    summary({ ...states, "binary_sensor.now": state("on") }, entities),
    "now",
  );
  assert.equal(
    summary({ ...states, "sensor.count": state("0") }, entities),
    "empty",
  );
});
for (const bad of [
  "stale",
  "invalid_feed",
  "cannot_connect",
  "unknown",
  "unavailable",
])
  test(`${bad} feed never reports an empty or current supply`, () =>
    assert.equal(
      summary(
        { ...states, "sensor.count": state("0"), "sensor.health": state(bad) },
        entities,
      ),
      "unavailable",
    ));
test("degraded source retains usable scheduled data with a separate health warning", () =>
  assert.equal(
    summary({ ...states, "sensor.health": state("degraded") }, entities),
    "next",
  ));
test("missing/restored/invalid summary values are unavailable", () => {
  assert.equal(summary({}, entities), "unavailable");
  assert.equal(
    summary(
      { ...states, "sensor.count": state("1", { restored: true }) },
      entities,
    ),
    "unavailable",
  );
  assert.equal(
    summary({ ...states, "sensor.count": state("bad") }, entities),
    "unavailable",
  );
  assert.equal(
    summary({ ...states, "sensor.start": state("bad") }, entities),
    "unavailable",
  );
  assert.equal(available(state("unavailable")), false);
});
test("untrusted provider text is escaped", () =>
  assert.equal(
    escapeHtml("<img src=x onerror=\"bad\"> & 'x'"),
    "&lt;img src=x onerror=&quot;bad&quot;&gt; &amp; &#39;x&#39;",
  ));
test("language follows HA or explicit override", () => {
  assert.equal(language({}, { language: "hu-HU" }), "hu");
  assert.equal(language({ language: "en" }, { language: "hu" }), "en");
  assert.equal(language({}, { language: "de" }), "en");
});
test("time format is deterministic and invalid dates are visible", () => {
  assert.equal(
    relativeTime(
      "2026-10-21T06:00:00Z",
      "en",
      Date.parse("2026-10-12T06:00:00Z"),
    ),
    "in 9 days",
  );
  assert.equal(relativeTime("bad", "hu"), "—");
});
test("rejects unsupported configuration types", () => {
  for (const config of [
    { device_id: 1 },
    { title: {} },
    { language: "xx" },
    { show_nearby: "true" },
    { expanded: 1 },
  ])
    assert.throws(() => validateConfig(config));
  assert.equal(validateConfig({ device_id: "a" }).show_nearby, true);
});

test("unused button can be pressed even when its last-press timestamp is unknown", () => {
  assert.equal(refreshAvailable(state("unknown")), true);
  assert.equal(refreshAvailable(state("unavailable")), false);
  assert.equal(refreshAvailable(undefined), false);
});

test("map combines feeds, preserves direct match, rejects missing/bad markers and expired intervals", () => {
  const report = {
    id: "r",
    start: "2026-10-21T06:00:00Z",
    end: "2026-10-21T14:00:00Z",
    latitude: 47,
    longitude: 19,
    match: "parcel",
  };
  const data = {
    a: state("1", {
      outages: [
        report,
        { ...report, id: "bad", latitude: NaN },
        { ...report, id: "expired", end: "2026-10-01T00:00:00Z" },
      ],
    }),
    b: state("1", { reports: [{ ...report, match: "nearby" }] }),
    c: state("1", {
      reports: [
        {
          id: "f",
          started_at: "2026-10-12T00:00:00Z",
          latitude: 47.01,
          longitude: 19,
        },
      ],
    }),
  };
  const result = mapReports(
    data,
    { planned_count: "a", nearby_planned_count: "b", fault_reports: "c" },
    true,
    Date.parse("2026-10-12T00:00:00Z"),
  );
  assert.equal(result.length, 2);
  assert.equal(result[0].match, "parcel");
  assert.equal(result[1].type, "fault");
  assert.deepEqual(
    mapReports({ a: state("unavailable") }, { planned_count: "a" }),
    [],
  );
});
