"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import type { CampaignData } from "./campaign-data";

const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const DATA_URL = "https://raw.githubusercontent.com/hioking-1980/glucoseman-2026/main/app/campaign-data.json";
const formatNumber = (value: number) => new Intl.NumberFormat("ja-JP").format(value);

export function CampaignDashboard({ initialData }: { initialData: CampaignData }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${DATA_URL}?updated=${Date.now()}`, { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Ranking request failed"))))
      .then((next: CampaignData) => setData(next))
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const { currentPoint, targetPoint, previousPoint, rank } = data;
  const achievementRate = Math.min((currentPoint / targetPoint) * 100, 100);
  const achievementDisplay = achievementRate.toFixed(1);
  const remainingPoint = Math.max(targetPoint - currentPoint, 0);
  const increase = currentPoint - previousPoint;
  const characterAlphaTop = 77 / 1537;
  const characterAlphaBottom = 1507 / 1537;
  const characterFillInset =
    (characterAlphaBottom - (achievementRate / 100) * (characterAlphaBottom - characterAlphaTop)) * 100;
  const progressStyle = {
    "--progress": `${achievementRate}%`,
    "--character-fill-inset": `${characterFillInset}%`,
  } as CSSProperties;

  return (
    <>
      <section className="hero-dashboard" aria-label="現在の獲得ポイント">
        <div className="score-column">
          <p className="score-label">現在の達成率</p>
          <p className="rate">{achievementDisplay}<span>%</span></p>
          <p className="point-total">
            <strong>{formatNumber(currentPoint)}</strong> PT
            <i>/</i>
            <b>{formatNumber(targetPoint)} PT</b>
          </p>
          <div className="progress-track" role="progressbar" aria-label="目標達成率" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Number(achievementDisplay)}>
            <span style={{ width: `${achievementRate}%` }} />
          </div>
          <p className="remaining">あと <strong>{formatNumber(remainingPoint)}</strong> PT</p>
        </div>
        <div className="character-stage" style={progressStyle}>
          <div className="character-image-wrap">
            <Image className="character-base" src={`${ASSET_PREFIX}/glucoseman.png`} alt="グルコースマン" width={1023} height={1537} priority unoptimized />
            <div className="character-fill" aria-hidden="true">
              <Image src={`${ASSET_PREFIX}/glucoseman.png`} alt="" width={1023} height={1537} unoptimized />
            </div>
          </div>
        </div>
      </section>
      <section className="stat-card" aria-label="更新情報">
        <article><span className="stat-icon" aria-hidden="true">↗</span><div><p>前回更新比</p><strong>↑ {increase >= 0 ? "+" : ""}{formatNumber(increase)}<small> PT</small></strong><em>（前回更新時点比）</em></div></article>
        <article><span className="stat-icon" aria-hidden="true">♛</span><div><p>現在の順位</p><strong>{rank}<small> 位</small></strong></div></article>
      </section>
      <section className="goal-card" id="goal" aria-label="目標120,000ポイント">
        <div className="goal-heading"><h2>目標：{formatNumber(targetPoint)} <small>PT</small></h2><a href="#goal-note">目標について <span>›</span></a></div>
        <div className="milestone-values" aria-hidden="true"><span>0</span><span>30,000</span><span>60,000</span><span>90,000</span><span>120,000</span></div>
        <div className="milestone-line" aria-hidden="true"><i style={{ width: `${achievementRate}%` }} /><b /><b /><b /><b /><b /></div>
        <div className="milestone-rates" aria-hidden="true"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>
      </section>
    </>
  );
}
