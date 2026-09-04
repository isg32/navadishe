'use client';

import { useEffect } from 'react';

// Renders nothing — just wires up the same reveal-on-scroll behavior the
// static site used: elements with class="reveal" get class="in" added
// either immediately (already in the viewport at mount, or reduced-motion)
// or the first time they scroll into view. The synchronous "already in
// viewport" check plus a slightly-early rootMargin avoids a flaky timing
// artifact where reveals could fire visibly after the user scrolls to them.
export default function ScrollReveal() {
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealEls.forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: '0px 0px 15% 0px' }
    );

    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        el.classList.add('in');
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);

  return null;
}
