"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { SiteNavLink } from "@/components/layout/site-nav-link";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

const PANEL_TRANSITION_MS = 300;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <path d="M6 18L18 6M6 6l12 12" />
      ) : (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" />
        </>
      )}
    </svg>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [panelEntered, setPanelEntered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closeFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();

  useEffect(() => {
    // Portal do menu móvel precisa de `document.body`; evita mismatch de hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-only flag
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen && panelEntered) {
      queueMicrotask(() => closeBtnRef.current?.focus());
    }
  }, [mobileOpen, panelEntered]);

  const finishClose = useCallback(() => {
    setMobileOpen(false);
    setPanelEntered(false);
  }, []);

  const closeMobile = useCallback(() => {
    if (closeFallbackTimerRef.current) {
      clearTimeout(closeFallbackTimerRef.current);
      closeFallbackTimerRef.current = null;
    }
    if (!mobileOpen) return;
    if (!panelEntered) {
      finishClose();
      return;
    }
    setPanelEntered(false);
    closeFallbackTimerRef.current = setTimeout(() => {
      closeFallbackTimerRef.current = null;
      finishClose();
    }, PANEL_TRANSITION_MS + 80);
  }, [mobileOpen, panelEntered, finishClose]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  useEffect(
    () => () => {
      if (closeFallbackTimerRef.current) {
        clearTimeout(closeFallbackTimerRef.current);
      }
    },
    [],
  );

  function handlePanelTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    if (e.propertyName !== "transform") return;
    if (panelEntered) return;
    if (closeFallbackTimerRef.current) {
      clearTimeout(closeFallbackTimerRef.current);
      closeFallbackTimerRef.current = null;
    }
    finishClose();
  }

  const mobileMenu =
    mounted && mobileOpen ? (
      <>
        <div
          className={cn(
            "fixed inset-0 z-[60] bg-black/60 lg:hidden",
            "transition-opacity ease-out motion-reduce:transition-none",
            panelEntered ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
          aria-hidden
          onClick={closeMobile}
        />
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          onTransitionEnd={handlePanelTransitionEnd}
          className={cn(
            "fixed inset-y-0 right-0 z-[61] flex w-full max-w-sm flex-col",
            "border-l border-white/20 p-6 shadow-xl lg:hidden",
            "bg-[#87A0AB] text-white",
            "transform-gpu transition-transform ease-out motion-reduce:transition-none",
            panelEntered ? "translate-x-0" : "translate-x-full",
          )}
          style={{ transitionDuration: `${PANEL_TRANSITION_MS}ms` }}
        >
          <div className="flex items-center justify-end">
            <button
              ref={closeBtnRef}
              type="button"
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full",
                "border border-white/30 bg-white/10 text-white",
                "hover:bg-white/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#87A0AB]",
              )}
              aria-label="Fechar menu"
              onClick={closeMobile}
            >
              <MenuIcon open />
            </button>
          </div>
          <nav
            aria-label="Navegação principal"
            className="mt-6 flex flex-1 flex-col gap-1"
          >
            {SITE.nav.map((item) => (
              <SiteNavLink
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-3 text-base text-white/90 hover:bg-white/10 hover:text-white"
                onClick={closeMobile}
              >
                {item.label}
              </SiteNavLink>
            ))}
          </nav>
          <div className="mt-auto border-t border-white/20 pt-6">
            <a href="#contato" className="block" onClick={closeMobile}>
              <Button
                variant="ghost"
                size="md"
                className={cn(
                  "w-full border border-white/40 text-white hover:bg-white/15 hover:text-white",
                  "focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#87A0AB]",
                )}
              >
                Falar com a gente
              </Button>
            </a>
          </div>
        </div>
      </>
    ) : null;

  return (
    <header className="sticky top-0 z-50 border-b-4 border-b-[#CC298D] bg-[#87A0AB] text-white">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={closeMobile}>
          <span className="relative h-9 w-44">
            <Image
              src="/braslar-logo.svg"
              alt={`${SITE.name} — logo`}
              fill
              priority
              sizes="176px"
              className="object-contain brightness-0 invert"
            />
          </span>
          <span className="sr-only">{SITE.name}</span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 lg:flex"
        >
          {SITE.nav.map((item) => (
            <SiteNavLink
              key={item.href}
              href={item.href}
              className="text-sm text-white/90 hover:text-white"
            >
              {item.label}
            </SiteNavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href="#contato" className="hidden lg:block">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "border border-white/40 text-white hover:bg-white/15 hover:text-white",
                "focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#87A0AB]",
              )}
            >
              Falar com a gente
            </Button>
          </a>

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden",
              "border border-white/30 bg-white/10 text-white",
              "hover:bg-white/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[#87A0AB]",
            )}
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => {
              if (mobileOpen) closeMobile();
              else {
                setPanelEntered(false);
                setMobileOpen(true);
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => setPanelEntered(true));
                });
              }
            }}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileMenu ? createPortal(mobileMenu, document.body) : null}
    </header>
  );
}
