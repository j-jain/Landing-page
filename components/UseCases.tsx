"use client";

import { useRef, useState } from "react";
import { useMarqueeScroll } from "@/lib/useMarqueeScroll";

type Card = { poster: string; cap: string; video: string };

const CARDS: Card[] = [
  { poster: "/assets/imgImage3.png", cap: "Multiple Systems. One Tool.", video: "31985719" },
  { poster: "/assets/imgImage4.png", cap: "Pay Per Use", video: "29382657" },
  { poster: "/assets/imgImage5.png", cap: "Expert-Level Diagnostics. Made Simple.", video: "37747582" },
  { poster: "/assets/imgImage6.png", cap: "Diagnose Faster. Keep Trucks Moving.", video: "37732837" },
  { poster: "/assets/imgImage7.png", cap: "Expert Diagnostics. Without the Learning Curve.", video: "37551397" },
  { poster: "/assets/imgImage6.png", cap: "Clear Reports. Faster Decisions.", video: "8134381" },
];

function pexelsSources(id: string): string[] {
  // The /download/ URL 302-redirects to the real CDN file (the file id differs
  // from the video-page id, so hand-constructed videos.pexels.com URLs 403).
  return [`https://www.pexels.com/download/video/${id}/`];
}

export default function UseCases() {
  const [playing, setPlaying] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const marqueeRef = useRef<HTMLDivElement>(null);
  useMarqueeScroll(marqueeRef, { direction: 1, paused: playing !== null });

  function play(key: string, id: string) {
    // stop any other playing video
    Object.entries(videoRefs.current).forEach(([k, v]) => {
      if (k !== key && v) v.pause();
    });
    setPlaying(key);
    const v = videoRefs.current[key];
    if (!v) return;
    const sources = pexelsSources(id);
    let idx = 0;
    const tryPlay = () => {
      if (idx >= sources.length) {
        setPlaying(null);
        return;
      }
      v.src = sources[idx++];
      v.load();
      const onErr = () => {
        v.removeEventListener("error", onErr);
        tryPlay();
      };
      v.addEventListener("error", onErr, { once: true });
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          v.removeEventListener("error", onErr);
          tryPlay();
        });
      }
    };
    tryPlay();
  }

  const renderCards = (copy: number, ariaHidden: boolean) =>
    CARDS.map((c, i) => {
      const key = `${copy}-${i}`;
      const isPlaying = playing === key;
      return (
        <div className="uc-card" key={key} aria-hidden={ariaHidden}>
          <div className="uc-card__img">
            <video
              ref={(el) => {
                videoRefs.current[key] = el;
              }}
              className="uc-card__video"
              playsInline
              controls={isPlaying}
              onEnded={() => setPlaying(null)}
              style={{ opacity: isPlaying ? 1 : 0 }}
            />
            {!isPlaying && <img className="uc-card__poster" src={c.poster} alt="" />}
            {!isPlaying && (
              <button
                className="uc-card__play"
                type="button"
                aria-label="Play video"
                tabIndex={ariaHidden ? -1 : 0}
                onClick={() => play(key, c.video)}
              >
                <img className="tri" src="/assets/imgBoxiconsPlayFilled.svg" alt="" />
              </button>
            )}
          </div>
          <div className="uc-card__cap">{c.cap}</div>
        </div>
      );
    });

  return (
    <section className="usecases">
      <h2 className="usecases__title">Real Use Cases</h2>
      <div className="uc-marquee" ref={marqueeRef}>
        <div className="uc-marquee__track">
          {renderCards(0, false)}
          {renderCards(1, true)}
        </div>
      </div>
    </section>
  );
}
