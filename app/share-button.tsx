"use client";

import { useState } from "react";

const SHARE_TEXT =
  "グルコースマンをゆるキャラグランプリ優勝へ。目標120,000PT！今日も1票お願いします。";

export function ShareButton() {
  const [label, setLabel] = useState("シェアして応援");

  const share = async () => {
    const shareData = { title: "グルコースマン召喚計画", text: SHARE_TEXT, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(`${SHARE_TEXT}\n${window.location.href}`);
      setLabel("URLをコピーしました");
      window.setTimeout(() => setLabel("シェアして応援"), 2400);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const xUrl = new URL("https://twitter.com/intent/tweet");
      xUrl.searchParams.set("text", SHARE_TEXT);
      xUrl.searchParams.set("url", window.location.href);
      window.location.href = xUrl.toString();
    }
  };

  return (
    <button className="share-button" type="button" onClick={share} aria-label="このサイトをシェアして応援する">
      <span aria-hidden="true">●—●</span>
      {label}
    </button>
  );
}
