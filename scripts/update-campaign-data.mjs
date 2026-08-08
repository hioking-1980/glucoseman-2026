import { readFile, writeFile } from "node:fs/promises";

const rankingUrl = "https://yurugp.jp/vote/2026";
const dataPath = new URL("../app/campaign-data.json", import.meta.url);

const response = await fetch(rankingUrl, {
  headers: { "user-agent": "GlucosemanSupportSite/1.0 (+https://hioking-1980.github.io/glucoseman-2026/)" },
});

if (!response.ok) throw new Error(`Official ranking request failed: ${response.status}`);

const html = await response.text();
const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]*>/g, " ")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/\s+/g, " ")
  .trim();

const entryMarker = "エントリーNo.111";
const entryIndex = text.indexOf(entryMarker);
if (entryIndex < 0) throw new Error("Glucoseman entry No.111 was not found on the official ranking page");

const beforeEntry = text.slice(Math.max(0, entryIndex - 1800), entryIndex);
if (!beforeEntry.includes("兵庫県") || !beforeEntry.includes("姫路の種") || !beforeEntry.includes("グルコースマン")) {
  throw new Error("The official entry identity did not match Glucoseman / Himeji no Tane");
}

const rankMatches = [...beforeEntry.matchAll(/(\d+)位/g)];
const rank = Number(rankMatches.at(-1)?.[1]);
const afterEntry = text.slice(entryIndex, entryIndex + 500);
const pointMatch = afterEntry.match(/([\d,]+)\s*PT/);
const currentPoint = Number(pointMatch?.[1]?.replaceAll(",", ""));

if (!Number.isInteger(rank) || rank < 1 || !Number.isInteger(currentPoint) || currentPoint < 0) {
  throw new Error("The official rank or point value could not be parsed safely");
}

const previous = JSON.parse(await readFile(dataPath, "utf8"));
const checkedAt = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})
  .format(new Date())
  .replaceAll("/", ".");

const next = {
  currentPoint,
  targetPoint: previous.targetPoint,
  previousPoint: currentPoint === previous.currentPoint ? previous.previousPoint : previous.currentPoint,
  rank,
  updatedAt: checkedAt,
};

await writeFile(dataPath, `${JSON.stringify(next, null, 2)}\n`);
console.log(`Official ranking synced: ${rank}位 / ${currentPoint.toLocaleString("ja-JP")} PT (${checkedAt})`);
