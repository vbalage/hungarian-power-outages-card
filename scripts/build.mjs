import { readFile, writeFile, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url);
await mkdir(new URL("dist/", root), { recursive: true });
const css = await readFile(new URL("vendor/leaflet.css", root), "utf8");
const source = await readFile(
  new URL("src/hungarian-power-outages-card.js", root),
  "utf8",
);
await writeFile(
  new URL("dist/hungarian-power-outages-card.js", root),
  source.replace('/* @leaflet-css */ ""', JSON.stringify(css)),
);
const license = await readFile(new URL("vendor/LICENSE-Leaflet", root), "utf8");
const leaflet = await readFile(new URL("vendor/leaflet.js", root), "utf8");
await writeFile(
  new URL("dist/leaflet.js", root),
  "/* Leaflet 1.9.4 license:\n" +
    license +
    "\n*/\n" +
    leaflet.replace(/\/\/# sourceMappingURL=.*$/m, ""),
);
