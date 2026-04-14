"use client";

import { useId, useState } from "react";
import type { ProductMeasurementsData } from "@/lib/products";
import { useProductColor } from "@/components/layout/product-color-context";
import { formatMeasureDisplay } from "@/lib/format-measure";
import { cn } from "@/lib/cn";

function IconHeight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="12" y="8" width="24" height="32" rx="2" />
      <path
        d="M24 14v20M21 17l3-3 3 3M21 31l3 3 3-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWidth({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <rect x="8" y="12" width="32" height="24" rx="2" />
      <path
        d="M14 24h20M17 21l-3 3 3 3M31 21l3 3-3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconDepth({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M10 18l14-8 14 8v20l-14 8-14-8V18z" strokeLinejoin="round" />
      <path d="M24 10v20M10 18l14 8 14-8" strokeLinejoin="round" />
    </svg>
  );
}

function IconWeight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M24 10c-3.3 0-6 2.5-6 5.5V19h-4l-1.5 17h23L30 19h-4v-3.5c0-3-2.7-5.5-6-5.5z" />
      <path d="M19.5 19h9" strokeLinecap="round" />
    </svg>
  );
}

const CELLS: {
  key: keyof ProductMeasurementsData["withoutPackaging"];
  label: string;
  Icon: typeof IconHeight;
}[] = [
  { key: "height", label: "Altura", Icon: IconHeight },
  { key: "width", label: "Largura", Icon: IconWidth },
  { key: "depth", label: "Profundidade", Icon: IconDepth },
  { key: "weight", label: "Peso", Icon: IconWeight },
];

type Mode = "without" | "with";

export function ProductMeasurements({ data }: { data: ProductMeasurementsData }) {
  const baseId = useId();
  const [mode, setMode] = useState<Mode>("without");
  const row = mode === "without" ? data.withoutPackaging : data.withPackaging;
  const color = useProductColor();
  const showColorPicker =
    Boolean(color?.hasColors && color.variants && color.variants.length > 0);

  return (
    <section
      className="rounded-2xl border border-zinc-200 bg-zinc-50"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="border-b border-zinc-200 px-4 py-4 sm:px-5 sm:py-4">
        <div className="flex flex-col gap-4">
          <h2
            id={`${baseId}-heading`}
            className="text-xs font-medium uppercase tracking-[0.2em] text-[#b49ecc]/90"
          >
            Medidas do produto
          </h2>
          {showColorPicker && color ? (
            <div className="flex flex-col gap-2">
              <p
                id={`${baseId}-color-label`}
                className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-zinc-500"
              >
                Cor
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-labelledby={`${baseId}-color-label`}
              >
                {color.variants!.map((v) => {
                  const selected = v.slug === color.colorSlug;
                  return (
                    <button
                      key={v.slug}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => color.setColorSlug(v.slug)}
                      className={cn(
                        "min-h-[2.5rem] rounded-xl border px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
                        selected
                          ? "border-[#CB634E] bg-white text-foreground ring-1 ring-[#CB634E]/30"
                          : "border-zinc-200 bg-zinc-100/80 text-zinc-600 hover:border-zinc-300 hover:text-foreground",
                      )}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          <div
            className="flex w-full rounded-xl border border-zinc-200 bg-zinc-100 p-1"
            role="tablist"
            aria-label="Tipo de medida"
          >
            <button
              type="button"
              role="tab"
              id={`${baseId}-tab-without`}
              aria-selected={mode === "without"}
              tabIndex={mode === "without" ? 0 : -1}
              className={cn(
                "min-h-[2.5rem] flex-1 rounded-lg px-3 py-2 text-center text-xs font-medium transition sm:px-4 sm:text-sm",
                mode === "without"
                  ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-300"
                  : "text-zinc-600 hover:text-zinc-900",
              )}
              onClick={() => setMode("without")}
            >
              Sem embalagem
            </button>
            <button
              type="button"
              role="tab"
              id={`${baseId}-tab-with`}
              aria-selected={mode === "with"}
              tabIndex={mode === "with" ? 0 : -1}
              className={cn(
                "min-h-[2.5rem] flex-1 rounded-lg px-3 py-2 text-center text-xs font-medium transition sm:px-4 sm:text-sm",
                mode === "with"
                  ? "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-300"
                  : "text-zinc-600 hover:text-zinc-900",
              )}
              onClick={() => setMode("with")}
            >
              Com embalagem
            </button>
          </div>
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${mode}`}
        aria-labelledby={mode === "without" ? `${baseId}-tab-without` : `${baseId}-tab-with`}
        className="p-4 sm:p-5"
      >
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2.5 sm:grid-cols-[repeat(4,minmax(0,1fr))] sm:gap-3">
          {CELLS.map(({ key, label, Icon }) => (
            <div
              key={key}
              className={cn(
                "flex min-h-0 min-w-0 w-full flex-col items-center overflow-hidden rounded-xl border border-zinc-200 bg-white px-2 py-3 text-center sm:px-3 sm:py-4",
                "shadow-[inset_0_1px_0_0_rgba(0,0,0,0.03)]",
              )}
            >
              <div
                className="mb-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-[#b49ecc] ring-1 ring-zinc-200/80 sm:mb-3 sm:h-11 sm:w-11"
                aria-hidden
              >
                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <p className="w-full min-w-0 max-w-full break-words px-0.5 text-base font-semibold tabular-nums tracking-tight text-foreground sm:text-[1.0625rem]">
                {formatMeasureDisplay(row[key])}
              </p>
              <p
                className={cn(
                  "mt-1.5 w-full min-w-0 max-w-full hyphens-auto break-words px-0.5 text-center",
                  "text-[0.6rem] font-medium uppercase leading-snug tracking-wide text-zinc-500",
                  "sm:mt-2 sm:text-[0.65rem] sm:tracking-[0.1em]",
                )}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
