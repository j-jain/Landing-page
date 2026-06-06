"use client";

import { useRef, useState } from "react";
import { useMarqueeScroll } from "@/lib/useMarqueeScroll";

type Card = { poster: string; cap: string; clip: string };

// Local dev: clips serve from /public/videos. In production, set
// NEXT_PUBLIC_MEDIA_BASE_URL to an external host (GitHub Release assets, or a
// CDN/Blob) where the files live flat — clips resolve to <base>/<file>.
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/$/, "");
const clipUrl = (file: string) =>
  MEDIA_BASE ? `${MEDIA_BASE}/${file}` : `/videos/${file}`;

const CARDS: Card[] = [
  { poster: "/assets/imgImage3.png", cap: "Multiple Systems. One Tool.", clip: "use-case-1.mp4" },
  { poster: "/assets/imgImage4.png", cap: "Pay Per Use", clip: "use-case-2.mp4" },
  { poster: "/assets/imgImage5.png", cap: "Expert-Level Diagnostics. Made Simple.", clip: "use-case-3.mp4" },
  { poster: "/assets/imgImage6.png", cap: "Diagnose Faster. Keep Trucks Moving.", clip: "use-case-4.mp4" },
  { poster: "/assets/imgImage7.png", cap: "Expert Diagnostics. Without the Learning Curve.", clip: "use-case-5.mp4" },
  { poster: "/assets/imgImage6.png", cap: "Clear Reports. Faster Decisions.", clip: "use-case-6.mp4" },
];

// Devices with a real hovering pointer (desktop) play on hover; touch devices
// fall back to tap-to-play (no hover exists there).
const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function UseCases() {
  const [playing, setPlaying] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const marqueeRef = useRef<HTMLDivElement>(null);
  useMarqueeScroll(marqueeRef, { direction: 1, paused: playing !== null });

  function pauseOthers(except: string) {
    Object.entries(videoRefs.current).forEach(([k, v]) => {
      if (k !== except && v) {
        try {
          v.pause();
        } catch {}
      }
    });
  }

  // Desktop: play muted + looping while the pointer is over the card.
  function startHover(key: string, clip: string) {
    if (!finePointer()) return; // touch uses tap-to-play
    const v = videoRefs.current[key];
    if (!v) return;
    pauseOthers(key);
    if (!v.getAttribute("src")) v.src = clipUrl(clip);
    v.muted = true;
    v.loop = true;
    v.controls = false; // hover preview has no controls
    setPlaying(key);
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  function stopHover(key: string) {
    if (!finePointer()) return;
    const v = videoRefs.current[key];
    if (v) {
      try {
        v.pause();
        v.currentTime = 0;
      } catch {}
    }
    setPlaying((cur) => (cur === key ? null : cur));
  }

  // Touch: tap the play button -> play INLINE (not fullscreen) with sound +
  // native controls. `playsInline` on the <video> keeps iOS from going fullscreen.
  function tapPlay(key: string, clip: string) {
    const v = videoRefs.current[key];
    if (!v) return;
    pauseOthers(key);
    if (!v.getAttribute("src")) v.src = clipUrl(clip);
    v.muted = false;
    v.loop = false;
    v.controls = true; // let the viewer pause/scrub inline
    setPlaying(key);
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  const renderCards = (copy: number, ariaHidden: boolean) =>
    CARDS.map((c, i) => {
      const key = `${copy}-${i}`;
      const isPlaying = playing === key;
      return (
        <div className="uc-card" key={key} aria-hidden={ariaHidden}>
          <div
            className="uc-card__img"
            onMouseEnter={() => startHover(key, c.clip)}
            onMouseLeave={() => stopHover(key)}
          >
            <video
              ref={(el) => {
                videoRefs.current[key] = el;
              }}
              className="uc-card__video"
              playsInline
              preload="none"
              onEnded={() => setPlaying(null)}
              style={{
                opacity: isPlaying ? 1 : 0,
                pointerEvents: isPlaying ? "auto" : "none",
              }}
            />
            {!isPlaying && <img className="uc-card__poster" src={c.poster} alt="" />}
            {!isPlaying && (
              <button
                className="uc-card__play"
                type="button"
                aria-label="Play video"
                tabIndex={ariaHidden ? -1 : 0}
                onClick={() => tapPlay(key, c.clip)}
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
