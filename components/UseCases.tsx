"use client";

import { useRef, useState } from "react";
import { useMarqueeScroll } from "@/lib/useMarqueeScroll";

type Card = { poster: string; cap: string; clip: string };

// Clips are served locally from /public/videos. For production, set
// NEXT_PUBLIC_MEDIA_BASE_URL to an Azure Blob/Front Door (CDN) base and the same
// paths are served from there instead — no code change needed.
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/$/, "");
const clipUrl = (path: string) => `${MEDIA_BASE}${path}`;

const CARDS: Card[] = [
  { poster: "/assets/imgImage3.png", cap: "Multiple Systems. One Tool.", clip: "/videos/use-case-1.mp4" },
  { poster: "/assets/imgImage4.png", cap: "Pay Per Use", clip: "/videos/use-case-2.mp4" },
  { poster: "/assets/imgImage5.png", cap: "Expert-Level Diagnostics. Made Simple.", clip: "/videos/use-case-3.mp4" },
  { poster: "/assets/imgImage6.png", cap: "Diagnose Faster. Keep Trucks Moving.", clip: "/videos/use-case-4.mp4" },
  { poster: "/assets/imgImage7.png", cap: "Expert Diagnostics. Without the Learning Curve.", clip: "/videos/use-case-5.mp4" },
  { poster: "/assets/imgImage6.png", cap: "Clear Reports. Faster Decisions.", clip: "/videos/use-case-6.mp4" },
];

export default function UseCases() {
  const [playing, setPlaying] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const marqueeRef = useRef<HTMLDivElement>(null);
  useMarqueeScroll(marqueeRef, { direction: 1, paused: playing !== null });

  function play(key: string, clip: string) {
    // stop any other playing video
    Object.entries(videoRefs.current).forEach(([k, v]) => {
      if (k !== key && v) v.pause();
    });
    setPlaying(key);
    const v = videoRefs.current[key];
    if (!v) return;

    // On touch devices play in native fullscreen so the inline video never
    // competes with the row swipe; return to the poster when fullscreen closes.
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      const reset = () => {
        try {
          v.pause();
        } catch {}
        setPlaying(null);
      };
      const onFsChange = () => {
        if (!document.fullscreenElement) {
          document.removeEventListener("fullscreenchange", onFsChange);
          reset();
        }
      };
      const onMeta = () => {
        const anyV = v as unknown as {
          requestFullscreen?: () => Promise<void>;
          webkitEnterFullscreen?: () => void;
        };
        if (anyV.requestFullscreen) {
          document.addEventListener("fullscreenchange", onFsChange);
          anyV.requestFullscreen().catch(() => {});
        } else if (anyV.webkitEnterFullscreen) {
          anyV.webkitEnterFullscreen(); // iOS Safari
        }
      };
      v.addEventListener("loadedmetadata", onMeta, { once: true });
      v.addEventListener("webkitendfullscreen", reset, { once: true });
    }

    v.src = clipUrl(clip);
    v.load();
    const onErr = () => {
      v.removeEventListener("error", onErr);
      setPlaying(null);
    };
    v.addEventListener("error", onErr, { once: true });
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
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
                onClick={() => play(key, c.clip)}
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
