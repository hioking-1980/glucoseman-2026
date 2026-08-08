import type { CSSProperties } from "react";
import Image from "next/image";
import { CAMPAIGN_DATA } from "./campaign-data";
import { ShareButton } from "./share-button";

const VOTE_URL = "https://yurugp.jp/characters/4524";
const RANKING_URL = "https://yurugp.jp/vote/2026";
const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const formatNumber = (value: number) => new Intl.NumberFormat("ja-JP").format(value);

export default function Home() {
  const { currentPoint, targetPoint, previousPoint, rank } = CAMPAIGN_DATA;
  const achievementRate = Math.min((currentPoint / targetPoint) * 100, 100);
  const remainingPoint = Math.max(targetPoint - currentPoint, 0);
  const increase = currentPoint - previousPoint;
  // Map progress to the mascot's visible alpha bounds so even a fraction of 1%
  // colors the soles instead of being swallowed by transparent image padding.
  const characterAlphaTop = 77 / 1537;
  const characterAlphaBottom = 1507 / 1537;
  const characterFillInset =
    (characterAlphaBottom - (achievementRate / 100) * (characterAlphaBottom - characterAlphaTop)) * 100;
  const progressStyle = {
    "--progress": `${achievementRate}%`,
    "--character-fill-inset": `${characterFillInset}%`,
  } as CSSProperties;

  return (
    <main className="site-shell">
      <div className="campaign-grain" aria-hidden="true" />

      <header className="campaign-header">
        <div className="campaign-title">
          <p>グルコースマン</p>
          <h1>ゆるキャラ<br className="narrow-break" />グランプリ。</h1>
          <h2>優勝。</h2>
        </div>
        <a className="menu-link" href="#support" aria-label="応援メニューへ移動">
          <i aria-hidden="true"><span /><span /><span /></i>
          <b>メニュー</b>
        </a>
      </header>

      <section className="hero-dashboard" aria-label="現在の獲得ポイント">
        <div className="score-column">
          <p className="score-label">現在の達成率</p>
          <p className="rate">{achievementRate.toFixed(2)}<span>%</span></p>
          <p className="point-total">
            <strong>{formatNumber(currentPoint)}</strong> PT
            <i>/</i>
            <b>{formatNumber(targetPoint)} PT</b>
          </p>
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
          <p className="remaining">あと <strong>{formatNumber(remainingPoint)}</strong> PT</p>
        </div>

        <div className="character-stage" style={progressStyle}>
          <div className="character-image-wrap">
            <Image
              className="character-base"
              src={`${ASSET_PREFIX}/glucoseman.png`}
              alt="グルコースマン"
              width={1023}
              height={1537}
              priority
              unoptimized
            />
            <div className="character-fill" aria-hidden="true">
              <Image src={`${ASSET_PREFIX}/glucoseman.png`} alt="" width={1023} height={1537} unoptimized />
            </div>
          </div>
        </div>
      </section>

      <section className="stat-card" aria-label="更新情報">
        <article>
          <span className="stat-icon" aria-hidden="true">↗</span>
          <div>
            <p>前回更新比</p>
            <strong>↑ {increase >= 0 ? "+" : ""}{formatNumber(increase)}<small> PT</small></strong>
            <em>（前回更新時点比）</em>
          </div>
        </article>
        <article>
          <span className="stat-icon" aria-hidden="true">♛</span>
          <div>
            <p>現在の順位</p>
            <strong>{rank}<small> 位</small></strong>
          </div>
        </article>
      </section>

      <section className="goal-card" id="goal" aria-label="目標120,000ポイント">
        <div className="goal-heading">
          <h2>目標：{formatNumber(targetPoint)} <small>PT</small></h2>
          <a href="#goal-note">目標について <span>›</span></a>
        </div>
        <div className="milestone-values" aria-hidden="true">
          <span>0</span><span>30,000</span><span>60,000</span><span>90,000</span><span>120,000</span>
        </div>
        <div className="milestone-line" aria-hidden="true">
          <i style={{ width: `${achievementRate}%` }} />
          <b /><b /><b /><b /><b />
        </div>
        <div className="milestone-rates" aria-hidden="true">
          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </section>

      <section className="vote-block">
        <a className="vote-cta" href={VOTE_URL}>
          <span className="fire" aria-hidden="true">🔥</span>
          <strong>今日の1票を投じる！</strong>
          <b aria-hidden="true">›</b>
        </a>
        <p>あなたの1票で、グルコースマンの姿が変わります。</p>
        <small>投票には「ゆるナビ」への無料登録が必要です。</small>
      </section>

      <section className="support-grid" id="support" aria-label="投票を応援するメニュー">
        <details className="support-card">
          <summary>
            <span className="support-icon beginner" aria-hidden="true">🔰</span>
            <span><strong>はじめての方へ</strong><small>登録方法と<br />投票の流れ</small></span>
            <b aria-hidden="true">›</b>
          </summary>
          <div className="support-detail">
            <ol>
              <li>「ゆるナビ」に無料登録</li>
              <li>登録アカウントでログイン</li>
              <li>グルコースマンを選択</li>
              <li>画面の案内に沿って投票</li>
            </ol>
          </div>
        </details>

        <details className="support-card">
          <summary>
            <span className="support-icon phone" aria-hidden="true">＋</span>
            <span><strong>ホーム画面に追加</strong><small>毎日1票で<br />グルコースマンを<br />召喚しよう！</small></span>
            <b aria-hidden="true">›</b>
          </summary>
          <div className="support-detail">
            <p><b>iPhone：</b>Safariの共有 →「ホーム画面に追加」</p>
            <p><b>Android：</b>Chromeのメニュー →「ホーム画面に追加」</p>
          </div>
        </details>

        <ShareButton />
      </section>

      <section className="goal-note" id="goal-note">
        <h2>120,000PTで、完全召喚。</h2>
        <p>獲得PTが増えるほど、グルコースマンが足元から紫に染まります。毎日の1票で100%を目指そう。</p>
        <a className="vote-cta vote-cta-secondary" href={VOTE_URL}>
          <span className="fire" aria-hidden="true">🔥</span>
          <strong>今日の1票を投じる！</strong>
          <b aria-hidden="true">›</b>
        </a>
      </section>

      <footer>
        <a href={RANKING_URL}>◉ ゆるキャラグランプリ2026 グルコースマン投票ページへ ↗</a>
      </footer>
    </main>
  );
}
