"use client";

import { useLayoutEffect, useRef, useState } from "react";

/** Caracteres acima disto: assume-se que pode haver conteúdo colapsado (evita sumir o link ao mudar largura da viewport). */
const MIN_CHARS_FOR_TOGGLE_HEURISTIC = 96;

type ProductDescriptionExpandableProps = {
  description: string;
  /** Ex.: `mt-0` quando o espaçamento vem do `gap` do pai (mobile abaixo das miniaturas). */
  className?: string;
};

function shouldShowToggle(
  el: HTMLParagraphElement | null,
  text: string,
): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  if (trimmed.includes("\n")) return true;
  if (trimmed.length >= MIN_CHARS_FOR_TOGGLE_HEURISTIC) return true;

  if (!el) return false;

  try {
    const verticalOverflow = el.scrollHeight > el.clientHeight + 1;
    const horizontalOverflow = el.scrollWidth > el.clientWidth + 1;
    return verticalOverflow || horizontalOverflow;
  } catch {
    return trimmed.length > 0;
  }
}

export function ProductDescriptionExpandable({
  description,
  className,
}: ProductDescriptionExpandableProps) {
  const [showToggle, setShowToggle] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const update = () => {
      setShowToggle(shouldShowToggle(textRef.current, description));
    };

    update();

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      try {
        resizeObserver = new ResizeObserver(() => {
          update();
        });
        resizeObserver.observe(el);
      } catch {
        /* ignore */
      }
    }

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [description]);

  return (
    <div className={className ?? "mt-3"}>
      <div className="flex flex-col gap-1 sm:gap-2">
        <div className="overflow-hidden">
          <p
            ref={textRef}
            className="line-clamp-1 overflow-hidden text-base whitespace-pre-line text-zinc-600"
          >
            {description}
          </p>
        </div>
        {showToggle && (
          <a
            href="#produto-descricao"
            className="inline-flex w-full items-center justify-start gap-1.5 text-left text-sm font-medium text-[#b49ecc] underline-offset-4 hover:underline sm:w-auto sm:justify-start"
          >
            Conferir mais detalhes do produto
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
