import { useEffect, useRef, useState } from 'react';

/**
 * Hook to reveal elements on scroll with fade-in and slide-up animation
 * Usage: const ref = useScrollReveal(); then <div ref={ref}>...</div>
 */
export function useScrollReveal(delay: number = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('reveal-visible');
            }, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    element.classList.add('reveal');
    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

/**
 * Hook for counting up numbers when scrolled into view
 */
export function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let start = 0;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(Math.floor(start));
              }
            }, 16);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return { count, ref };
}