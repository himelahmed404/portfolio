// #region agent log
import fs from "node:fs";
import path from "node:path";

const logPath = path.resolve(".cursor/debug-a3026d.log");
const sessionId = "a3026d";

function log(hypothesisId, location, message, data) {
  fs.appendFileSync(
    logPath,
    JSON.stringify({
      sessionId,
      runId: "post-fix",
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }) + "\n",
  );
}

const nextVersion = JSON.parse(
  fs.readFileSync("node_modules/next/package.json", "utf8"),
).version;
log("A", "scripts/debug-font-repro.mjs", "Next version at repro", {
  nextVersion,
});

const cssPath =
  ".next/dev/static/chunks/[next]_internal_font_google_geist_mono_1e903b5c_module_css_1igg3k2._.single.css";
const exists = fs.existsSync(cssPath);
let lFontCount = 0;
if (exists) {
  const css = fs.readFileSync(cssPath, "utf8");
  lFontCount = (css.match(/\/l\/font/g) || []).length;
}
log("B", "scripts/debug-font-repro.mjs", "Cached Geist Mono /l/font count", {
  exists,
  lFontCount,
  bugShape: lFontCount > 0,
});

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36";
const res = await fetch(
  "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500;600&display=swap",
  { headers: { "User-Agent": UA } },
);
const text = await res.text();
const urls = [...text.matchAll(/url\(([^)]+)\)/g)].map((m) =>
  m[1].replace(/['"]/g, ""),
);
log("D", "scripts/debug-font-repro.mjs", "Live Google Geist Mono URL shapes", {
  extensionless: urls.filter((u) => u.includes("/l/font")).length,
  withWoff2: urls.filter((u) => u.includes(".woff2")).length,
});

console.log("debug-font-repro: wrote logs to", logPath);
// #endregion
