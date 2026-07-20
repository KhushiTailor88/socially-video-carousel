import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is inside the viewport (or a scrollable
 * ancestor's viewport) and whether it has ever entered it at least once.
 * Used to drive lazy-loading and play/pause-when-out-of-view behaviour.
 */
export default function useIntersectionObserver({
  root = null,
  rootMargin = "0px",
  threshold = 0.5,
} = {}) {
  const elementRef = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasEnteredOnce, setHasEnteredOnce] = useState(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) setHasEnteredOnce(true);
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold]);

  return { elementRef, isIntersecting, hasEnteredOnce };
}
