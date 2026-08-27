import Image from "next/image";
import { getCampaignData } from "./campaign-data";
import { CampaignDashboard } from "./campaign-dashboard";
import { ShareButton } from "./share-button";

const VOTE_URL = "https://yurugp.jp/characters/4524";
const RANKING_URL = "https://yurugp.jp/vote/2026";
const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export default async function Home() {
  const campaignData = await getCampaignData();

  return (
    <main className="site-shell">
      <div className="campaign-grain" aria-hidden="true" />

      <header className="campaign-header">
        <div className="campaign-title">
          <p>グルコースマン</p>
          <h1>ゆるキャラ<br className="narrow-break" />グランプリ。</h1>
          <h2>優勝。</h2>
        </div>
      </header>

      <Image
        className="summon-banner"
        src={`${ASSET_PREFIX}/aim-12000-banner.png`}
        alt="目指せ！12,000PT"
        width={2172}
        height={724}
        priority
        unoptimized
      />

      <CampaignDashboard initialData={campaignData} />

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
            <span><strong>はじめての<wbr />方へ</strong><small>登録方法と<br />投票の流れ</small></span>
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
            <span><strong>ホーム画面に<wbr />追加</strong><small>毎日1票で<br />グルコースマンを<br />召喚しよう！</small></span>
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
