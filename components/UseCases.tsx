"use client";

import { useRef, useState } from "react";
import { useMarqueeScroll } from "@/lib/useMarqueeScroll";

type Card = { poster: string; cap: string; clip: string };

// Local dev: clips serve from /public/videos. In production, set
// NEXT_PUBLIC_MEDIA_BASE_URL to an Azure Blob / CDN base where the files live
// flat — clips resolve to <base>/<file>.
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/$/, "");
const clipUrl = (file: string) =>
  MEDIA_BASE ? `${MEDIA_BASE}/${file}` : `/videos/${file}`;

const CARDS: Card[] = [
  { poster: "/assets/use-case-1-poster.jpg", cap: "Multiple Systems. One Tool.", clip: "use-case-1.mp4" },
  { poster: "/assets/use-case-2-poster.jpg", cap: "Pay Per Use", clip: "use-case-2.mp4" },
  { poster: "/assets/use-case-3-poster.jpg", cap: "Expert-Level Diagnostics. Made Simple.", clip: "use-case-3.mp4" },
  { poster: "/assets/use-case-4-poster.jpg", cap: "Diagnose Faster. Keep Trucks Moving.", clip: "use-case-4.mp4" },
  { poster: "/assets/use-case-5-poster.jpg", cap: "Expert Diagnostics. Without the Learning Curve.", clip: "use-case-5.mp4" },
  { poster: "/assets/use-case-6-poster.jpg", cap: "Clear Reports. Faster Decisions.", clip: "use-case-6.mp4" },
];

// Devices with a real hovering pointer (desktop) play on hover; touch devices
// fall back to the play button (no hover exists there).
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

  // Desktop: play WITH sound while the pointer is over the card. Browsers only
  // allow unmuted autoplay once the user has interacted with the page (any
  // click/tap grants it for the session); before that first interaction the
  // play() promise rejects — we keep the poster up rather than mute the clip.
  function startHover(key: string, clip: string) {
    if (!finePointer()) return; // touch devices have no hover -> use the play button
    const v = videoRefs.current[key];
    if (!v) return;
    pauseOthers(key);
    if (!v.getAttribute("src")) v.src = clipUrl(clip);
    v.muted = false; // audible
    v.volume = 1;
    v.loop = false;
    v.controls = true; // viewer can pause / scrub / adjust volume
    setPlaying(key);
    const p = v.play();
    if (p && typeof p.catch === "function")
      p.catch(() => {
        // Unmuted autoplay blocked (no interaction yet) -> revert to the poster.
        setPlaying((cur) => (cur === key ? null : cur));
      });
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

  // Touch: tap the play button -> play inline with sound + native controls. A tap
  // is a user gesture, so unmuted playback is always allowed here.
  function tapPlay(key: string, clip: string) {
    const v = videoRefs.current[key];
    if (!v) return;
    pauseOthers(key);
    if (!v.getAttribute("src")) v.src = clipUrl(clip);
    v.muted = false;
    v.volume = 1;
    v.loop = false;
    v.controls = true;
    setPlaying(key);
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  // Arrow nav: nudge the row by ~one card so users see there are more clips.
  // Dispatch a wheel event first so the auto-scroll marquee yields (it pauses
  // ~1.2s after any wheel/touch/drag interaction).
  function nudge(dir: 1 | -1) {
    const el = marqueeRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".uc-card");
    const step = card
      ? card.getBoundingClientRect().width + 70
      : el.clientWidth * 0.8;
    el.dispatchEvent(new WheelEvent("wheel", { deltaY: dir }));
    el.scrollBy({ left: dir * step, behavior: "smooth" });
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
              onEnded={() => setPlaying((cur) => (cur === key ? null : cur))}
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
                aria-label="Play video with sound"
                tabIndex={ariaHidden ? -1 : 0}
                onClick={(e) => {
                  e.stopPropagation();
                  tapPlay(key, c.clip);
                }}
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
    <section className="usecases" id="use-cases">
      <h2 className="usecases__title">Real Use Cases</h2>
      <div className="uc-carousel">
        <button
          className="uc-nav uc-nav--prev"
          type="button"
          aria-label="Previous videos"
          onClick={() => nudge(-1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="uc-marquee" ref={marqueeRef}>
          <div className="uc-marquee__track">
            {renderCards(0, false)}
            {renderCards(1, true)}
          </div>
        </div>
        <button
          className="uc-nav uc-nav--next"
          type="button"
          aria-label="See more videos"
          onClick={() => nudge(1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
