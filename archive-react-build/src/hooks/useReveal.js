import { useEffect, useRef, useState } from 'react';

export default function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    // Elements already in (or near) the viewport at mount time reveal
    // immediately, rather than waiting on IntersectionObserver's async
    // first callback — under main-thread contention (e.g. several large
    // images decoding at once) that callback can lag, leaving above-the-
    // fold content stuck at opacity 0 for longer than it should be.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      // Trigger while the element is still ~15% of a viewport below the
      // fold, so the 700ms fade has time to finish before the user
      // actually scrolls it into view.
      { threshold: 0.01, rootMargin: '0px 0px 15% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}
