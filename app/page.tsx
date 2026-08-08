import type { CSSProperties } from "react";
import Image from "next/image";
import { CAMPAIGN_DATA } from "./campaign-data";
import { ShareButton } from "./share-button";

const VOTE_URL = "https://yurugp.jp/characters/4524";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(value);

export default function Home() {
  const { currentPoint, targetPoint, previousPoint, rank, updatedAt } =
    CAMPAIGN_DATA;
  const achievementRate = Math.min((currentPoint / targetPoint) * 100, 100);
  const remainingPoint = Math.max(targetPoint - currentPoint, 0);
  const increase = currentPoint - previousPoint;
  const progressStyle = {
    "--progress": `${achievementRate}%`,
  } as CSSProperties;

  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="campaign-title">
        <div className="grain" aria-hidden="true" />
        <header className="site-header">
          <p className="brand-kicker">グルコースマン</p>
          <h1 id="campaign-title">召喚計画。</h1>
          <span className="year-stamp">YURU GP<br />2026</span>
        </header>

        <p className="victory-banner">ゆるキャラグランプリ、優勝。</p>

        <div className="hero-grid">
          <div className="score-panel">
            <p className="eyebrow">現在の達成率</p>
            <p className="rate">{achievementRate.toFixed(2)}<span>%</span></p>
            <p className="score-line">
              <strong>{formatNumber(currentPoint)}</strong>
              <span> PT</span>
            </p>
            <p className="target-line">/ {formatNumber(targetPoint)} PT</p>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="目標達成率"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Number(achievementRate.toFixed(2))}
            >
              <span style={{ width: `${achievementRate}%` }} />
            </div>
            <p className="remaining">
              あと <strong>{formatNumber(remainingPoint)}</strong> PT
            </p>
          </div>

          <div className="character-stage" style={progressStyle}>
            <div className="character-image-wrap">
              <Image
                className="character-base"
                src="/glucoseman.png"
                alt="グルコースマン"
                width={1024}
                height={1536}
                priority
                unoptimized
              />
              <div className="character-fill" aria-hidden="true">
                <Image
                  src="/glucoseman.png"
                  alt=""
                  width={1024}
                  height={1536}
                  unoptimized
                />
              </div>
            </div>
            <p className="summon-label">召喚率 {achievementRate.toFixed(2)}%</p>
          </div>
        </div>

        <div className="stats-grid">
          <article>
            <span className="stat-icon" aria-hidden="true">↗</span>
            <div>
              <p>前回更新比</p>
              <strong>{increase >= 0 ? "+" : ""}{formatNumber(increase)}<small> PT</small></strong>
            </div>
          </article>
          <article>
            <span className="stat-icon" aria-hidden="true">♛</span>
            <div>
              <p>現在の順位</p>
              <strong>{rank}<small> 位</small></strong>
            </div>
          </article>
        </div>

        <section className="goal-card" aria-label="目標ポイント">
          <div className="goal-heading">
            <p>GOAL</p>
            <strong>{formatNumber(targetPoint)} PT</strong>
          </div>
          <div className="goal-scale" aria-hidden="true">
            <span>0</span><span>30,000</span><span>60,000</span><span>90,000</span><span>120,000</span>
          </div>
          <div className="goal-line"><i style={{ width: `${achievementRate}%` }} /></div>
          <p className="updated">最終更新 {updatedAt}</p>
        </section>
      </section>

      <div className="content-area">
        <a className="vote-cta vote-cta-primary" href={VOTE_URL}>
          <span aria-hidden="true">🔥</span>
          <span><small>グルコースマンを優勝へ</small>今日の1票を投じる！</span>
          <b aria-hidden="true">›</b>
        </a>
        <p className="cta-note">あなたの1票で、召喚は完成に近づきます。</p>

        <section className="guide-section" id="guide">
          <p className="section-number">01 / VOTE GUIDE</p>
          <h2>はじめての方へ</h2>
          <p className="section-lead">投票には「ゆるナビ」への無料登録が必要です。</p>
          <ol className="steps">
            <li><span>1</span><div><strong>無料登録</strong><p>公式ページから「ゆるナビ」に登録</p></div></li>
            <li><span>2</span><div><strong>ログイン</strong><p>登録したアカウントでログイン</p></div></li>
            <li><span>3</span><div><strong>キャラを選択</strong><p>グルコースマンのページを開く</p></div></li>
            <li><span>4</span><div><strong>投票！</strong><p>画面の案内に沿って1票を投じる</p></div></li>
          </ol>
          <a className="text-link" href={VOTE_URL}>公式ページで詳しく見る <span>↗</span></a>
        </section>

        <section className="action-section">
          <p className="section-number">02 / EVERYDAY</p>
          <h2>毎日、すぐに会いにいこう。</h2>
          <p className="section-lead">ホーム画面に追加すると、投票ページへ迷わず戻れます。</p>
          <div className="device-cards">
            <article>
              <span className="device-label">iPhone</span>
              <h3>Safariで追加</h3>
              <p><b>共有</b> をタップ<br />→「ホーム画面に追加」</p>
            </article>
            <article>
              <span className="device-label">Android</span>
              <h3>Chromeで追加</h3>
              <p><b>メニュー</b> をタップ<br />→「ホーム画面に追加」</p>
            </article>
          </div>
        </section>

        <section className="share-section">
          <div>
            <p className="section-number">03 / SHARE</p>
            <h2>仲間を、召喚。</h2>
            <p>応援の輪を広げて、120,000PTへ。</p>
          </div>
          <ShareButton />
        </section>

        <section className="final-call">
          <p>ONE DAY, ONE VOTE.</p>
          <h2>その1票が、<br />グルコースマンを変える。</h2>
          <a className="vote-cta" href={VOTE_URL}>
            <span aria-hidden="true">🔥</span>
            <span>今日の1票を投じる！</span>
            <b aria-hidden="true">›</b>
          </a>
        </section>

        <footer>
          <p>グルコースマン召喚計画。</p>
          <a href="https://yurugp.jp/vote/2026">ゆるキャラグランプリ2026 ランキング ↗</a>
        </footer>
      </div>
    </main>
  );
}
