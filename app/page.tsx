import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HeroSection } from "@/components/marketing/hero-section";

const features = [
  {
    title: "Beautiful by default",
    description:
      "Five stunning themes that make every form look professionally designed. No CSS required.",
  },
  {
    title: "Brand kit",
    description:
      "Your logo, your colors, your forms. Every theme adapts to match your brand identity.",
  },
  {
    title: "Open source",
    description:
      "Fully transparent and community-driven. Inspect the code, contribute, or self-host.",
  },
  {
    title: "Unlimited free",
    description:
      "No form limits, no response caps on the free plan. Build as many forms as you need.",
  },
  {
    title: "Mobile-first",
    description:
      "Every form is responsive out of the box. Perfect experience on any device.",
  },
  {
    title: "Fast loading",
    description:
      "Optimized for speed with zero bloat. Your forms load instantly, every time.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
      </main>

      <SiteFooter />
    </div>
  );
}
