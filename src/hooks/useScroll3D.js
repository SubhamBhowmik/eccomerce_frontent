/**
 * useScroll3D — Hook for scroll-driven 3D transforms and parallax effects
 * Provides scroll progress, mouse position, and element visibility tracking
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Scroll Progress ───────────────────────────────────────────────────────────
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}

// ── Mouse Position (normalized) ──────────────────────────────────────────────
export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e) => {
      requestAnimationFrame(() => {
        setPos({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      });
    };

    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return pos;
}

// ── Element 3D Parallax (track element position relative to viewport) ────────
export function useParallax3D(ref, { intensity = 0.08, perspective = 1200 } = {}) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId;

    const update = () => {
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (centerY - viewCenter) / viewCenter;
        const clamped = Math.max(-1, Math.min(1, offset));

        const rotateX = clamped * intensity * 60;
        const translateZ = -Math.abs(clamped) * 40;

        setStyle({
          transform: `perspective(${perspective}px) rotateX(${rotateX}deg) translateZ(${translateZ}px)`,
          transition: 'transform 0.15s ease-out',
        });
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      cancelAnimationFrame(rafId);
    };
  }, [ref, intensity, perspective]);

  return style;
}

// ── Intersection Observer for stagger / reveal animations ────────────────────
export function useReveal3D({ threshold = 0.15, staggerDelay = 80 } = {}) {
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef(null);

  const observeItem = useCallback((el) => {
    if (!el || observerRef.current) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(entry.target.dataset.revealIndex));
          }
        });
      },
      { threshold }
    );

    observerRef.current = obs;

    // Observe children with data-reveal-index
    requestAnimationFrame(() => {
      const children = el.querySelectorAll('[data-reveal-index]');
      children.forEach((child) => obs.observe(child));
    });
  }, [threshold]);

  const getRevealStyle = (index) => {
    const isVisible = visibleItems.has(String(index));
    const delay = index * staggerDelay;

    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible
        ? 'perspective(800px) rotateY(0deg) translateZ(0) scale(1)'
        : 'perspective(800px) rotateY(12deg) translateZ(-60px) scale(0.92)',
      transition: `opacity 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms, transform 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${delay}ms`,
      willChange: 'transform, opacity',
    };
  };

  return { observeItem, getRevealStyle };
}

// ── 3D Tilt on Mouse Move (for cards) ────────────────────────────────────────
export function useTilt3D(ref, { maxTilt = 8, scale = 1.02 } = {}) {
  const [tiltStyle, setTiltStyle] = useState({});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e) => {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltX = (y - 0.5) * maxTilt * 2;
        const tiltY = (0.5 - x) * maxTilt * 2;

        setTiltStyle({
          transform: `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`,
          transition: 'transform 0.1s ease-out',
        });
      });
    };

    const handleLeave = () => {
      setTiltStyle({
        transform: 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      });
    };

    el.addEventListener('mousemove', handleMove, { passive: true });
    el.addEventListener('mouseleave', handleLeave, { passive: true });

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [ref, maxTilt, scale]);

  return tiltStyle;
}