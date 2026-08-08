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

const isCampaignData = (value: unknown): value is CampaignData => {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<CampaignData>;
  return [data.currentPoint, data.targetPoint, data.previousPoint, data.rank].every(
    (item) => typeof item === "number" && Number.isFinite(item),
  ) && typeof data.updatedAt === "string";
};

export async function getCampaignData(): Promise<CampaignData> {
  // GitHub Pages uses the snapshot updated by the daily workflow. The Sites
  // runtime reads that same latest snapshot so both public URLs stay aligned.
  if (process.env.GITHUB_ACTIONS === "true") return snapshot;

  try {
    const response = await fetch(LATEST_DATA_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Campaign data request failed: ${response.status}`);
    const latest: unknown = await response.json();
    return isCampaignData(latest) ? latest : snapshot;
  } catch {
    return snapshot;
  }
}
