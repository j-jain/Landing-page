"use client";

import { RefObject, useEffect, useRef } from "react";

type Options = {
  /** +1 scrolls content leftward (default), -1 rolls left->right */
  direction?: 1 | -1;
  /** auto-advance speed in px/frame (~60fps) */
  speed?: number;
  /** external pause (e.g. a Use Cases video is playing) */
  paused?: boolean;
};

/**
 * Turns an `overflow-x` container holding TWO copies of its items into a
 * hybrid auto/manual marquee:
 *  - auto-advances scrollLeft each frame, with seamless wrap at the copy boundary
 *  - pauses on hover, on wheel/touch/drag interaction, and while `paused` is true
 *  - resumes ~1.2s after the last interaction
 *  - supports mouse drag-to-scroll (overflow doesn't drag with a mouse)
 *  - respects prefers-reduced-motion (no auto; still manually scrollable)
 */
export function useMarqueeScroll(
  ref: RefObject<HTMLDivElement>,
  opts: Options = {}
) {
  const { direction = 1, speed = 0.6, paused = false } = opts;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const IDLE = 1200;
    const now = () => performance.now();

    let raf = 0;
    let pos = 0;
    let hovering = false;
    let lastInteract = 0;

    // mouse-drag state
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const copyW = () => (el.scrollWidth / 2 ? el.scrollWidth / 2 : 1);

    // start testimonials (direction -1) from the middle so it can roll right
    requestAnimationFrame(() => {
      pos = direction < 0 ? copyW() : 0;
      el.scrollLeft = pos;
    });

    const tick = () => {
      const w = copyW();
      const auto =
        !hovering &&
        !dragging &&
        !pausedRef.current &&
        !reduce.matches &&
        now() - lastInteract > IDLE;
      pos = auto ? pos + direction * speed : el.scrollLeft;
      if (pos >= w) pos -= w;
      else if (pos < 0) pos += w;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const mark = () => {
      lastInteract = now();
    };
    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
      dragging = false;
      el.classList.remove("is-grabbing");
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return; // touch uses native scroll
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.classList.add("is-grabbing");
      mark();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      el.scrollLeft = startScroll - dx;
      mark();
    };
    const onPointerUp = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove("is-grabbing");
      mark();
    };
    // swallow the click that ends a drag so the play button isn't triggered
    const onClickCapture = (e: MouseEvent) => {
      if (moved) {
        e.stopPropagation();
        e.preventDefault();
        moved = false;
      }
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("wheel", mark, { passive: true });
    el.addEventListener("touchstart", mark, { passive: true });
    el.addEventListener("touchmove", mark, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("wheel", mark);
      el.removeEventListener("touchstart", mark);
      el.removeEventListener("touchmove", mark);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, [ref, direction, speed]);
}
