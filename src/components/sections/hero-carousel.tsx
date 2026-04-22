"use client";

import Image from "next/image";
import { IMAGE_QUALITY } from "@/lib/next-image-quality";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  HERO_CAROUSEL_SLIDES,
  type HeroCarouselVideoSlide,
} from "@/lib/hero-carousel-slides";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

/** Um único elemento de vídeo por slide (Safari iOS falha com dois vídeos e autoplay). */
function HeroVideoSlide({
  slide,
  slideIndex,
  activeIndex,
  prefersReducedMotion,
  onEnded,
  onContainerRef,
}: {
  slide: HeroCarouselVideoSlide;
  slideIndex: number;
  activeIndex: number;
  prefersReducedMotion: boolean;
  onEnded: () => void;
  onContainerRef: (el: HTMLDivElement | null) => void;
}) {
  /**
   * Ficheiro desktop só em ecrã largo **com** hover fino (rato/trackpad).
   * iPhone em paisagem passa de 768px mas (hover: none) — mantém o MP4 mobile
   * (mais leve); o desktop 4K falhava decode / ecrã preto no iOS.
   */
  const [useDesktopFile, setUseDesktopFile] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isFirstSrcEffect = useRef(true);

  useLayoutEffect(() => {
    const mqW = window.matchMedia("(min-width: 768px)");
    const mqHover = window.matchMedia("(hover: hover)");
    const sync = () => {
      const useDesktop = mqW.matches && mqHover.matches;
      setUseDesktopFile(useDesktop);
    };
    sync();
    mqW.addEventListener("change", sync);
    mqHover.addEventListener("change", sync);
    return () => {
      mqW.removeEventListener("change", sync);
      mqHover.removeEventListener("change", sync);
    };
  }, [slide.desktop, slide.mobile]);

  const src = useDesktopFile ? slide.desktop : slide.mobile;

  // Sem key={src}: key fazia remount do <video> durante play() → AbortError e ecrã preto (mobile/desktop).
  // Após mudança de src (ex. rotação), forçar load no mesmo elemento.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isFirstSrcEffect.current) {
      isFirstSrcEffect.current = false;
      return;
    }
    v.load();
  }, [src]);

  return (
    <div
      ref={onContainerRef}
      className="relative h-full w-full shrink-0 overflow-hidden bg-black"
      role="group"
      aria-label={slide.alt}
    >
      <video
        data-hero-video
        className={cn(
          "h-full w-full object-cover",
          "max-md:absolute max-md:inset-0",
          "md:absolute md:inset-y-0 md:left-1/2 md:right-auto md:h-full md:w-auto md:max-w-none md:-translate-x-1/2 md:object-contain",
        )}
        src={src}
        muted
        playsInline
        controls={false}
        preload="auto"
        ref={(el) => {
          videoRef.current = el;
          if (el) {
            el.setAttribute("playsinline", "");
            el.setAttribute("webkit-playsinline", "true");
          }
        }}
        aria-hidden
        onEnded={onEnded}
        onCanPlay={(e) => {
          if (slideIndex !== activeIndex || prefersReducedMotion) return;
          const v = e.currentTarget;
          v.muted = true;
          void v.play().catch(() => {});
        }}
      />
    </div>
  );
}

export function HeroCarousel({
  className,
  autoplayMs = 6500,
}: {
  className?: string;
  autoplayMs?: number;
}) {
  const regionId = useId();
  const prefersReducedMotion = usePrefersReducedMotion();

  const slides = HERO_CAROUSEL_SLIDES;

  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffsetPx, setDragOffsetPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const timerRef = useRef<number | null>(null);
  const swipeRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    isDragging: boolean;
  } | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  /** Compara índice anterior ao atual para fazer seek a 0 ao entrar num slide de vídeo. */
  const prevSlideIndexRef = useRef(index);

  const total = slides.length;
  const currentSlide = slides[index];

  useEffect(() => {
    const prevIndex = prevSlideIndexRef.current;
    const slideIndexChanged = prevIndex !== index;
    prevSlideIndexRef.current = index;

    const mq = window.matchMedia("(min-width: 768px)");
    const syncVideoPlayback = () => {
      slideRefs.current.forEach((node, i) => {
        if (!node) return;
        if (slides[i]?.kind !== "video") return;

        const v = node.querySelector<HTMLVideoElement>("[data-hero-video]");
        if (!v) return;

        if (i !== index) {
          v.pause();
          return;
        }

        if (slideIndexChanged && slides[i]?.kind === "video" && i === index) {
          try {
            v.currentTime = 0;
          } catch {
            /* seek antes de metadata */
          }
        }

        if (prefersReducedMotion) {
          v.pause();
          return;
        }

        v.muted = true;
        const playIt = () => {
          void v.play().catch(() => {});
        };
        playIt();
        requestAnimationFrame(() => {
          playIt();
          requestAnimationFrame(playIt);
        });
      });
    };

    syncVideoPlayback();
    mq.addEventListener("change", syncVideoPlayback);
    return () => mq.removeEventListener("change", syncVideoPlayback);
  }, [index, prefersReducedMotion, slides]);

  const goTo = (next: number) => setIndex(((next % total) + total) % total);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const advanceAfterVideo = () => {
    setIndex((i) => {
      if (slides[i]?.kind !== "video") return i;
      return (i + 1) % total;
    });
  };

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    if (currentSlide?.kind === "video" && !prefersReducedMotion) {
      return;
    }

    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, autoplayMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [autoplayMs, prefersReducedMotion, isPaused, total, currentSlide?.kind]);

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {index + 1} de {total}
      </div>

      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label="Carrossel de destaques"
        aria-describedby={regionId}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") prev();
          if (e.key === "ArrowRight") next();
        }}
        className="outline-none"
      >
        <div className="relative w-full overflow-hidden bg-zinc-100">
          <div
            ref={viewportRef}
            className={cn(
              "relative min-h-[240px] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing",
              "h-[calc(100svh-var(--site-header-h,_4rem))] max-h-[calc(100svh-var(--site-header-h,_4rem))]",
              "[&_img]:pointer-events-none [&_img]:[-webkit-user-drag:none]",
              "[&_video]:pointer-events-none",
            )}
            onPointerDown={(e) => {
              if (total <= 1) return;
              // Só botão principal (evita clique com botão direito, etc.)
              if (e.pointerType === "mouse" && e.button !== 0) return;
              swipeRef.current = {
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                lastX: e.clientX,
                isDragging: false,
              };
              setIsPaused(true);
              (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
            }}
            onPointerMove={(e) => {
              const s = swipeRef.current;
              if (!s || s.pointerId !== e.pointerId) return;
              const dx = e.clientX - s.startX;
              const dy = e.clientY - s.startY;

              // Começa a considerar "arrasto" quando movimento horizontal domina
              if (!s.isDragging) {
                if (Math.abs(dx) < 8) return;
                if (Math.abs(dy) > Math.abs(dx)) return; // deixa scroll vertical
                s.isDragging = true;
                setIsDragging(true);
              }

              // Durante drag horizontal, evita seleção/gestos indesejados
              e.preventDefault();
              s.lastX = e.clientX;
              setDragOffsetPx(dx);
            }}
            onPointerUp={(e) => {
              const s = swipeRef.current;
              if (!s || s.pointerId !== e.pointerId) return;
              const dx = e.clientX - s.startX;
              const dy = e.clientY - s.startY;
              swipeRef.current = null;
              setIsPaused(false);
              setIsDragging(false);

              // Se foi mais vertical que horizontal, não troca.
              if (Math.abs(dy) > Math.abs(dx)) {
                setDragOffsetPx(0);
                return;
              }

              const SWIPE_THRESHOLD_PX = 48;
              if (dx <= -SWIPE_THRESHOLD_PX) {
                next();
              } else if (dx >= SWIPE_THRESHOLD_PX) {
                prev();
              }
              setDragOffsetPx(0);
            }}
            onPointerCancel={(e) => {
              const s = swipeRef.current;
              if (!s || s.pointerId !== e.pointerId) return;
              swipeRef.current = null;
              setIsPaused(false);
              setIsDragging(false);
              setDragOffsetPx(0);
            }}
          >
            <div
              className={cn(
                "absolute inset-0 flex",
                prefersReducedMotion ? "transition-none" : "transition-transform duration-300 ease-out",
                isDragging ? "transition-none" : "",
              )}
              style={{
                transform: `translate3d(calc(${-index * 100}% + ${dragOffsetPx}px), 0, 0)`,
              }}
            >
              {slides.map((slide, i) => {
                if (slide.kind === "video") {
                  return (
                    <HeroVideoSlide
                      key={`video-${slide.desktop}`}
                      slide={slide}
                      slideIndex={i}
                      activeIndex={index}
                      prefersReducedMotion={prefersReducedMotion}
                      onEnded={advanceAfterVideo}
                      onContainerRef={(el) => {
                        slideRefs.current[i] = el;
                      }}
                    />
                  );
                }

                return (
                  <div
                    key={`${slide.desktop}|${slide.mobile}`}
                    ref={(el) => {
                      slideRefs.current[i] = el;
                    }}
                    className="relative h-full w-full shrink-0 overflow-hidden bg-zinc-900"
                  >
                    {/* Fundo: mesma arte ampliada + blur para preencher faixas laterais / cantos */}
                    <div
                      className="pointer-events-none absolute inset-0 z-0 md:hidden"
                      aria-hidden
                    >
                      <Image
                        src={slide.mobile}
                        alt=""
                        fill
                        quality={75}
                        draggable={false}
                        priority={false}
                        sizes="100vw"
                        className="origin-center scale-[1.22] object-cover object-center blur-3xl brightness-[0.88] saturate-[1.08]"
                      />
                    </div>
                    <div
                      className="pointer-events-none absolute inset-0 z-0 hidden md:block"
                      aria-hidden
                    >
                      <Image
                        src={slide.desktop}
                        alt=""
                        fill
                        quality={75}
                        draggable={false}
                        priority={false}
                        sizes="100vw"
                        className="origin-center scale-[1.14] object-cover object-center blur-3xl brightness-[0.88] saturate-[1.08]"
                      />
                    </div>

                    {/* Arte nítida: mobile / desktop */}
                    <Image
                      src={slide.mobile}
                      alt={slide.alt}
                      fill
                      quality={IMAGE_QUALITY.max}
                      draggable={false}
                      priority={i === 1}
                      sizes="(max-width: 767px) 100vw, 0px"
                      className="z-10 object-cover object-top md:hidden"
                    />
                    <Image
                      src={slide.desktop}
                      alt={slide.alt}
                      width={2560}
                      height={1440}
                      quality={
                        slide.kind === "image" &&
                        slide.desktopImageQuality != null
                          ? slide.desktopImageQuality
                          : IMAGE_QUALITY.max
                      }
                      draggable={false}
                      priority={i === 1}
                      sizes="(max-width: 767px) 0px, 100vw"
                      className={cn(
                        "pointer-events-none z-10 hidden md:block",
                        "absolute left-1/2 top-0 h-full w-auto max-h-full max-w-none -translate-x-1/2",
                        slide.kind === "image" && slide.desktopImageClassName,
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Setas laterais (sobrepostas) */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-3 sm:px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prev}
              aria-label="Slide anterior"
              disabled={total <= 1}
              className={cn(
                "pointer-events-auto h-11 w-11 rounded-full",
                "border border-zinc-200 bg-white/85 backdrop-blur hover:bg-white",
              )}
            >
              ←
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={next}
              aria-label="Próximo slide"
              disabled={total <= 1}
              className={cn(
                "pointer-events-auto h-11 w-11 rounded-full",
                "border border-zinc-200 bg-white/85 backdrop-blur hover:bg-white",
              )}
            >
              →
            </Button>
          </div>

          {/* Bolinhas (sobrepostas) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex justify-center">
            <div
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-black/25 px-3 py-2 backdrop-blur"
              aria-label="Selecionar slide"
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ir para o slide ${i + 1}`}
                  aria-current={i === index ? "true" : undefined}
                  disabled={total <= 1}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors shadow-sm ring-1 ring-black/15",
                    i === index ? "bg-[#b49ecc]" : "bg-white",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <p id={regionId} className="sr-only">
          Use as setas esquerda e direita para navegar pelos slides.
        </p>
      </div>
    </div>
  );
}

