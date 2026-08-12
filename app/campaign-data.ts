import snapshot from "./campaign-data.json";

export type CampaignData = {
  currentPoint: number;
  targetPoint: number;
  previousPoint: number;
  rank: number;
  updatedAt: string;
};

const LATEST_DATA_URL =
  "https://raw.githubusercontent.com/hioking-1980/glucoseman-2026/main/app/campaign-data.json";
const OFFICIAL_RANKING_URL = "https://yurugp.jp/vote/2026";

const isCampaignData = (value: unknown): value is CampaignData => {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<CampaignData>;
  return [data.currentPoint, data.targetPoint, data.previousPoint, data.rank].every(
    (item) => typeof item === "number" && Number.isFinite(item),
  ) && typeof data.updatedAt === "string";
};

const parseOfficialRanking = (html: string) => {
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
  if (entryIndex < 0) return null;

  const beforeEntry = text.slice(Math.max(0, entryIndex - 1800), entryIndex);
  if (
    !beforeEntry.includes("兵庫県") ||
    !beforeEntry.includes("姫路の種") ||
    !beforeEntry.includes("グルコースマン")
  ) return null;

  const rankMatches = [...beforeEntry.matchAll(/(\d+)位/g)];
  const rank = Number(rankMatches.at(-1)?.[1]);
  const pointMatch = text.slice(entryIndex, entryIndex + 500).match(/([\d,]+)\s*PT/);
  const currentPoint = Number(pointMatch?.[1]?.replaceAll(",", ""));

  if (!Number.isInteger(rank) || rank < 1 || !Number.isInteger(currentPoint) || currentPoint < 0) {
    return null;
  }

  return { currentPoint, rank };
};

const readLatestSnapshot = async (): Promise<CampaignData> => {
  try {
    const response = await fetch(LATEST_DATA_URL, { cache: "no-store" });
    if (!response.ok) return snapshot;
    const latest: unknown = await response.json();
    return isCampaignData(latest) ? latest : snapshot;
  } catch {
    return snapshot;
  }
};

export async function getCampaignData(): Promise<CampaignData> {
  // GitHub Pages is a static export and uses the snapshot updated by Actions.
  if (process.env.GITHUB_ACTIONS === "true") return snapshot;

  const latestSnapshot = await readLatestSnapshot();

  // The primary Sites deployment verifies the official ranking at request
  // time. It therefore stays current even if a GitHub scheduled event is
  // delayed or dropped. Strict identity checks prevent accepting another entry.
  try {
    const response = await fetch(OFFICIAL_RANKING_URL, {
      cache: "no-store",
      headers: {
        "user-agent": "GlucosemanSupportSite/1.0 (+https://glucoseman-2026.y-hioki207703.chatgpt.site/)",
      },
    });
    if (!response.ok) throw new Error(`Official ranking request failed: ${response.status}`);

    const official = parseOfficialRanking(await response.text());
    if (!official) throw new Error("Official Glucoseman ranking could not be verified");

    return {
      ...latestSnapshot,
      ...official,
      previousPoint:
        official.currentPoint === latestSnapshot.currentPoint
          ? latestSnapshot.previousPoint
          : latestSnapshot.currentPoint,
    };
  } catch {
    return latestSnapshot;
  }
}
