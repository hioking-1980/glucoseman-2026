"use client";

import { useState } from "react";

const SHARE_TEXT = "グルコースマンをゆるキャラグランプリ優勝へ。目標120,000PT！今日も1票お願いします。";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const data = { title: "グルコースマン召喚計画", text: SHARE_TEXT, url: window.location.href };
    try {
      if (navigator.share) return await navigator.share(data);
      await navigator.clipboard.writeText(`${SHARE_TEXT}\n${window.location.href}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const xUrl = new URL("https://twitter.com/intent/tweet");
      xUrl.searchParams.set("text", SHARE_TEXT);
      xUrl.searchParams.set("url", window.location.href);
      window.location.href = xUrl.toString();
    }
  };

  return (
    <button className="support-card share-card" type="button" onClick={share}>
      <span className="support-icon share-icon" aria-hidden="true">●</span>
      <span><strong>{copied ? "コピーしました" : "シェアして応援"}</strong><small>グルコースマンを<br />みんなに広めよう！</small></span>
      <b aria-hidden="true">›</b>
    </button>
  );
}
