"use client";

import { useState, useEffect, useRef } from "react";

export function useIntersectionObserver(options: IntersectionObserverInit & { triggerOnce?: boolean }) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(([entry]) => {
      setEntry(entry);
      if (options.triggerOnce && entry.isIntersecting && ref.current) {
        observerRef.current?.unobserve(ref.current);
      }
    }, options);

    const { current: currentObserver } = observerRef;
    if (ref.current) {
      currentObserver.observe(ref.current);
    }

    return () => {
      currentObserver.disconnect();
    };
  }, [ref, options]);

  return [ref, entry] as const;
}

export function useParallax(speed: number) {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        const elementHeight = rect.height;
        const windowHeight = window.innerHeight;

        if (elementTop < scrollTop + windowHeight && elementTop + elementHeight > scrollTop) {
          setOffsetY((scrollTop - elementTop) * speed);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed]);

  return [ref, { transform: `translateY(${offsetY}px)` }] as const;
}

export function useSticky() {
  const [isSticky, setSticky] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        setSticky(ref.current.getBoundingClientRect().top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return [ref, isSticky] as const;
}

export function useLazyLoad() {
  const [isLoaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isLoaded] as const;
}

