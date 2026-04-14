import { HeroCarousel } from "@/components/sections/hero-carousel";

export function HeroSection() {
  return (
    <section className="relative overflow-x-hidden">
      {/* Full-bleed: 100% da largura da viewport, sem padding lateral */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-background/0 via-background/15 to-background"
        />
        <HeroCarousel className="relative z-10" />
      </div>
    </section>
  );
}

