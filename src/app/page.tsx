import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BrowseCategoriesSection } from "@/components/sections/browse-categories-section";
import { HeroSection } from "@/components/sections/hero-section";

export default function Home() {
  return (
    <div className="min-h-full bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <BrowseCategoriesSection />
      </main>
      <SiteFooter />
    </div>
  );
}
